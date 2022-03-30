using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Repository.Interface;
using static fjt.pricingservice.Helper.Helper;
using fjt.pricingservice.Helper;
using Newtonsoft.Json;
using RestSharp;
using System.Configuration;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.BOPartUpdate.Newark
{
    public class NewarkPartUpdateHandler : INewarkPartHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string NewarkQueueName = ConfigurationManager.AppSettings["BOMCleanNWQueue"].ToString();
        string NewarkScheduleQueueName = ConfigurationManager.AppSettings["PartCleanNWQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        public NewarkPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
            IDigikeyPricingRepository IDigikeyPricingRepository, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler, IRabbitMQ IRabbitMQ)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IRabbitMQ = IRabbitMQ;
        }
        public int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> componentList)
        {
            int result = checkNextSupplierDetail(Item, componentList);
            if (result == 0)
            {
                return 1;
            }
            if (Item.type != ConstantHelper.FJTSchedulePartUpdate)
            {
                if (Item.cleanType != CleanType.Part.ToString())
                {
                    bool partStatus = _IsystemconfigrationsRepository.getStatus(Item.partID.Value, Item.transactionID, Item.supplier);
                    if (!partStatus)
                        return 1;
                }
                var componentDetList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.Newark.GetEnumStringValue());
                if (componentDetList.Count() > 0)
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentDetList, Item);
                    return callToNextApi(objExternalPartVerificationRequestLog, componentDetList, false, true);
                }
            }
            var newarkConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Newark.GetEnumStringValue()).ToList();
            var NewarkApiKey = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkApiKey.GetEnumStringValue());
            var NewarkApiSecretKey = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkSecretKey.GetEnumStringValue());
            var NewarkApiCustomerID = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkCustomerID.GetEnumStringValue());
            var NewarkAPIRequestsLimit = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkAPIRequestsLimit.GetEnumStringValue());
            return SavePricingDetails(Item, NewarkApiKey.values, NewarkApiSecretKey.values, NewarkAPIRequestsLimit.values, componentList);
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save 
        /// </summary>
        /// <param name="objLineItem">rfq_lineitems</param>
        /// <param name="NewarkApiKey">string</param>
        private int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string NewarkApiKey, string secretKey, string NewarkAPIRequestsLimit, List<ComponentModel> componentList)
        {
            try
            {
                if (!string.IsNullOrEmpty(lineItem.transactionID) && lineItem.type == ConstantHelper.FJTSchedulePartUpdateV3)
                {
                    bool partStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartUpdateStatus(lineItem.partID.Value, lineItem.transactionID, UpdateComponentSupplier.DigiKey.GetEnumStringValue(), ConstantHelper.FJTSchedulePartUpdateV3);
                    if (partStatus)
                    {
                        return 1;
                    }
                }
                var response = CallApiGetResponse(ConstantHelper.NewarkBaseURI, NewarkApiKey, lineItem, ConstantHelper.NewarkSleepingTime, secretKey, componentList, NewarkAPIRequestsLimit);
                if (response.isSendRequestResponse) { return 1; }
                List<ComponentModel> listComponent = new List<ComponentModel>();
                bool isDiscontinue = false;
                if (response.resultParts != null)
                {
                    var refstring = JsonConvert.DeserializeObject<dynamic>(response.resultParts.ToString());
                    if (refstring.manufacturerPartNumberSearchReturn != null && refstring.manufacturerPartNumberSearchReturn.products != null)
                    {
                        foreach (var item in refstring.manufacturerPartNumberSearchReturn.products)
                        {
                            if (item.translatedManufacturerPartNumber == null)
                                continue;
                            string manufacturerPartNumber = item.translatedManufacturerPartNumber.Value;
                            string distyPart = item.sku;
                            if (manufacturerPartNumber.ToUpper().Trim() != lineItem.partNumber.ToUpper().Trim() && distyPart.ToUpper().Trim() != lineItem.partNumber.ToUpper().Trim())
                                continue;
                            ComponentModel objComponentModel = new ComponentModel();
                            objComponentModel.manufacturerName = item.brandName.Value;//manufacturer name
                            objComponentModel.mfgPN = manufacturerPartNumber.ToUpper().Trim();//manufacturer number
                            objComponentModel.partStatusText = ConstantHelper.Active; //part status
                            objComponentModel.ltbDate = null; //last time buy data
                            objComponentModel.mfgPnDescription = item.displayName; // part number description
                            objComponentModel.supplierName = lineItem.supplier; //supplier name from which details get
                            objComponentModel.productUrl = string.Format("{0}{1}", ConstantHelper.NewarkHomePageUrl, item.sku);

                            objComponentModel.uomText = item.unitOfMeasure == null ? ConstantHelper.DefaultUom : item.unitOfMeasure;//default uom each


                            decimal MinimumBuy = 0;
                            decimal.TryParse(item.translatedMinimumOrderQuality.ToString(), out MinimumBuy);
                            int? APILeadTime = null;
                            decimal weeks = 0;
                            if (item.stock != null && !string.IsNullOrEmpty(Convert.ToString(item.stock)) && !string.IsNullOrEmpty(Convert.ToString(item.stock.leastLeadTime)))
                            {
                                APILeadTime = item.stock.leastLeadTime.Value != null ? Convert.ToInt32(item.stock.leastLeadTime.Value) : null;
                                weeks = APILeadTime.Value / 7;
                                APILeadTime = (int)(Math.Ceiling(weeks));
                            }

                            int? noOfPosition = null;
                            string lengthtext = string.Empty;
                            string widthTxt = string.Empty;
                            string heightText = string.Empty;
                            string tolerance = string.Empty;
                            string minTempString = string.Empty;
                            string maxTempString = string.Empty;
                            double? minTemp = null;
                            double? maxTemp = null;
                            string features = string.Empty;
                            string packaging = string.Empty;
                            string sizeDimension = string.Empty;
                            string powerRating = string.Empty;
                            string value = string.Empty;
                            string voltage = string.Empty;
                            string partPackage = string.Empty;
                            string color = string.Empty;
                            string operatingTemp = string.Empty;
                            string noOfPositionText = string.Empty;
                            string noOfRowsText = string.Empty;
                            int? noOfRows = null;
                            objComponentModel.mountingType = ConstantHelper.TBD; // mounting type text
                            objComponentModel.functionalCategoryText = ConstantHelper.TBD; //functional category
                            if (item.displayName.ToString().ToLower().Contains(ConstantHelper.Epoxy))
                            {
                                features = ConstantHelper.ConductiveEpoxy;
                            }
                            if (item.attributes != null)
                            {
                                foreach (var attribute in item.attributes)
                                {
                                    if (attribute.attributeLabel == ConstantHelper.NoOfPin || attribute.attributeLabel == ConstantHelper.NoOfContact || attribute.attributeLabel == ConstantHelper.NoOfPins || attribute.attributeLabel == ConstantHelper.NoOfContacts)
                                    {
                                        try
                                        {
                                            noOfPosition = attribute.attributeValue;
                                        }
                                        catch (Exception e) { noOfPosition = null; }
                                        noOfPositionText = attribute.attributeValue.ToString();
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkLength || attribute.attributeLabel == ConstantHelper.NewarkLengths)
                                    {
                                        lengthtext = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkWidth || attribute.attributeLabel == ConstantHelper.NewarkWidths)
                                    {
                                        widthTxt = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkHeight || attribute.attributeLabel == ConstantHelper.NewarkHeightMax || attribute.attributeLabel == ConstantHelper.NewarkHeights || attribute.attributeLabel == ConstantHelper.NewarkHeightMaxs)
                                    {
                                        heightText = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.Tolerance || attribute.attributeLabel == ConstantHelper.CapaTolerance || attribute.attributeLabel == ConstantHelper.Tolerances || attribute.attributeLabel == ConstantHelper.CapaTolerances)
                                    {
                                        tolerance = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.OperatingMin || attribute.attributeLabel == ConstantHelper.OperatingMins)
                                    {
                                        minTempString = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        bool isFahrenheit = false;
                                        if (minTempString.Contains(ConstantHelper.TemperatureFahrenheitSign))
                                        {
                                            isFahrenheit = true;
                                        }
                                        minTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTempString.Replace(ConstantHelper.TemperaturePlusMinusSign, "-"), isFahrenheit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.OperatingMax || attribute.attributeLabel == ConstantHelper.OperatingMaxs)
                                    {
                                        maxTempString = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        bool isFahrenheit = false;
                                        if (maxTempString.Contains(ConstantHelper.TemperatureFahrenheitSign))
                                        {
                                            isFahrenheit = true;
                                        }
                                        maxTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(maxTempString.Replace(ConstantHelper.TemperaturePlusMinusSign, ""), isFahrenheit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackaging || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackagings)
                                    {
                                        packaging = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakPowerRating.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakPowerRatings.ToLower())
                                    {
                                        powerRating = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakSizeDimension.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakSizeDimensions.ToLower())
                                    {
                                        sizeDimension = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkCapacitance.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkCapacitances.ToLower() ||
                                        attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkInductance.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkInductances.ToLower() ||
                                         attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkResistance.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkResistances.ToLower())
                                    {
                                        value = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageRating.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageRatings.ToLower() ||
                                        attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageIsolation.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageIsolations.ToLower())
                                    {
                                        voltage = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackage.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackages.ToLower())
                                    {
                                        partPackage = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkNoOfRows.ToLower() || attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkNoOfRow.ToLower())
                                    {
                                        try { noOfRows = attribute.attributeValue; }
                                        catch (Exception e)
                                        {
                                            noOfRows = null;
                                        }
                                        noOfRowsText = attribute.attributeValue.ToString();
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString() == ConstantHelper.LedColors || attribute.attributeLabel.ToString() == ConstantHelper.LedColor)
                                    {
                                        color = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NwMounting)
                                    {
                                        objComponentModel.mountingType = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NwFunctional)
                                    {
                                        objComponentModel.functionalCategoryText = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NwPitchMating)
                                    {
                                        objComponentModel.pitchMating = string.Format("{0} {1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                }
                            }
                            if (lengthtext != string.Empty && widthTxt != string.Empty)
                            {
                                sizeDimension = string.Format("{0}x{1}", lengthtext, widthTxt);
                            }
                            if (minTempString != string.Empty && maxTempString != string.Empty)
                            {
                                operatingTemp = string.Format("{0}~{1}", minTempString, maxTempString);
                            }
                            //multiple data sheet link
                            List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                            if (item.datasheets != null)
                            {
                                foreach (var DataLinks in item.datasheets)
                                {
                                    DataSheetURL dataSheet = new DataSheetURL();
                                    dataSheet.SheetURL = DataLinks.url;
                                    dataSheets.Add(dataSheet);
                                }
                            }
                            /* Note:- As discussed on 09/05/2019 with dixitsir changed multiplier logic from packsize to translatedMinimumOrderQuality attribute 
                                    as it causing in calculation of unit measer */
                            //decimal Multiplier = 1;
                            //decimal.TryParse(Convert.ToString(item.packSize), out Multiplier);
                            objComponentModel.distPN = item.sku; // distributor part number

                            objComponentModel.minOperatingTemp = minTemp; // minimum temp
                            objComponentModel.maxOperatingTemp = maxTemp; // maximum temp
                            objComponentModel.tolerance = tolerance; //tolerance
                            objComponentModel.feature = features; //features

                            objComponentModel.dataSheetLink = item.datasheets != null ? item.datasheets[0].url : null; // data-sheet link 
                            objComponentModel.noOfPosition = noOfPosition; // no of position
                            objComponentModel.noOfRows = noOfRows; // no of rows
                            objComponentModel.noOfPositionText = noOfPositionText;
                            objComponentModel.noOfRowsText = noOfRowsText;
                            objComponentModel.operatingTemp = operatingTemp; //full temp string
                            objComponentModel.color = color; // color
                            objComponentModel.partPackage = partPackage; // package of part 
                            objComponentModel.packaging = packaging; //packaging type need to set as in controller pricing
                            objComponentModel.connectorTypeText = null; // connector type

                            objComponentModel.powerRating = powerRating;
                            objComponentModel.sizeDimension = sizeDimension;
                            objComponentModel.voltage = voltage;
                            objComponentModel.unit = 1;
                            objComponentModel.DataSheets = dataSheets;
                            objComponentModel.value = value;
                            objComponentModel.imageURL = null; //primary image of part
                            objComponentModel.rohsText = item.rohsStatusCode != null ? item.rohsStatusCode : ConstantHelper.RoHS;
                            objComponentModel.packageQty = item.packSize;
                            objComponentModel.minimum = MinimumBuy.ToString();
                            objComponentModel.mult = MinimumBuy.ToString();
                            objComponentModel.leadTime = APILeadTime;
                            objComponentModel.category = ConstantHelper.Component_Category;
                            objComponentModel.savePriceSupplier = PricingAPINames.Newark.GetEnumStringValue();
                            objComponentModel.PricesByReqQty = new Dictionary<int, string>();
                            if (item.prices != null)
                            {
                                for (int j = 0; j < item.prices.Count; j++)
                                {
                                    if (item.prices[0].cost.Value != null)
                                    {
                                        double unitPrice;
                                        double.TryParse(item.prices[0].cost.Value.ToString(), out unitPrice);
                                        objComponentModel.UnitPrice = unitPrice;
                                    }
                                    int qtyrange = (int)item.prices[j].from.Value;
                                    string price = item.prices[j].cost.Value.ToString();
                                    if (!objComponentModel.PricesByReqQty.ContainsKey(qtyrange))
                                        objComponentModel.PricesByReqQty.Add(qtyrange, price);
                                }
                            }
                            var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), lineItem);
                            objComponentModel = objVerification.ComponentModel;
                            listComponent.Add(objComponentModel);
                            if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && !lineItem.isPartUpdate)
                            {
                                if (objVerification.bomStatusList.Count() > 0)
                                {
                                    isIssue = true;
                                    _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                    int result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                                }
                                else
                                {
                                    if (objComponentModel.partStatusID != ConstantHelper.Discontinue_Status && (lineItem.isAlreadySaved && (!lineItem.isAlreadyFound || lineItem.isAlreadyFound)))
                                    {
                                        _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                        //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(objComponentModel);
                                        //PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = objComponentModel.mfgPN };
                                        //_ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Newark.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                                    }
                                    else
                                    {
                                        isDiscontinue = true;
                                    }
                                }
                            }
                            else
                            {
                                var objComponent = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDataFromMFGPN(objComponentModel.mfgcodeID, objComponentModel.mfgPN);
                                if (objComponent != null && objComponent.id > 0)
                                {
                                    objComponentModel.componentID = objComponent.id;
                                    objComponentModel.id = objComponent.id;
                                    int varreturn = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.UpdateComponentDetail(objComponentModel, objComponentModel.supplierName, false, true);
                                    PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = objComponent.id, mfgPN = objComponentModel.mfgPN };
                                    _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Newark.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                                }
                            }
                        }
                        if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && (listComponent.Count() > 0 && !isDiscontinue))
                        {
                            lineItem.isAlreadySaved = lineItem.isAlreadyFound ? lineItem.isAlreadySaved : isIssue ? false : true;
                            lineItem.isAlreadyFound = true;
                            if (!string.IsNullOrEmpty(nextAPIName))
                            {
                                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(lineItem.partID, nextAPIName, lineItem.type, lineItem.partNumber, lineItem.transactionID);
                            }
                            if (lineItem.cleanType == CleanType.Part.ToString())
                            {
                                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(lineItem.transactionID, isIssue ? 1 : 2, lineItem.supplier, lineItem.errorMsg, lineItem.partNumber.ToUpper(), lineItem.type);
                                if (remainApi.apiStatus)
                                {
                                    lineItem.externalIssue = lineItem.isPartUpdate ? false : remainApi.bomStatus;
                                    // _ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
                                }
                            }
                            else
                            {
                                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber, isIssue ? 1 : 2, lineItem.supplier, lineItem.type, lineItem.partID.Value, null);
                                if (remainApi.apiStatus)
                                {
                                    lineItem.externalIssue = remainApi.extStatusApi;
                                    lineItem.status = remainApi.bomStatus;
                                    // _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                                    //call for web socket
                                }
                                // _ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                            }
                            return callToNextApi(lineItem, new List<ComponentModel>(), false, false);
                        }
                        if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && (listComponent.Count() == 0 || (listComponent.Count() > 0 && isDiscontinue)))
                        {
                            _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                            return callToNextApi(lineItem, componentList, true, true);
                        }
                    }
                    else
                    {
                        _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                        return callToNextApi(lineItem, componentList, true, true);
                    }
                }
                else
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                    return callToNextApi(lineItem, componentList, true, true);
                }
                return 1;
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    CommonModel model = new CommonModel()
                    {
                        ExternalPartVerificationRequestLog = lineItem,
                        componentList = componentList
                    };
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, lineItem.cleanType == CleanType.Part.ToString() ? NewarkScheduleQueueName : NewarkQueueName);
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = lineItem.cleanType,
                        supplier = PricingAPINames.Newark.GetEnumStringValue(),
                        mfgPN = lineItem.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);

                    lineItem.errorMsg = ex.Message;
                    SaveException(lineItem, componentList);
                }
                return 0;
                #endregion
            }

        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : call newark api and get pricing for partnumber
        /// </summary>
        /// <param name="baseurl">newark api url</param>
        /// <param name="apiKey">newark api key</param>
        /// <param name="_lineItem">rfq_lineitems </param>
        /// <param name="apiSleepTime">sleep time between api call</param>
        private NewarkResult CallApiGetResponse(string baseurl, string apiKey, ExternalPartVerificationRequestLog lineItem,
            string apiSleepTime, string secretKey, List<ComponentModel> componentList, string NewarkAPIRequestsLimit)
        {
            NewarkResult result = new NewarkResult();
            string octopartUrlBase = baseurl;
            string octopartUrlEndpoint = ConstantHelper.OctopartUrlEndpoint;
            var client = new RestClient(octopartUrlBase);
            var req = new RestRequest(octopartUrlEndpoint, Method.GET)
                    .AddParameter(ConstantHelper.ApiKeyParam, apiKey)
                    .AddParameter(ConstantHelper.Term, string.Format("manuPartNum:{0}", lineItem.partNumber))
                    .AddParameter(ConstantHelper.StoreId, ConstantHelper.Newarkurl)
                    .AddParameter(ConstantHelper.ResponseFormat, ConstantHelper.ResponseJsonFormat)
                    .AddParameter(ConstantHelper.ResponseGroup, ConstantHelper.ResponsegroupSize);

            string _requestString = string.Empty;
            req.Parameters.ForEach(x => _requestString += x.Name + " : " + x.Value + " ");
            var data = client.Execute(req).Content;
            System.Threading.Thread.Sleep(Convert.ToInt32(apiSleepTime));
            try
            {
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                    {
                        supplierID = (int)PricingSupplierID.Newark,
                        supplierName = PricingAPINames.Newark.ToString(),
                        appName = string.Empty,
                        currentDate = DateTime.UtcNow.Date,
                        isLimitExceed = false,
                        clientID = apiKey,
                        limitExceedText = "No",
                        callLimit = NewarkAPIRequestsLimit
                    };
                    _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    var response = JsonConvert.DeserializeObject<dynamic>(data);
                    /* Check for Fault in Response */
                    if (response.Fault != null)
                    {
                        try
                        {
                            #region API-Specific Errors
                            // http://partner.element14.com/docs/Product_Search_API_REST__Description#apierrors
                            //Error	    Description
                            //100001    Invalid Timestamp
                            //100002	Internal Failure. Please try after some time or contact the web service provider
                            //100003	Invalid Password
                            //100004    Invalid Customer Details
                            //100005	Signature Decryption Exception. Please contact the Web Service Admin
                            //100006	Invalid Timestamp Format
                            //100007	Invalid Locale
                            //200001	SKUs not valid
                            //200002	Could Not Query for the keyword
                            //200003	Could Not Query for the keyword
                            //200004	Manufacturer Part Number is not valid
                            #endregion

                            string exceptionCode = string.Empty;

                            if (response.Fault.Detail == null)
                            {
                                data = string.Format(ConstantHelper.ApiException,
                                    response, ConstantHelper.NewarkApiError);
                            }
                            else if (response.Fault.Detail.SearchServiceException != null)
                            {
                                exceptionCode = response.Fault.Detail.SearchServiceException.searchException.exceptionCode.Value;
                                data = string.Format(ConstantHelper.NewarkError,
                                    response.Fault.Detail.SearchServiceException.searchException.exceptionCode,
                                    response.Fault.Detail.SearchServiceException.searchException.exceptionString,
                                    ConstantHelper.NewarkApiError);
                            }
                            else if (response.Fault.Detail.searchException != null)
                            {
                                exceptionCode = response.Fault.Detail.searchException.exceptionCode.Value;
                                if (exceptionCode == NewarkApiError.QueryKeyword.GetEnumStringValue())
                                {
                                    return result;
                                }
                                data = string.Format(ConstantHelper.NewarkError,
                                   response.Fault.Detail.searchException.exceptionCode,
                                   response.Fault.Detail.searchException.exceptionString,
                                   ConstantHelper.NewarkApiError);
                            }

                            #region log error msg in AutoPricingLineItemStatus
                            string ErrroMsg = string.Format(ConstantHelper.LineItemException, data);
                            SaveException(lineItem, componentList);
                            result.isSendRequestResponse = true;
                            #endregion
                        }

                        catch (Exception ex)
                        {
                            #region log error msg in AutoPricingLineItemStatus
                            //error detail save in mongodb ServiceErrorLog
                            ServiceErrorLog objErrorLog = new ServiceErrorLog()
                            {
                                error = ex.Message,
                                stackTrace = ex.StackTrace,
                                Source = lineItem.cleanType,
                                supplier = PricingAPINames.Newark.GetEnumStringValue(),
                                mfgPN = lineItem.partNumber,
                                timeStamp = DateTime.UtcNow
                            };
                            _IRabbitMQ.SendRequest(objErrorLog);

                            string ErrroMsg = response;
                            lineItem.errorMsg = ex.Message;
                            SaveException(lineItem, componentList);
                            result.isSendRequestResponse = true;
                            #endregion
                        }
                    }
                    else
                    {

                        result.resultParts = response;
                    }
                }
                else
                {
                    if (data.ToString() == ConstantHelper.NewarkLimit)
                    {
                        SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                        {
                            supplierID = (int)PricingSupplierID.Newark,
                            supplierName = PricingAPINames.Newark.ToString(),
                            appName = string.Empty,
                            currentDate = DateTime.UtcNow.Date,
                            isLimitExceed = true,
                            clientID = apiKey,
                            limitExceedText = "Yes",
                            callLimit = NewarkAPIRequestsLimit
                        };
                        _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    }
                    SaveException(lineItem, componentList);
                    result.isSendRequestResponse = true;
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                //error detail save in mongodb ServiceErrorLog
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = lineItem.cleanType,
                    supplier = PricingAPINames.Newark.GetEnumStringValue(),
                    mfgPN = lineItem.partNumber,
                    timeStamp = DateTime.UtcNow
                };
                _IRabbitMQ.SendRequest(objErrorLog);

                lineItem.errorMsg = ex.Message;
                SaveException(lineItem, componentList);
                result.isSendRequestResponse = true;
                #endregion
            }
            return result;
        }



        public void SaveException(ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList)
        {
            if (lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID))
            {
                var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(lineItem.supplier, "DIST");
                List<bomStatus> bomStatusList = new List<bomStatus>();
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = lineItem.partID,
                    errorType = ErrorType.CONTACTADMIN.ToString(),
                    errorMsg = ConstantHelper.ContactAdmin,
                    Source = lineItem.supplier,
                    partNumber = lineItem.partNumber.ToUpper(),
                    description = lineItem.description,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    bomMFG = lineItem.mfgName,
                    transactionID = lineItem.transactionID
                };
                bomStatusList.Add(objbomStatus);
                int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
                lineItem.isAlreadySaved = lineItem.isAlreadyFound ? lineItem.isAlreadySaved : false;
                lineItem.isAlreadyFound = true;
                if (!string.IsNullOrEmpty(nextAPIName))
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(lineItem.partID, nextAPIName, lineItem.type, lineItem.partNumber, lineItem.transactionID);
                }
                if (lineItem.cleanType == CleanType.Part.ToString())
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(lineItem.transactionID, 1, lineItem.supplier, lineItem.errorMsg, lineItem.partNumber.ToUpper(), lineItem.type);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = lineItem.isPartUpdate ? false : remainApi.bomStatus;
                        //_ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
                    }
                    //lineItem.externalIssue = true;
                    //_ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
                }
                else
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), 1, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = remainApi.extStatusApi;
                        lineItem.status = remainApi.bomStatus;

                    }
                    //_ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                }
                callToNextApi(lineItem, componentList, false, false);
            }
        }

        public int callToNextApi(ExternalPartVerificationRequestLog objExtVerification, List<ComponentModel> componentList, bool isUpdatePart, bool isInsert)
        {
            return _ICommonApiPricing.callToNextApi(objExtVerification, mfgList);
            //if (string.IsNullOrEmpty(nextAPIName))
            //{
            //    if (componentList.Count() > 0)
            //    {
            //        if (!isIssue)
            //        {
            //            _ICommonApiPricing.savedeclainedStatus(componentList, componentList.Count() > 0 ? null : UpdateComponentSupplier.DigiKey.GetEnumStringValue());
            //        }
            //    }
            //    _ICommonApiPricing.SaveIssueForAPIs(componentList, isIssue, objExtVerification, mfgList);
            //    return 1;
            //}
            //else
            //{
            //    return _ICommonApiPricing.callToNextExternalAPI(objExtVerification, componentList, isUpdatePart, isInsert, nextAPIQueueName, nextAPIName);
            //}
        }
        public int checkNextSupplierDetail(ExternalPartVerificationRequestLog Item, List<ComponentModel> ComponentList)
        {
            mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            //nextAPIQueueName = string.Empty;
            //nextAPIName = string.Empty;

            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.Newark));
            //if (index < 0)
            //{
            //    // need to set logic
            //    ManufacturerViewModel supplierObject = mfgList.Skip(1).FirstOrDefault();
            //    if (supplierObject != null && supplierObject.id != 0)
            //    {
            //        supplierObject = _ICommonApiPricing.setNextSupplierDetail(supplierObject, Item.cleanType);
            //        nextAPIQueueName = supplierObject.supplierQueueName;
            //        nextAPIName = supplierObject.supplierName;
            //    }
            //    _ICommonApiPricing.callToNextExternalAPI(Item, ComponentList, true, true, nextAPIQueueName, nextAPIName);
            //    return 0;
            //}
            //else
            //{
            //    ManufacturerViewModel supplierObject = mfgList.Skip(index + 1).FirstOrDefault();
            //    if (supplierObject != null && supplierObject.id != 0)
            //    {
            //        supplierObject = _ICommonApiPricing.setNextSupplierDetail(supplierObject, Item.cleanType);
            //        nextAPIQueueName = supplierObject.supplierQueueName;
            //        nextAPIName = supplierObject.supplierName;
            //    }
            //    return 1;
            //}
            return 1;
        }
    }
}
