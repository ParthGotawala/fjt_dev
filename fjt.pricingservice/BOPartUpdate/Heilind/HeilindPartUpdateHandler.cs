using fjt.pricingservice.BOPricing.Interface;
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
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPartUpdate.Heilind
{
    public class HeilindPartUpdateHandler : IHeilindPartUpdateHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string HeilindQueueName = ConfigurationManager.AppSettings["BOMCleanHeilindQueue"].ToString();
        string HeilindScheduleQueueName = ConfigurationManager.AppSettings["PartCleanHeilindQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        public HeilindPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
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
                    var componentDetList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.HEILIND.GetEnumStringValue());
                    if (componentDetList.Count() > 0)
                    {
                        ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentDetList, Item);
                        return callToNextApi(objExternalPartVerificationRequestLog, componentDetList, false, true);
                    }
                }
                var heilindConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Heilind.GetEnumStringValue()).ToList();
                var HeilindPartnerKey = heilindConfiguration.FirstOrDefault(x => x.key == ConfigKeys.HeilindPartnerName.GetEnumStringValue());
                var HelindAccessKey = heilindConfiguration.FirstOrDefault(x => x.key == ConfigKeys.HeilindAccessToken.GetEnumStringValue());
                return SavePricingDetails(Item, HeilindPartnerKey.values, HelindAccessKey.values, componentList);
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
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, Item.cleanType == CleanType.Part.ToString() ? HeilindScheduleQueueName : HeilindQueueName);
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Item.cleanType,
                        supplier = PricingAPINames.Heilind.GetEnumStringValue(),
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

        public int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string HeilindPartnerKey, string HeilindAccessToken, List<ComponentModel> ComponentList)
        {
            if (!string.IsNullOrEmpty(lineItem.transactionID) && lineItem.type == ConstantHelper.FJTSchedulePartUpdateV3)
            {
                bool partStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartUpdateStatus(lineItem.partID.Value, lineItem.transactionID, UpdateComponentSupplier.HEILIND.GetEnumStringValue(), ConstantHelper.FJTSchedulePartUpdateV3);
                if (partStatus)
                {
                    return 1;
                }
            }
            List<ComponentModel> componentList = new List<ComponentModel>();
            dynamic result = CallApiGetResponse(HeilindPartnerKey, HeilindAccessToken, lineItem, ComponentList);
            if (result == null)
            {
                return callToNextApi(lineItem, componentList, true, true);
            }
            bool isDiscontinue = false;
            if (result != null && result.items != null)
            {
                foreach (var item in result.items)
                {
                    if (item == null)
                    {
                        continue;
                    }
                    ComponentModel objComponentModel = new ComponentModel();
                    try
                    {
                        objComponentModel.manufacturerName = item.mfg_desc;//manufacturer name
                        objComponentModel.mfgPN = item.mfg_part.ToString().ToUpper();//manufacturer number
                    }
                    catch (Exception e) { continue; }

                    objComponentModel.partStatusText = ConstantHelper.Active;
                    objComponentModel.mfgPnDescription = item.pdesc; // part number description
                    objComponentModel.supplierName = Helper.Helper.UpdateComponentSupplier.HEILIND.GetEnumStringValue(); //supplier name from which details get
                    objComponentModel.distPN = item.disty_part; // distributor part number
                    if (objComponentModel.mfgPN.ToUpper() != lineItem.partNumber.ToUpper() && objComponentModel.distPN.ToUpper() != lineItem.partNumber.ToUpper())
                        continue;
                    objComponentModel.uomText = item.uom != null ? Convert.ToString(item.uom) : ConstantHelper.DefaultUom;//default uom each
                    string productUrl = string.Format(ConstantHelper.HeilindAPI, objComponentModel.mfgPN);
                    objComponentModel.productUrl = productUrl;

                    int? APILeadTime = null;

                    if (item.lead != null)
                    {
                        string mfgrLeadTime = Convert.ToString(item.lead);
                        int tempLeadTime = 0;

                        if (!string.IsNullOrEmpty(mfgrLeadTime))
                        {
                            if (int.TryParse(mfgrLeadTime.ToLower().Trim(), out tempLeadTime))
                                APILeadTime = tempLeadTime / 7;
                        }
                    }
                    List<DataSheetURL> Sheets = new List<DataSheetURL>();

                    objComponentModel.functionalCategoryText = ConstantHelper.TBD; //functional category
                    objComponentModel.unit = 1;
                    objComponentModel.rohsText = item.rohs;
                    objComponentModel.packageQty = item.multiple;
                    objComponentModel.minimum = item.minimum;
                    objComponentModel.mult = item.multiple;
                    objComponentModel.leadTime = APILeadTime;
                    objComponentModel.category = ConstantHelper.Component_Category;
                    objComponentModel.savePriceSupplier = PricingAPINames.Heilind.GetEnumStringValue();

                    Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                    if (item.prices != null && item.prices.Count > 0)
                    {
                        for (int j = 0; j < item.prices.Count; j++)
                        {
                            int qtyrange = (int)item.prices[j].price_min;
                            string price = item.prices[j].price.ToString();
                            if (!PricesByReqQty.ContainsKey(qtyrange))
                            {
                                PricesByReqQty.Add(qtyrange, price);
                            }
                            else if (PricesByReqQty.ContainsKey(qtyrange))
                            {
                                PricesByReqQty[qtyrange] = price;
                            }
                            if (j == 0)
                            {
                                objComponentModel.UnitPrice = Convert.ToDouble(price);
                            }
                        }
                    }
                    objComponentModel.PricesByReqQty = PricesByReqQty;

                    var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), lineItem);
                    objComponentModel = objVerification.ComponentModel;
                    componentList.Add(objComponentModel);
                    if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(lineItem.transactionID)) && !lineItem.isPartUpdate)
                    {
                        if (objVerification.bomStatusList.Count() > 0)
                        {
                            isIssue = true;
                            _IDigikeyPricingRepository.saveComponent(objComponentModel);
                            int Result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                        }
                        else
                        {
                            if (objComponentModel.partStatusID != ConstantHelper.Discontinue_Status)
                            {
                                _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(objComponentModel);
                                //if (detailResponse > 0)
                                //{
                                //    PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = objComponentModel.mfgPN };
                                //    _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Heilind.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                                //}
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
                            _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.Heilind.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                        }
                    }
                }
            }
            if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(lineItem.transactionID)) && (componentList.Count() > 0 && !isDiscontinue))
            {
                lineItem.isAlreadySaved = isIssue ? false : true;
                lineItem.isAlreadyFound = true;
                if (!string.IsNullOrEmpty(nextAPIName))
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(lineItem.partID, nextAPIName, lineItem.type, lineItem.partNumber, lineItem.transactionID);
                }
                if (lineItem.cleanType == CleanType.Part.ToString())
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(lineItem.transactionID, isIssue ? 1 : 2, lineItem.supplier, null, lineItem.partNumber, lineItem.type);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = lineItem.isPartUpdate ? false : remainApi.bomStatus;
                        // return callToNextApi(lineItem, componentList);
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
            if ((lineItem.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(lineItem.transactionID)) && (componentList.Count() == 0 || (componentList.Count() > 0 && isDiscontinue)))
            {
                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                return callToNextApi(lineItem, componentList, true, true);
            }
            return 1;
        }
        private dynamic CallApiGetResponse(string partnerKey, string AccessKey, ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList)
        {
            var response = new object();
            var data = _ICommonApiPricing.HeilindApiGetResponse(partnerKey, AccessKey, lineItem.partNumber);
            try
            {
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.Heilind,
                    supplierName = PricingAPINames.Heilind.ToString(),
                    appName = string.Empty,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = false,
                    clientID = partnerKey,
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
                    supplier = PricingAPINames.Heilind.GetEnumStringValue(),
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

        public int checkNextSupplierDetail(ExternalPartVerificationRequestLog Item, List<ComponentModel> ComponentList)
        {
            mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            //nextAPIQueueName = string.Empty;
            //nextAPIName = string.Empty;
            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.Heilind));
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
