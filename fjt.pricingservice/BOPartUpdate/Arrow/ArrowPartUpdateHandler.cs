using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;
using fjt.pricingservice.Helper;
using static fjt.pricingservice.Helper.Helper;
using Newtonsoft.Json;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.BOPartUpdate.Arrow
{
    public class ArrowPartUpdateHandler : IArrowPartUpdateHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string ArrowQueueName = ConfigurationManager.AppSettings["BOMCleanARQueue"].ToString();
        string ArrowScheduleQueueName = ConfigurationManager.AppSettings["PartCleanARQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        public ArrowPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository, IDigikeyPricingRepository IDigikeyPricingRepository,
            IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler, IRabbitMQ IRabbitMQ)
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
            try
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
                    var componentDetList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.Arrow.GetEnumStringValue());
                    if (componentDetList.Count() > 0)
                    {
                        ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentDetList, Item);
                        return callToNextApi(objExternalPartVerificationRequestLog, componentDetList, false, true);
                    }
                }
                if (Item.partNumber.Length > 2)
                {
                    var arrowConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Arrow.GetEnumStringValue()).ToList();
                    var ArrowApiKey = arrowConfiguration.FirstOrDefault(x => x.key == ConfigKeys.ArrowApiKey.GetEnumStringValue());
                    var ArrowLoginKey = arrowConfiguration.FirstOrDefault(x => x.key == ConfigKeys.ArrowLoginKey.GetEnumStringValue());
                    return SavePricingDetails(Item, ArrowApiKey.values, ArrowLoginKey.values, componentList);
                }
                else
                {
                    callToNextApi(Item, componentList, true, true);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    CommonModel model = new CommonModel()
                    {
                        ExternalPartVerificationRequestLog = Item,
                        componentList = componentList
                    };
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, Item.cleanType == CleanType.Part.ToString() ? ArrowScheduleQueueName : ArrowQueueName);
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Item.cleanType,
                        supplier = PricingAPINames.Arrow.GetEnumStringValue(),
                        mfgPN = Item.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);

                    Item.errorMsg = ex.Message;
                    SaveException(Item, componentList);
                }
            }
            return 1;
        }

        public int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string ArrowApiKey, string ArrowLoginKey, List<ComponentModel> ComponentList)
        {
            if (!string.IsNullOrEmpty(lineItem.transactionID) && lineItem.type == ConstantHelper.FJTSchedulePartUpdateV3)
            {
                bool partStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartUpdateStatus(lineItem.partID.Value, lineItem.transactionID, UpdateComponentSupplier.DigiKey.GetEnumStringValue(), ConstantHelper.FJTSchedulePartUpdateV3);
                if (partStatus)
                {
                    return 1;
                }
            }

            dynamic result = CallApiGetResponse(ArrowApiKey, ArrowLoginKey, lineItem, ComponentList);
            if (result == null)
            {
                return 1;
            }
            var refstring = JsonConvert.DeserializeObject<dynamic>(result.ToString());
            bool isexecute = true;
            bool isDiscontinue = false;
            if (refstring != null && refstring.itemserviceresult != null)
            {
                foreach (var ArrowPart in refstring.itemserviceresult.data)
                {
                    isexecute = false;
                    List<ComponentModel> ComponentModelList = new List<ComponentModel>();
                    if (ArrowPart != null)
                    {
                        foreach (var ArrowPartDet in ArrowPart.PartList)
                        {
                            if (ArrowPartDet.InvOrg == null)
                                continue;

                            foreach (var arrowPriceObj in ArrowPartDet.InvOrg.sources)
                            {
                                if (arrowPriceObj.sourceCd == ConstantHelper.PriceOrigin)
                                {
                                    foreach (var arrowPrice in arrowPriceObj.sourceParts)
                                    {
                                        ComponentModel objComponentModel = new ComponentModel();
                                        if (ArrowPartDet.manufacturer == null || ArrowPartDet.manufacturer.mfrCd == null)
                                            continue;
                                        objComponentModel.manufacturerName = ArrowPartDet.manufacturer.mfrName;
                                        objComponentModel.mfgPN = ArrowPartDet.partNum;
                                        if (objComponentModel.mfgPN.ToUpper().Trim(' ') != lineItem.partNumber.ToUpper().Trim(' '))
                                            continue;

                                        objComponentModel.mfgPnDescription = ArrowPartDet.desc;
                                        objComponentModel.mountingType = ConstantHelper.TBD; //mounting type not provide by arrow
                                        objComponentModel.functionalCategoryText = ConstantHelper.TBD;//functional type not provided by arrow
                                        objComponentModel.partStatusText = ConstantHelper.Active; //default active 
                                        objComponentModel.minimum = arrowPrice.minimumOrderQuantity;
                                        objComponentModel.mult = arrowPrice.minimumOrderQuantity;
                                        objComponentModel.distPN = arrowPrice.sourcePartId;
                                        objComponentModel.uomText = ConstantHelper.Each; //default each uom
                                        objComponentModel.category = ConstantHelper.Component_Category;
                                        objComponentModel.packageQty = ArrowPartDet.packSize;
                                        objComponentModel.savePriceSupplier = PricingAPINames.Arrow.GetEnumStringValue();
                                        objComponentModel.supplierName = UpdateComponentSupplier.Arrow.GetEnumStringValue(); //supplier name from which details get
                                        objComponentModel.searchMfgPn = lineItem.partNumber;
                                        objComponentModel.productUrl = arrowPrice.resources[0].uri;
                                        if (arrowPrice.mfrLeadTime != null)
                                        {
                                            objComponentModel.leadTime = arrowPrice.mfrLeadTime;
                                        }

                                        objComponentModel.PricesByReqQty = new Dictionary<int, string>();
                                        if (arrowPrice.Prices != null && arrowPrice.Prices.resaleList != null)
                                        {
                                            foreach (var priceBreak in arrowPrice.Prices.resaleList)
                                            {
                                                objComponentModel.UnitPrice = priceBreak.price;
                                                break;
                                            }

                                            foreach (var priceBreak in arrowPrice.Prices.resaleList)
                                            {
                                                int qtyrange = priceBreak.minQty;
                                                string price = priceBreak.price;
                                                if (!objComponentModel.PricesByReqQty.ContainsKey(qtyrange))
                                                    objComponentModel.PricesByReqQty.Add(qtyrange, price);
                                            }
                                        }
                                        else
                                        {
                                            objComponentModel.UnitPrice = 0;
                                        }
                                        objComponentModel.packaging = arrowPrice.containerType;
                                        if (ArrowPartDet.EnvData != null && ArrowPartDet.EnvData.compliance != null)
                                        {
                                            foreach (var rohsPart in ArrowPartDet.EnvData.compliance)
                                            {
                                                if (rohsPart.displayLabel == ConstantHelper.Rohs)
                                                {
                                                    objComponentModel.rohsText = rohsPart.displayValue;
                                                }
                                            }
                                        }
                                        if (string.IsNullOrEmpty(objComponentModel.rohsText))
                                            objComponentModel.rohsText = ConstantHelper.TBD;

                                        var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), lineItem);
                                        objComponentModel = objVerification.ComponentModel;
                                        ComponentModelList.Add(objComponentModel);
                                        if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)) && !lineItem.isPartUpdate)
                                        {
                                            if (objVerification.bomStatusList.Count() > 0)
                                            {
                                                isIssue = true;
                                                _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                                _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                                            }
                                            else
                                            {
                                                if (objComponentModel.partStatusID != ConstantHelper.Discontinue_Status && (lineItem.isAlreadySaved && (!lineItem.isAlreadyFound || lineItem.isAlreadyFound)))
                                                {
                                                    _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                                    //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(objComponentModel);
                                                    //PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = objComponentModel.mfgPN };
                                                    //_ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Arrow.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
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
                                                _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Arrow.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                                            }
                                        }

                                    }
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
                                    //  _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                                    //call for web socket
                                }
                                //_ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
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
            }
            if (isexecute && (lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID)))
            {
                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                callToNextApi(lineItem, ComponentList, true, true);
            }
            return 1;
        }
        private dynamic CallApiGetResponse(string apikey, string loginkey, ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList)
        {
            var response = new object();
            var data = _ICommonApiPricing.ArrowApiGetResponse(apikey, loginkey, lineItem.partNumber);
            try
            {
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.Arrow,
                    supplierName = PricingAPINames.Arrow.ToString(),
                    appName = string.Empty,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = false,
                    clientID = apikey,
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
                #region log error msg 
                //error detail save in mongodb ServiceErrorLog
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = lineItem.cleanType,
                    supplier = PricingAPINames.Arrow.GetEnumStringValue(),
                    mfgPN = lineItem.partNumber,
                    timeStamp = DateTime.UtcNow
                };
                _IRabbitMQ.SendRequest(objErrorLog);

                lineItem.errorMsg = ex.Message;
                SaveException(lineItem, componentList);
                response = null;
                #endregion
            }
            return response;
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
            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.Arrow));
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
                        //   _ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
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
                        // _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                        //call for web socket
                    }
                    // _ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                }
                callToNextApi(lineItem, componentList, false, false);
            }
        }
    }
}
