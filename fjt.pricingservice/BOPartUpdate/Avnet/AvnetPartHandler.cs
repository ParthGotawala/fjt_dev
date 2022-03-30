using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;
using static fjt.pricingservice.Helper.Helper;
using Newtonsoft.Json;
using fjt.pricingservice.Helper;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.BOPartUpdate.Avnet
{
    public class AvnetPartHandler : IAvnetPartHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string AvnetQueueName = ConfigurationManager.AppSettings["BOMCleanAVQueue"].ToString();
        string AvnetScheduleQueueName = ConfigurationManager.AppSettings["PartCleanAVQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        public AvnetPartHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository, IDigikeyPricingRepository IDigikeyPricingRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
            IRabbitMQ IRabbitMQ)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IRabbitMQ = IRabbitMQ;
        }
        public int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> ComponentList)
        {
            int result = checkNextSupplierDetail(Item, ComponentList);
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
                var componentList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.Avnet.GetEnumStringValue());
                if (componentList.Count() > 0)
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentList, Item);
                    return callToNextApi(objExternalPartVerificationRequestLog, ComponentList, false, true);
                }
            }
            var avnetConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Avnet.GetEnumStringValue());
            var avnetAuthToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetAuthToken.GetEnumStringValue());
            var avnetStoreID = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetStoreID.GetEnumStringValue());
            var avnetWCToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetWCToken.GetEnumStringValue());
            var avnetWCTrustedToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetWCTrustedToken.GetEnumStringValue());
            var AvnetAPIPath = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetAPIPath.GetEnumStringValue());
            var AvnetSubscriptionKey = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetSubscriptionKey.GetEnumStringValue());
            return SavePricingDetails(Item, avnetStoreID.values, avnetWCToken.values, avnetWCTrustedToken.values, ComponentList, AvnetAPIPath.values, AvnetSubscriptionKey.values);
        }

        private int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string avnetStoreID, string avnetWCToken, string avnetWCtrustedToken, List<ComponentModel> ComponentList, string avnetAPIPath, string avnetSubscriptionKey)
        {
            dynamic response = null;
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
                bool isDiscontinue = false;
                List<ComponentModel> ComponentModelList = new List<ComponentModel>();
                response = CallApiGetResponse(lineItem, avnetStoreID, avnetWCToken, avnetWCtrustedToken, ComponentList, avnetAPIPath, avnetSubscriptionKey);
                if (response != null && response.productDetails != null)
                {
                    foreach (var AvnetPartDet in response.productDetails)
                    {
                        ComponentModel objComponentModel = new ComponentModel();
                        objComponentModel.manufacturerName = AvnetPartDet.manufacturerName;
                        if (string.IsNullOrEmpty(objComponentModel.manufacturerName))
                        {
                            objComponentModel.manufacturerName = AvnetPartDet.mfCode;
                        }
                        objComponentModel.mfgPN = AvnetPartDet.mfPartNumber;
                        //supplier part number
                        objComponentModel.distPN = AvnetPartDet.supplierPartNumber;
                        if ((objComponentModel.mfgPN.ToUpper() != lineItem.partNumber.ToUpper() && objComponentModel.distPN.ToUpper() != lineItem.partNumber.ToUpper()) || string.IsNullOrEmpty(objComponentModel.manufacturerName))
                            continue;


                        // Part Status is obsolote or not
                        objComponentModel.partStatusText = AvnetPartDet.obsoleteFlag == PartStatus.NO.GetEnumStringValue() ? PartStatus.Active.GetEnumStringValue() : PartStatus.Obsolete.GetEnumStringValue();


                        // Minimum qunatity to buy
                        objComponentModel.minimum = AvnetPartDet.minimumQuantity;

                        //multiple
                        objComponentModel.mult = AvnetPartDet.multipleQuantity;
                        // Product URL
                        objComponentModel.productUrl = AvnetPartDet.pdpUrl;


                        //description
                        objComponentModel.mfgPnDescription = AvnetPartDet.shortDescription;

                        objComponentModel.detailDescription = AvnetPartDet.longDescription; // part number detailed description



                        // factoryLeadTimein Days
                        try
                        {
                            objComponentModel.leadTime = (AvnetPartDet.factoryLeadTime == null) ? null : (AvnetPartDet.factoryLeadTime / 7);
                        }
                        catch (Exception e)
                        {
                            objComponentModel.leadTime = null;
                        }

                        //category'
                        objComponentModel.functionalCategoryText = AvnetPartDet.parentCatGroupName;

                        //datasheet URL
                        List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                        if (!string.IsNullOrEmpty(AvnetPartDet.dataSheetUrl.ToString()))
                        {
                            DataSheetURL dataSheet = new DataSheetURL();
                            dataSheet.SheetURL = AvnetPartDet.dataSheetUrl;
                            dataSheets.Add(dataSheet);
                        }
                        objComponentModel.DataSheets = dataSheets;
                        //images 
                        List<ComponentImages> Images = new List<ComponentImages>();
                        if (!string.IsNullOrEmpty(AvnetPartDet.thumbnail.ToString()))
                        {
                            ComponentImages Image = new ComponentImages();
                            Image.imageURL = AvnetPartDet.thumbnail;
                            objComponentModel.imageURL = AvnetPartDet.thumbnail;
                            Images.Add(Image);
                        }
                        objComponentModel.ComponentImages = Images;
                        objComponentModel.dataSheetLink = AvnetPartDet.dataSheetUrl;



                        // Quantity avaliable in multiple of qty
                        objComponentModel.supplierName = UpdateComponentSupplier.Avnet.GetEnumStringValue();
                        objComponentModel.searchMfgPn = lineItem.partNumber;

                        //package qty
                        try
                        {
                            objComponentModel.packageQty = AvnetPartDet.minimumQuantity;
                        }
                        catch (Exception e) { objComponentModel.packageQty = 1; }


                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();


                        // Avent Response get all pricing range object and add to dictionary
                        if (AvnetPartDet.price != null && AvnetPartDet.price.rangePrice != null)
                        {
                            foreach (var priceItem in AvnetPartDet.price.rangePrice)
                            {
                                objComponentModel.UnitPrice = priceItem.priceInRange.value;
                                break;
                            }
                            foreach (var priceItem in AvnetPartDet.price.rangePrice)
                            {
                                int qtyrange = priceItem.minimumQty.value;
                                string price = priceItem.priceInRange.value;
                                if (!PricesByReqQty.ContainsKey(qtyrange))
                                    PricesByReqQty.Add(qtyrange, price);
                            }
                        }
                        else
                        {
                            objComponentModel.UnitPrice = null;
                        }
                        //avnet unit of measer
                        objComponentModel.uomText = ConstantHelper.DefaultUom;

                        if (AvnetPartDet.technicalAttributes != null)
                        {
                            foreach (var attributes in AvnetPartDet.technicalAttributes)
                            {
                                if (attributes.name == ConstantHelper.OperatingTemp)
                                {
                                    objComponentModel.operatingTemp = attributes.value;
                                    //Get data from Operating Temperature Conversion Master
                                    //if found in master then directly taking that valies, no need to convert
                                    OperatingTemperatureConversionModel operatingTemperatureConversion = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetOperatingTemperatureConversion(objComponentModel.operatingTemp);
                                    if (operatingTemperatureConversion != null)
                                    {
                                        objComponentModel.minOperatingTemp = operatingTemperatureConversion.minTemperature;
                                        objComponentModel.maxOperatingTemp = operatingTemperatureConversion.maxTemperature;
                                    }
                                    else
                                    {
                                        string[] stringSeparators = new string[] { "to" };
                                        string[] temp = objComponentModel.operatingTemp.ToString().Split(stringSeparators, 2, StringSplitOptions.RemoveEmptyEntries);
                                        bool isFahrenheit = false;
                                        try
                                        {
                                            var minTemp = temp[0].Trim().Replace(ConstantHelper.TemperaturePlusMinusSign, "-");
                                            if (minTemp.Contains(ConstantHelper.TemperatureFahrenheitSign) ||
                                                    (temp.Length > 1 && temp[1].Trim().Contains(ConstantHelper.TemperatureFahrenheitSign)))
                                            {
                                                isFahrenheit = true;
                                            }
                                            if (minTemp.Contains(ConstantHelper.TemperatureMaxSign))
                                            {
                                                objComponentModel.minOperatingTemp = 0;
                                                objComponentModel.maxOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTemp, isFahrenheit);
                                            }
                                            else
                                            {
                                                objComponentModel.minOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTemp, isFahrenheit);
                                                if (temp.Length > 1)
                                                {
                                                    var maxTemp = temp[1].Trim().Replace(ConstantHelper.TemperaturePlusMinusSign, "");
                                                    objComponentModel.maxOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(maxTemp, isFahrenheit);
                                                }
                                                else
                                                {
                                                    objComponentModel.maxOperatingTemp = temp[0].Trim().Contains(ConstantHelper.TemperaturePlusMinusSign) ? (objComponentModel.minOperatingTemp * -1) : objComponentModel.minOperatingTemp;
                                                }
                                            }
                                            //set null if any of both value is null, null due to non-numeric values in it
                                            if (objComponentModel.minOperatingTemp == null || objComponentModel.maxOperatingTemp == null)
                                            {
                                                objComponentModel.maxOperatingTemp = objComponentModel.minOperatingTemp = null;
                                            }
                                        }
                                        catch (Exception) { objComponentModel.minOperatingTemp = objComponentModel.maxOperatingTemp = null; }
                                    }
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.Mounting)
                                {
                                    objComponentModel.mountingType = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.ProductDimension)
                                {
                                    objComponentModel.sizeDimension = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.PinCount)
                                {
                                    int noOfPos = -1;
                                    objComponentModel.noOfPositionText = attributes.value;
                                    try
                                    {
                                        int.TryParse(attributes.value.ToString(), out noOfPos);
                                    }
                                    catch (Exception e)
                                    {
                                        noOfPos = 0;
                                    }
                                    objComponentModel.noOfPosition = noOfPos;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetCapacitance)
                                {
                                    objComponentModel.value = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetPower)
                                {
                                    objComponentModel.powerRating = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.DKTolerence)
                                {
                                    objComponentModel.tolerance = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetVolatage)
                                {
                                    objComponentModel.voltage = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetPackage || attributes.name == ConstantHelper.AvnetPackageSupplier)
                                {
                                    objComponentModel.partPackage = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetHeightText)
                                {
                                    objComponentModel.heightText = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.DKPitch)
                                {
                                    objComponentModel.pitchMating = attributes.value;
                                    continue;
                                }
                                if (attributes.name == ConstantHelper.AvnetFeature)
                                {
                                    objComponentModel.feature = attributes.value;
                                    continue;
                                }
                            }
                        }

                        if (string.IsNullOrEmpty(objComponentModel.mountingType))
                        {
                            objComponentModel.mountingType = ConstantHelper.TBD;
                        }
                        if (string.IsNullOrEmpty(objComponentModel.functionalCategoryText))
                        {
                            objComponentModel.functionalCategoryText = ConstantHelper.TBD;
                        }
                        objComponentModel.savePriceSupplier = PricingAPINames.Avnet.GetEnumStringValue();
                        objComponentModel.PricesByReqQty = PricesByReqQty;
                        // "packageTypeCode": "BLK"
                        // "packageTypeCode": "TRY"
                        objComponentModel.packaging = AvnetPartDet.packageTypeCode;

                        //‘Yes’, ‘No’, ‘Exempt’
                        objComponentModel.rohsText = AvnetPartDet.ROHSComplianceCode;

                        objComponentModel.noOfPosition = objComponentModel.noOfPosition >= 0 ? objComponentModel.noOfPosition : null;

                        objComponentModel.category = ConstantHelper.Component_Category;

                        var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), lineItem);
                        objComponentModel = objVerification.ComponentModel;
                        ComponentModelList.Add(objComponentModel);
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
                                    //_ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Avnet.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
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
                                _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Avnet.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                            }
                        }

                    }
                    if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && (ComponentModelList.Count() > 0 && !isDiscontinue))
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
                            //lineItem.externalIssue = isIssue;
                            //_ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
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
                    if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && (ComponentModelList.Count() == 0 || (ComponentModelList.Count() > 0 && isDiscontinue)))
                    {
                        _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                        return callToNextApi(lineItem, ComponentList, true, true);
                    }
                }
                else if (lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID))
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                    callToNextApi(lineItem, ComponentList, true, true);
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    CommonModel model = new CommonModel()
                    {
                        ExternalPartVerificationRequestLog = lineItem,
                        componentList = ComponentList
                    };
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, lineItem.cleanType == CleanType.Part.ToString() ? AvnetScheduleQueueName : AvnetQueueName);
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = string.Concat(ex.StackTrace, " <br />  <br /> <b>API Response:</b> ", response),
                        Source = lineItem.cleanType,
                        supplier = PricingAPINames.Avnet.GetEnumStringValue(),
                        mfgPN = lineItem.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);

                    lineItem.errorMsg = ex.Message;
                    SaveException(lineItem, ComponentList);
                }
                #endregion
            }
            return 1;
        }

        private dynamic CallApiGetResponse(ExternalPartVerificationRequestLog lineItem, string avnetStoreId, string avnetWCToken, string avnetWCTrustedToken, List<ComponentModel> componentList, string avnetAPIPath, string avnetSubscriptionKey)
        {

            var response = new object();
            var data = _ICommonApiPricing.AvnetApiGetResponse(lineItem.partNumber, avnetStoreId, avnetWCToken, avnetWCTrustedToken, avnetAPIPath, avnetSubscriptionKey);
            try
            {
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.Avnet,
                    supplierName = PricingAPINames.Avnet.ToString(),
                    appName = string.Empty,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = false,
                    clientID = avnetSubscriptionKey,
                    limitExceedText = "No",
                    callLimit = ConstantHelper.NoLimit
                };
                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    response = JsonConvert.DeserializeObject<dynamic>(data);
                }
                else
                {
                    response = null;
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
                    supplier = PricingAPINames.Avnet.GetEnumStringValue(),
                    mfgPN = lineItem.partNumber,
                    timeStamp = DateTime.UtcNow
                };
                _IRabbitMQ.SendRequest(objErrorLog);

                lineItem.errorMsg = ex.Message;
                SaveException(lineItem, componentList);
                #endregion
            }
            return response;
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
                    bomMFG = lineItem.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
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
                        // _ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
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
                        //_ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                        //call for web socket
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

            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.Avnet));
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
