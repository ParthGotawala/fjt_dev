using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.com.mouser.www;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPartUpdate.Mouser
{
    public class MouserJSONPartUpdateHandler : IMouserPartHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string MouserQueueName = ConfigurationManager.AppSettings["BOMCleanMOQueue"].ToString();
        string MouserScheduleQueueName = ConfigurationManager.AppSettings["PartCleanMOQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        bool isDiscontinue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();

        public MouserJSONPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
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
        public int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> ComponentList)
        {
            int result = checkNextSupplierDetail(Item, ComponentList);
            //if (result == 0)
            //{
            //    return 1;
            //}
            if (Item.type != ConstantHelper.FJTSchedulePartUpdate)
            {
                if (Item.cleanType != CleanType.Part.ToString())
                {
                    bool partStatus = _IsystemconfigrationsRepository.getStatus(Item.partID.Value, Item.transactionID, Item.supplier);
                    if (!partStatus)
                        return 1;
                }
                var componentList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.Mouser.GetEnumStringValue());
                if (componentList.Count() > 0)
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentList, Item);
                    return callToNextApi(objExternalPartVerificationRequestLog, ComponentList, false, true);
                }
            }
            var mouserConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Mouser.GetEnumStringValue()).ToList();
            var MouserApiKey = mouserConfiguration.FirstOrDefault(x => x.key == ConfigKeys.MouserApiKey.GetEnumStringValue());
            var MouserAPIRequestsLimit = mouserConfiguration.FirstOrDefault(x => x.key == ConfigKeys.MouserAPIRequestsLimit.GetEnumStringValue());
            return SavePricingDetails(Item, MouserApiKey.values, MouserAPIRequestsLimit.values, ComponentList);
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="MouserApiKey">string</param>
        private int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string MouserApiKey, string MouserAPIRequestsLimit, List<ComponentModel> ComponentList)
        {

            try
            {
                if (!string.IsNullOrEmpty(lineItem.transactionID) && lineItem.type == ConstantHelper.FJTSchedulePartUpdateV3)
                {
                    bool partStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartUpdateStatus(lineItem.partID.Value, lineItem.transactionID, Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(), ConstantHelper.FJTSchedulePartUpdateV3);
                    if (partStatus)
                    {
                        return 1;
                    }
                }
                List<bomStatus> bomStatusList = new List<bomStatus>();
                dynamic result = CallApiGetResponse(lineItem, ComponentList, MouserApiKey, MouserAPIRequestsLimit);
                List<ComponentModel> ComponentModelList = new List<ComponentModel>();
                List<MouserPart> MouserPartList = new List<MouserPart>();
                if (result != null && result.SearchResults != null)
                {
                    foreach (var _MouserPart in result.SearchResults.Parts)
                    {

                        ComponentModel objComponentModel = new ComponentModel();
                        objComponentModel.manufacturerName = _MouserPart.Manufacturer;//manufacturer name
                        objComponentModel.distPN = _MouserPart.MouserPartNumber; // distributor part number
                        objComponentModel.mfgPN = _MouserPart.ManufacturerPartNumber;//manufacturer number
                        if (objComponentModel.mfgPN.ToUpper() != lineItem.partNumber.ToUpper() && !string.IsNullOrEmpty(objComponentModel.distPN) && objComponentModel.distPN.ToUpper() != lineItem.partNumber.ToUpper())
                            continue;
                        MouserPart objMouser = new MouserPart()
                        {
                            ManufacturerPartNumber = objComponentModel.manufacturerName
                        };
                        MouserPartList.Add(objMouser);
                        objComponentModel.partStatusText = _MouserPart.LifecycleStatus; //part status
                        if (string.IsNullOrEmpty(objComponentModel.partStatusText))
                            objComponentModel.partStatusText = ConstantHelper.Active;
                        objComponentModel.ltbDate = null; //last time buy data not privide by mouser
                        objComponentModel.mfgPnDescription = _MouserPart.Description; // part number description
                        objComponentModel.supplierName = Helper.Helper.UpdateComponentSupplier.Mouser.GetEnumStringValue(); //supplier name from which details get
                        objComponentModel.uomText = ConstantHelper.DefaultUom;//default uom each
                        objComponentModel.productUrl = _MouserPart.ProductDetailUrl ?? ConstantHelper.MouserHomepageUrl;// Mouser part url or default mouser home url
                        decimal weeks = 0;
                        int? _leadTime = null;
                        if (_MouserPart.LeadTime != null)
                        {
                            int tryParseVariable = 0;
                            if (int.TryParse(_MouserPart.LeadTime.ToString().Replace(ConstantHelper.Days, "").Replace(ConstantHelper.Day, "").Replace(ConstantHelper.Dias, "").Replace(ConstantHelper.Dia, "").Replace(ConstantHelper.Diias, "").Replace(ConstantHelper.Diia, ""), out tryParseVariable))
                            {
                                weeks = tryParseVariable / 7;
                                _leadTime = (int)(Math.Ceiling(weeks));
                            }
                        }

                        decimal MinimumBuy = 0;
                        string Min = _MouserPart.Min != null ? _MouserPart.Min.ToString() : string.Empty;
                        decimal.TryParse(Min, out MinimumBuy);

                        decimal Multiplier = 1;
                        string features = string.Empty;
                        string Mult = _MouserPart.Mult != null ? _MouserPart.Mult.ToString() : string.Empty;
                        decimal.TryParse(Mult, out Multiplier);
                        //var packaging = _MouserPart.ProductAttributes.FirstOrDefault(x => x.AttributeName.ToLower() == ConstantHelper.MouserPackaging);
                        string DataSheetUrl = _MouserPart.DataSheetUrl != null ? _MouserPart.DataSheetUrl.ToString() : string.Empty;
                        if (DataSheetUrl != string.Empty && DataSheetUrl.ToLower().Contains(ConstantHelper.Epoxy))
                        {
                            features = ConstantHelper.ConductiveEpoxy;
                        }
                        string packaging = null;
                        string packageQty = null;
                        foreach (var item in _MouserPart.ProductAttributes)
                        {
                            if (item.AttributeName == ConstantHelper.DKPackaging && item.AttributeValue == ConstantHelper.Reel)
                            {
                                packaging = item.AttributeValue;
                                continue;
                            }
                            if (item.AttributeName == ConstantHelper.StdpackageQty)
                            {
                                packageQty = item.AttributeValue;
                                continue;
                            }
                        }
                        if (string.IsNullOrEmpty(packaging))
                        {
                            foreach (var item in _MouserPart.ProductAttributes)
                            {
                                if (item.AttributeName == ConstantHelper.DKPackaging)
                                {
                                    packaging = item.AttributeValue;
                                    continue;
                                }
                            }
                        }
                        List<ComponentImages> Images = new List<ComponentImages>();
                        ComponentImages Image = new ComponentImages();
                        Image.imageURL = _MouserPart.ImagePath;
                        Images.Add(Image);

                        //save data sheet url
                        List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                        if (!string.IsNullOrEmpty(DataSheetUrl))
                        {
                            DataSheetURL dataSheet = new DataSheetURL();
                            dataSheet.SheetURL = DataSheetUrl;
                            dataSheets.Add(dataSheet);
                        }
                        objComponentModel.feature = features; //features
                        objComponentModel.functionalCategoryText = _MouserPart.Category ?? ConstantHelper.TBD; //functional category
                        objComponentModel.dataSheetLink = DataSheetUrl; // data-sheet link 

                        objComponentModel.savePriceSupplier = PricingAPINames.Mouser.GetEnumStringValue();

                        objComponentModel.packaging = packaging != null ? packaging : null; //packaging type need to set as in controller pricing
                        objComponentModel.connectorTypeText = null; // connector type
                        objComponentModel.mountingType = ConstantHelper.TBD; // mounting type text
                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                        foreach (var _priceBreaks in _MouserPart.PriceBreaks)
                        {
                            int qtyrange = _priceBreaks.Quantity;
                            string price = _priceBreaks.Price;
                            if (!PricesByReqQty.ContainsKey(qtyrange))
                                PricesByReqQty.Add(qtyrange, price);
                        }

                        objComponentModel.PricesByReqQty = PricesByReqQty;

                        objComponentModel.unit = 1;
                        objComponentModel.ComponentImages = Images;
                        objComponentModel.DataSheets = dataSheets;
                        objComponentModel.imageURL = _MouserPart.ImagePath; //primary image of part
                        objComponentModel.rohsText = _MouserPart.ROHSStatus;
                        objComponentModel.packageQty = packageQty != null ? double.Parse(packageQty) : (double)MinimumBuy;
                        objComponentModel.minimum = packageQty != null ? packageQty : MinimumBuy.ToString();
                        objComponentModel.mult = Multiplier.ToString();
                        objComponentModel.leadTime = _leadTime;
                        objComponentModel.category = ConstantHelper.Component_Category;
                        if (PricesByReqQty.Count() > 0)
                            objComponentModel.UnitPrice = double.Parse(_MouserPart.PriceBreaks[0].Price.ToString().Replace(ConstantHelper.Dollar, ""));

                        var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), lineItem);
                        objComponentModel = objVerification.ComponentModel;
                        ComponentModelList.Add(objComponentModel);
                        if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && !lineItem.isPartUpdate)
                        {
                            if (objVerification.bomStatusList.Count() > 0)
                            {
                                isIssue = true;
                                _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                int Result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                            }
                            else
                            {
                                if (objComponentModel.partStatusID != ConstantHelper.Discontinue_Status && (lineItem.isAlreadySaved && (!lineItem.isAlreadyFound || lineItem.isAlreadyFound)))
                                {
                                    _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                    //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(objComponentModel);
                                    //PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = objComponentModel.mfgPN };
                                    //_ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Mouser.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
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
                                _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Mouser.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                            }
                        }
                    }
                }
                if (MouserPartList.Count() > 0 && !isDiscontinue && (lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)))
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
                        //web socket call on part master
                    }
                    else
                    {
                        var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), isIssue ? 1 : 2, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                        if (remainApi.apiStatus)
                        {
                            lineItem.externalIssue = remainApi.extStatusApi;
                            lineItem.status = remainApi.bomStatus;
                            // _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                            //call for web socket
                        }
                        //_ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                    }
                    return callToNextApi(lineItem, new List<ComponentModel>(), false, false);
                }
                else if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && MouserPartList.Count() == 0)
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                    return callToNextApi(lineItem, ComponentList, true, true);
                }
                else if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && (MouserPartList.Count() > 0 && isDiscontinue))
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                    if (ComponentList.Count() > 0)
                        return callToNextApi(lineItem, ComponentList, true, true);
                    else
                    {
                        return callToNextApi(lineItem, ComponentModelList, true, true);
                    }
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
                        componentList = ComponentList
                    };
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, lineItem.cleanType == CleanType.Part.ToString() ? MouserScheduleQueueName : MouserQueueName);
                }
                else
                {
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = lineItem.cleanType,
                        supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                        mfgPN = lineItem.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);

                    lineItem.errorMsg = ex.Message;
                    SaveException(lineItem, ComponentList);
                }
                #endregion
                return 0;
            }
        }


        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : call mouser api and get pricing for partnumber
        /// </summary>
        /// <param name="apiKey">mouser api key</param>
        /// <param name="sleepTime">sleep time between api call</param>
        /// <param name="lineItem">PricingViewModel </param>
        private dynamic CallApiGetResponse(ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList, string mouserAPIKey, string MouserAPIRequestsLimit)
        {
            Thread.Sleep(ConstantHelper.MouserDelay);
            var response = new object();
            var data = _ICommonApiPricing.MouserApiGetResponse(mouserAPIKey, lineItem.partNumber);
            try
            {
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    response = JsonConvert.DeserializeObject<dynamic>(data);
                    dynamic obj = response;
                    if (obj != null && obj.SearchResults == null && obj.Errors != null)
                    {
                        foreach (var Error in obj.Errors)
                        {
                            if (Error.Message.ToString() == ConstantHelper.MouserMaximumCall)
                            {
                                CommonModel model = new CommonModel()
                                {
                                    ExternalPartVerificationRequestLog = lineItem,
                                    componentList = componentList
                                };
                                _IRabbitMQSendMessageRequestHandler.SendRequest(model, lineItem.cleanType == CleanType.Part.ToString() ? MouserScheduleQueueName : MouserQueueName);
                            }
                            else if (Error.Message.ToString() == ConstantHelper.MouserMaximumCallPerDay)
                            {
                                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                                {
                                    supplierID = (int)PricingSupplierID.Mouser,
                                    supplierName = PricingAPINames.Mouser.ToString(),
                                    appName = string.Empty,
                                    currentDate = DateTime.UtcNow.Date,
                                    isLimitExceed = true,
                                    clientID = mouserAPIKey,
                                    limitExceedText = "Yes",
                                    callLimit = MouserAPIRequestsLimit
                                };
                                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                            }
                            else
                            {
                                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                                {
                                    error = string.Format("{0} {1}", Error.PropertyName, Error.Message),
                                    stackTrace = "Mouser API Issue",
                                    Source = lineItem.cleanType,
                                    supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                                    mfgPN = lineItem.partNumber,
                                    timeStamp = DateTime.UtcNow
                                };
                                _IRabbitMQ.SendRequest(objErrorLog);

                                lineItem.errorMsg = string.Format("{0} {1}", Error.PropertyName, Error.Message);
                                SaveException(lineItem, componentList);
                            }
                        }
                    }
                    else
                    {
                        SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                        {
                            supplierID = (int)PricingSupplierID.Mouser,
                            supplierName = PricingAPINames.Mouser.ToString(),
                            appName = string.Empty,
                            currentDate = DateTime.UtcNow.Date,
                            isLimitExceed = false,
                            clientID = mouserAPIKey,
                            limitExceedText = "No",
                            callLimit = MouserAPIRequestsLimit
                        };
                        _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                        return response;
                    }
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
                    supplier = PricingAPINames.Mouser.GetEnumStringValue(),
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
                    errorMsg = lineItem.errorMsg,
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
                if (lineItem.cleanType != CleanType.Part.ToString())
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), 1, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = remainApi.extStatusApi;
                        lineItem.status = remainApi.bomStatus;
                        //_ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                        //call for web socket
                    }
                    // _ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                }
                else
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
            //nextAPIQueueName = string.Empty;
            //nextAPIName = string.Empty;
            mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.Mouser));
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
            //     _ICommonApiPricing.callToNextExternalAPI(Item, ComponentList, true, true, nextAPIQueueName, nextAPIName);
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
