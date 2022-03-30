using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.com.mouser.www;
using fjt.pricingservice.Helper;
using System.Net;
using System.Threading;
using static fjt.pricingservice.Helper.Helper;
using Unity;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.BOPartUpdate.Mouser
{
    public class MouserPartUpdateHandler : IMouserPartHandler
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
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        public MouserPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
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
                var componentList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.Mouser.GetEnumStringValue());
                if (componentList.Count() > 0)
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentList, Item);
                    return callToNextApi(objExternalPartVerificationRequestLog, ComponentList, false, true);
                }
            }
            var mouserConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Mouser.GetEnumStringValue()).ToList();
            var MouserApiKey = mouserConfiguration.FirstOrDefault(x => x.key == ConfigKeys.MouserApiKey.GetEnumStringValue());
            return SavePricingDetails(Item, MouserApiKey.values, ComponentList);

        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="MouserApiKey">string</param>
        private int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string MouserApiKey, List<ComponentModel> ComponentList)
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
                MouserResult result = CallApiGetResponse(MouserApiKey, ConstantHelper.MouserDelay.ToString(), lineItem, ComponentList);
                if (result.isResponseSend)
                {
                    return 1;
                }
                bool isIssue = false;
                bool isDiscontinue = false;
                List<ComponentModel> ComponentModelList = new List<ComponentModel>();
                List<MouserPart> MouserPartList = new List<MouserPart>();
                if (result.resultParts != null)
                {
                    MouserPartList = result.resultParts.Parts.Where(x => x.ManufacturerPartNumber.ToUpper() == lineItem.partNumber.ToUpper() || x.MouserPartNumber.ToUpper() == lineItem.partNumber.ToUpper()).ToList();
                    foreach (MouserPart _MouserPart in MouserPartList)
                    {
                        ComponentModel objComponentModel = new ComponentModel();
                        objComponentModel.manufacturerName = _MouserPart.Manufacturer;//manufacturer name
                        objComponentModel.distPN = _MouserPart.MouserPartNumber; // distributor part number
                        objComponentModel.mfgPN = _MouserPart.ManufacturerPartNumber.ToUpper();//manufacturer number
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
                        if (_MouserPart.LeadTime != null && !string.IsNullOrEmpty(_MouserPart.LeadTime))
                        {
                            int tryParseVariable = 0;
                            if (int.TryParse(_MouserPart.LeadTime.Replace(ConstantHelper.Days, "").Replace(ConstantHelper.Day, "").Replace(ConstantHelper.Dias, "").Replace(ConstantHelper.Dia, "").Replace(ConstantHelper.Diias, "").Replace(ConstantHelper.Diia, ""), out tryParseVariable))
                            {
                                weeks = tryParseVariable / 7;
                                _leadTime = (int)(Math.Ceiling(weeks));
                            }
                        }

                        decimal MinimumBuy = 0;
                        decimal.TryParse(_MouserPart.Min, out MinimumBuy);

                        decimal Multiplier = 1;
                        string features = string.Empty;
                        decimal.TryParse(_MouserPart.Mult, out Multiplier);
                        //var packaging = _MouserPart.ProductAttributes.FirstOrDefault(x => x.AttributeName.ToLower() == ConstantHelper.MouserPackaging);

                        if (_MouserPart.DataSheetUrl.ToLower().Contains(ConstantHelper.Epoxy))
                        {
                            features = ConstantHelper.ConductiveEpoxy;
                        }
                        //get packaging
                        ProductAttribute pkg = _MouserPart.ProductAttributes.FirstOrDefault(x => x.AttributeName == ConstantHelper.DKPackaging && x.AttributeValue == ConstantHelper.Reel);
                        if (pkg == null)
                        {
                            pkg = _MouserPart.ProductAttributes.FirstOrDefault(x => x.AttributeName == ConstantHelper.DKPackaging);
                        }

                        ProductAttribute packageQty = _MouserPart.ProductAttributes.FirstOrDefault(x => x.AttributeName == ConstantHelper.StdpackageQty);
                        List<ComponentImages> Images = new List<ComponentImages>();
                        ComponentImages Image = new ComponentImages();
                        Image.imageURL = _MouserPart.ImagePath;
                        Images.Add(Image);

                        //save data sheet url
                        List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                        if (!string.IsNullOrEmpty(_MouserPart.DataSheetUrl))
                        {
                            DataSheetURL dataSheet = new DataSheetURL();
                            dataSheet.SheetURL = _MouserPart.DataSheetUrl;
                            dataSheets.Add(dataSheet);
                        }
                        objComponentModel.feature = features; //features
                        objComponentModel.functionalCategoryText = _MouserPart.Category ?? ConstantHelper.TBD; //functional category
                        objComponentModel.dataSheetLink = _MouserPart.DataSheetUrl; // data-sheet link 

                        objComponentModel.savePriceSupplier = PricingAPINames.Mouser.GetEnumStringValue();

                        objComponentModel.packaging = pkg != null ? pkg.AttributeValue : null; //packaging type need to set as in controller pricing
                        objComponentModel.connectorTypeText = null; // connector type
                        objComponentModel.mountingType = ConstantHelper.TBD; // mounting type text
                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                        foreach (Pricebreaks _priceBreaks in _MouserPart.PriceBreaks)
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
                        objComponentModel.packageQty = packageQty != null ? double.Parse(packageQty.AttributeValue) : (double)MinimumBuy;
                        objComponentModel.minimum = packageQty != null ? packageQty.AttributeValue : MinimumBuy.ToString();
                        objComponentModel.mult = packageQty != null ? packageQty.AttributeValue : Multiplier.ToString();
                        objComponentModel.leadTime = _leadTime;
                        objComponentModel.category = ConstantHelper.Component_Category;
                        if (_MouserPart.PriceBreaks.Count() > 0)
                            objComponentModel.UnitPrice = double.Parse(_MouserPart.PriceBreaks[0].Price.Replace(ConstantHelper.Dollar, ""));

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
                        mfgPN = lineItem.partNumber
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
        public MouserResult CallApiGetResponse(string apiKey, string sleepTime, ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList)
        {
            AccountInfo _AccountInfo = new AccountInfo();
            _AccountInfo.PartnerID = apiKey;
            MouserHeader _MouserHeader = new MouserHeader();
            _MouserHeader.AccountInfo = _AccountInfo;
            SearchAPI _obj = new SearchAPI();
            _obj.MouserHeaderValue = _MouserHeader;
            var resultParts = new MouserResult();
            try
            {
                Thread.Sleep(int.Parse(sleepTime));
                resultParts = MouserPartRequest(_obj, lineItem, 0, componentList);
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = lineItem.cleanType,
                    supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                    mfgPN = lineItem.partNumber
                };
                // _IRabbitMQ.SendRequest(objErrorLog);
                lineItem.errorMsg = ex.Message;
                if (ex.Message == ConstantHelper.Invalidkey)
                {
                    lineItem.errorMsg = ConstantHelper.InvalidkeyMessage;
                }
                SaveException(lineItem, componentList);
                resultParts.isResponseSend = true;
            }
            return resultParts;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : create mouser api request object to send a request
        /// </summary>
        /// <param name="obj">SearchAPI</param>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="executionCounter">executionCounter</param>
        public MouserResult MouserPartRequest(SearchAPI obj, ExternalPartVerificationRequestLog lineItem, int executionCounter, List<ComponentModel> componentList)
        {
            MouserResult mouserResult = new MouserResult();
            try
            {
                ResultParts data = new ResultParts();
                data = obj.SearchByPartNumber(lineItem.partNumber.Replace(",", ""), "id");
                mouserResult.resultParts = data;
                return mouserResult;
            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    var response = ex.Response as HttpWebResponse;
                    if (ex.Status == WebExceptionStatus.ProtocolError &&
                        response != null &&
                        executionCounter <= 2 &&
                        (int)response.StatusCode == ConstantHelper.TOOMANYREQUEST)
                    {
                        System.Threading.Thread.Sleep(ConstantHelper.MouserDelay);
                        return MouserPartRequest(obj, lineItem, ++executionCounter, componentList);
                    }
                    else
                    {
                        //error detail save in mongodb ServiceErrorLog
                        ServiceErrorLog objErrorLog = new ServiceErrorLog()
                        {
                            error = ex.Message,
                            stackTrace = ex.StackTrace,
                            Source = lineItem.cleanType,
                            supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                            mfgPN = lineItem.partNumber
                        };
                        //  _IRabbitMQ.SendRequest(objErrorLog);

                        lineItem.errorMsg = ex.Message;
                        SaveException(lineItem, componentList);
                        mouserResult.isResponseSend = true;
                        return mouserResult;
                    }
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = lineItem.cleanType,
                        supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                        mfgPN = lineItem.partNumber
                    };
                    // _IRabbitMQ.SendRequest(objErrorLog);

                    lineItem.errorMsg = ex.Message;
                    SaveException(lineItem, componentList);
                    mouserResult.isResponseSend = true;
                    return mouserResult;

                }
            }
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
