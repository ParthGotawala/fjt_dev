using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.BOPricing.Interface;
using System.Configuration;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using static fjt.pricingservice.Helper.Helper;
using Newtonsoft.Json;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.BOPartUpdate.TTI
{
    public class TTIPartUpdateHandler : ITTIPartUpdateHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string TTIQueueName = ConfigurationManager.AppSettings["BOMCleanTTIQueue"].ToString();
        string TTIScheduleQueueName = ConfigurationManager.AppSettings["PartCleanTTIQueue"].ToString();
        string nextAPIQueueName = string.Empty;
        string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();

        public TTIPartUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository,
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
                var componentDetList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.TTI.GetEnumStringValue());
                if (componentDetList.Count() > 0)
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = _ICommonApiPricing.savePartFromMongoDB(componentDetList, Item);
                    return callToNextApi(objExternalPartVerificationRequestLog, componentDetList, false, true);
                }
            }
            var ttiConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.TTI.GetEnumStringValue()).ToList();
            var TTIAccessToken = ttiConfiguration.FirstOrDefault(x => x.key == ConfigKeys.TTIAccessToken.GetEnumStringValue());
            var TTIHeader = ttiConfiguration.FirstOrDefault(x => x.key == ConfigKeys.TTIHeader.GetEnumStringValue());
            return SavePricingDetails(Item, TTIAccessToken.values, TTIHeader.values, componentList);
        }

        private int SavePricingDetails(ExternalPartVerificationRequestLog lineItem, string TTIAccessToken, string TTIHeader, List<ComponentModel> componentList)
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
                var response = CallApiGetResponse(TTIAccessToken, TTIHeader, lineItem, componentList);
                List<ComponentModel> listComponent = new List<ComponentModel>();
                if (response != null && response.code != ConstantHelper.TTIErrorCode)
                {
                    var refstring = JsonConvert.DeserializeObject<dynamic>(response.ToString());
                    if (refstring.records != null)
                    {
                        foreach (var item in refstring.records)
                        {
                            ComponentModel objComponentModel = new ComponentModel();
                            string manufacturerPartNumber = item.mfrPartNumber;
                            if (manufacturerPartNumber.ToUpper().Trim(' ') != lineItem.partNumber.ToUpper().Trim(' '))
                                continue;

                            objComponentModel.savePriceSupplier = UpdateComponentSupplier.TTI.GetEnumStringValue();
                            objComponentModel.manufacturerName = item.mfgLongname;
                            objComponentModel.mfgPN = manufacturerPartNumber;
                            objComponentModel.mfgPnDescription = item.partsDescription;
                            objComponentModel.searchMfgPn = lineItem.partNumber;
                            objComponentModel.productUrl = item.buyUrl;

                            objComponentModel.partStatusText = ConstantHelper.Active; //default status
                            objComponentModel.functionalCategoryText = ConstantHelper.TBD; //default functional type
                            objComponentModel.mountingType = ConstantHelper.TBD; //default mounting type

                            decimal MinimumBuy = 0;
                            if (item.ttiSalesMin != null)
                                decimal.TryParse(item.ttiSalesMin.ToString(), out MinimumBuy);
                            objComponentModel.minimum = MinimumBuy.ToString();
                            int? APILeadTime = null;
                            if (item.mfrLeadTime != null)
                            {
                                string mfgrLeadTime = Convert.ToString(item.mfrLeadTime);
                                int tempLeadTime = 0;

                                if (!string.IsNullOrEmpty(mfgrLeadTime) && (mfgrLeadTime.ToLower().Contains(ConstantHelper.Weeks) || mfgrLeadTime.Contains(ConstantHelper.Week)))
                                {
                                    if (int.TryParse(mfgrLeadTime.ToLower().Replace(ConstantHelper.Weeks, "").Replace(ConstantHelper.Week, "").Trim(), out tempLeadTime))
                                        APILeadTime = tempLeadTime;
                                }
                            }
                            objComponentModel.leadTime = APILeadTime;
                            objComponentModel.mult = item.ttiSalesMult != null ? item.ttiSalesMult : (MinimumBuy.ToString());
                            objComponentModel.uomText = ConstantHelper.DefaultUom; //default uom

                            // multiple data sheet 
                            List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                            DataSheetURL dataSheet = new DataSheetURL();
                            dataSheet.SheetURL = item.datasheetURL;
                            dataSheets.Add(dataSheet);
                            objComponentModel.DataSheets = dataSheets;
                            objComponentModel.dataSheetLink = item.datasheetURL;
                            objComponentModel.distPN = item.ttiPartsNumber;

                            objComponentModel.supplierName = UpdateComponentSupplier.TTI.GetEnumStringValue();

                            objComponentModel.rohsText = item.roHsCompIndDisplay ?? ConstantHelper.TBD;

                            objComponentModel.packaging = item.packaging ?? null;

                            objComponentModel.category = ConstantHelper.Component_Category;

                            objComponentModel.PricesByReqQty = new Dictionary<int, string>();


                            if (item.pricing != null && item.pricing.priceList != null)
                            {
                                for (int j = 0; j < item.pricing.priceList.Count; j++)
                                {
                                    objComponentModel.UnitPrice = item.pricing.priceList[j].price;
                                    break;
                                }
                                for (int j = 0; j < item.pricing.priceList.Count; j++)
                                {
                                    int qtyrange = (int)item.pricing.priceList[j].quantity;
                                    string price = item.pricing.priceList[j].price.ToString();
                                    if (!objComponentModel.PricesByReqQty.ContainsKey(qtyrange))
                                        objComponentModel.PricesByReqQty.Add(qtyrange, price);
                                }
                            }
                            else
                            {
                                objComponentModel.UnitPrice = 0;
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
                                    if (objComponentModel.partStatusID != ConstantHelper.Discontinue_Status && (lineItem.isAlreadySaved && (lineItem.isAlreadyFound)))
                                    {
                                        _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                        //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(objComponentModel);
                                        //PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = objComponentModel.mfgPN };
                                        //_ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.TTI.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
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
                                    PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = objComponentModel.id, mfgPN = objComponentModel.mfgPN };
                                    _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.TTI.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                                }
                            }
                        }
                        _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                        callToNextApi(lineItem, componentList.Count() > 0 ? componentList : listComponent, true, true);
                    }
                    else
                    {
                        _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                        callToNextApi(lineItem, componentList.Count() > 0 ? componentList : listComponent, true, true);
                    }

                }
                else
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(lineItem);
                    callToNextApi(lineItem, componentList.Count() > 0 ? componentList : listComponent, true, true);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    CommonModel model = new CommonModel()
                    {
                        ExternalPartVerificationRequestLog = lineItem,
                        componentList = componentList
                    };
                    _IRabbitMQSendMessageRequestHandler.SendRequest(model, lineItem.cleanType == CleanType.Part.ToString() ? TTIScheduleQueueName : TTIQueueName);
                }
                else
                {
                    //error detail save in mongodb ServiceErrorLog
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = lineItem.cleanType,
                        supplier = PricingAPINames.TTI.GetEnumStringValue(),
                        mfgPN = lineItem.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);


                    lineItem.errorMsg = ex.Message;
                    SaveException(lineItem, componentList);
                }
            }
            return 0;
        }

        private dynamic CallApiGetResponse(string apiAccessToken, string apiHeader, ExternalPartVerificationRequestLog lineItem, List<ComponentModel> componentList)

        {
            var response = new object();
            var data = _ICommonApiPricing.TTIApiGetResponse(lineItem.partNumber, apiAccessToken, apiHeader);
            try
            {
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.TTI,
                    supplierName = PricingAPINames.TTI.ToString(),
                    appName = string.Empty,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = false,
                    clientID = apiAccessToken,
                    limitExceedText = "No",
                    callLimit = ConstantHelper.NoLimit
                };
                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                if (_ICommonApiPricing.ValidateJSON(data.Content))
                {
                    response = JsonConvert.DeserializeObject<dynamic>(data.Content);
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
                    supplier = PricingAPINames.TTI.GetEnumStringValue(),
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
                    description = lineItem.description,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    bomMFG = lineItem.mfgName,
                    transactionID = lineItem.transactionID
                };
                bomStatusList.Add(objbomStatus);
                int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
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
                    // _ICommonApiPricing.ApiCallforPartMasterProgressStatus(lineItem);
                }
                else
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), 1, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = remainApi.extStatusApi;
                        lineItem.status = remainApi.bomStatus;
                        _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                        //call for web socket
                    }
                    // _ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
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
            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.TTI));
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
