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
using System.Text.RegularExpressions;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPricing.Heilind
{
    public class HeilindPricingRequest : IPricingRequest
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IRabbitMQ _IRabbitMQ;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly Irfq_assy_quantityRepository _Irfq_assy_quantityRepository;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitemRepository _Irfq_consolidated_mfgpn_lineitemRepository;
        private readonly Irfq_assy_autopricingstatusRepository _Irfq_assy_autopricingstatusRepository;
        private readonly Irfq_lineitem_autopricingstatusRepository _Irfq_lineitem_autopricingstatusRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        string heilindServiceQueue = ConfigurationManager.AppSettings["RabbitHeilindQueue"].ToString();

        public HeilindPricingRequest(ICommonApiPricing ICommonApiPricing, IDigikeyPricingRepository IDigikeyPricingRepository,
             Irfq_assy_quantityRepository Irfq_assy_quantityRepository,
                        IsystemconfigrationsRepository IsystemconfigrationsRepository,
                        Irfq_consolidated_mfgpn_lineitemRepository Irfq_consolidated_mfgpn_lineitemRepository,
                        Irfq_assy_autopricingstatusRepository Irfq_assy_autopricingstatusRepository,
                        Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
                        Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
                        IRabbitMQ IRabbitMQ, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
            _Irfq_assy_quantityRepository = Irfq_assy_quantityRepository;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitemRepository = Irfq_consolidated_mfgpn_lineitemRepository;
            _Irfq_assy_autopricingstatusRepository = Irfq_assy_autopricingstatusRepository;
            _Irfq_lineitem_autopricingstatusRepository = Irfq_lineitem_autopricingstatusRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQ = IRabbitMQ;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : get pricing for part and its alternate part from heilind api
        /// </summary>
        /// <param name="LineItem">AutoPricingLineItemwiseStatus</param>
        public void Pricing(AutoPricingLineItemwiseStatus LineItem)
        {
            var objLineItem = _Irfq_consolidated_mfgpn_lineitemRepository.GetRfqConsolidateLineItem(LineItem.ConsolidateID, LineItem.AssyID, LineItem.isPurchaseApi);
            try
            {
                bool isPricing = _Irfq_lineitem_autopricingstatusRepository.GetLineItem(LineItem.PricingAPIName, LineItem.AssyID, LineItem.ConsolidateID, LineItem.isPurchaseApi);
                if (isPricing)
                {
                    if (objLineItem != null)
                    {
                        var listRestrictedParts = _Irfq_lineitem_autopricingstatusRepository.GetRestrictedPartsForAssy(LineItem.AssyID, LineItem.isPurchaseApi);
                        var heilindConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Heilind.GetEnumStringValue()).ToList();
                        var heilindPartnerKey = heilindConfiguration.FirstOrDefault(x => x.key == ConfigKeys.HeilindPartnerName.GetEnumStringValue());
                        var heilindAccessKey = heilindConfiguration.FirstOrDefault(x => x.key == ConfigKeys.HeilindAccessToken.GetEnumStringValue());
                        if (heilindPartnerKey == null || heilindAccessKey == null)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.HeilindCardentialNotFound, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                            return;
                        }
                        var lineItemList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetRfqConsolidateLineItemParts(LineItem.ConsolidateID, LineItem.isPurchaseApi);
                        if (lineItemList.Count() == 0)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.CustomPart, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                            return;
                        }
                        List<ConsolidateMfgPnAlternatePart> componentList = lineItemList.Where(x => (x.RoHSStatusID != ConstantHelper.Non_RoHS || (x.RoHSStatusID == ConstantHelper.Non_RoHS && x.customerApproval == ConstantHelper.CustomerApproved))).ToList();
                        if (lineItemList.Count() > 0 && componentList.Count() == 0)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.RohsNotApproved, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                            return;
                        }
                        componentList = componentList.Where(x => x.isGoodPart == ConstantHelper.CorrectPart).ToList();
                        if (lineItemList.Count() > 0 && componentList.Count() == 0)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.BadComponent, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                            return;
                        }
                        else
                        {
                            componentList = componentList.Where(x => x.restrictUseInBOMStep == false && x.restrictUsePermanentlyStep == false && (x.restrictUseWithPermissionStep == false || x.restrictUseWithPermissionStep == true && x.customerApproval == ConstantHelper.CustomerApproved)).ToList();
                            lineItemList = componentList.ToList();
                            var Ids = string.Join(",", (componentList.Select(x => x.mfgPNID.ToString()).ToArray()));
                            foreach (var item in lineItemList)
                            {
                                var packagingLine = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetPackagingAliasDetails(item.packaginggroupID ?? 0, Ids);
                                Ids = string.Format("{0},{1}", Ids, string.Join(",", (packagingLine.Select(x => x.mfgPNID.ToString()).ToArray())));
                                Ids = Ids.TrimEnd(',');
                                componentList.AddRange(packagingLine);
                            }
                            bool isrestrictedParts = true;
                            bool isTBD = true;
                            foreach (ConsolidateMfgPnAlternatePart alternate in componentList)
                            {
                                RestrictPartModel restrict = listRestrictedParts.Where(x => x.mfgPNID == alternate.mfgPNID).FirstOrDefault();//&& x.consolidateID == LineItem.ConsolidateID
                                if (restrict == null)
                                {
                                    isrestrictedParts = false;
                                    int count = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.checkTBDParameters(alternate.mfgPNID.Value);
                                    if (count == 0)
                                    {
                                        isTBD = false;
                                        ComponentViewModel objComponent = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentData(alternate.mfgPNID.Value);
                                        PricingViewModel objPricing = new PricingViewModel()
                                        {
                                            mfgPN = alternate.mfgPN,
                                            mfgPNID = alternate.mfgPNID,
                                            rfqAssemblyID = LineItem.AssyID,
                                            consolidateID = LineItem.ConsolidateID,
                                            qpa = objLineItem.qpa,
                                            PIDCode = alternate.PIDCode,
                                            RequestQty = LineItem.RequestQty,
                                            NoOfPositions = objLineItem.numOfPosition != null ? (int?)objLineItem.numOfPosition.Value : null, //!= null ? (int)objLineItem.numOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null,
                                            ApiNoOfPosition = objComponent.noOfPosition != null ? (int?)objComponent.noOfPosition.Value : null, //? objComponent.noOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null,
                                            NoOfRows = objLineItem.numOfRows,
                                            ApiNoOfRows = objComponent.noOfRows,
                                            isPackaging = alternate.isPackaging,
                                            isExact = LineItem.IsExact,
                                            mfgCodeID = alternate.mfgCodeID,
                                            SupplierID = LineItem.supplierID,
                                            BOMUnitID = objLineItem.uomID,
                                            ComponentUnitID = objComponent.uom,
                                            PackageQty = objComponent.packageQty,
                                            mountingtypeID = objComponent.mountingTypeID,
                                            functionalCategoryID = objComponent.functionalCategoryID,
                                            isStockUpdate = LineItem.isStockUpdate,
                                            partPackage = objComponent.packaging,
                                            mfgName = string.Format(ConstantHelper.MfgNameFormat, alternate.mfgCode, alternate.mfgName),
                                            packageSpqQty = objComponent.unit,
                                            rohsStatusID = objComponent.RoHSStatusID,
                                            connectorTypeID = objComponent.connecterTypeID,
                                            approvedMountingType = alternate.approvedMountingType,
                                            mismatchMountingTypeStep = alternate.mismatchMountingTypeStep,
                                            mismatchFunctionalCategoryStep = alternate.mismatchFunctionalCategoryStep
                                        };
                                        int response = SavePricingDetails(objPricing, heilindPartnerKey.values, heilindAccessKey.values, LineItem);

                                    }
                                }
                            }
                            if (isrestrictedParts)
                            {
                                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.RestrictedPart, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                                return;
                            }
                            if (isTBD)
                            {
                                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.TBDPart, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                                return;
                            }
                        }
                    }
                    else
                    {
                        UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.LineItemNotFound, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ex.Message, ex.StackTrace, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = LineItem.ConsolidateID,
                    rfqAssyID = LineItem.AssyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Heilind.GetEnumStringValue(),
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return;
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="heilindPartnerKey">string</param>
        /// <param name="heilindAccessKey">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string heilindPartnerKey, string heilindAccessKey, AutoPricingLineItemwiseStatus pricingObj)
        {
            try
            {
                List<AutoPricingPrice> partPricesList = new List<AutoPricingPrice>();
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                dynamic result = CallApiGetResponse(heilindPartnerKey, heilindAccessKey, lineItem, pricingObj.isPurchaseApi);
                if (result == null)
                {

                    int status = (int)Status.SendRequest;
                    int pricingApiID = (int)PricingSupplierID.Heilind;
                    if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == lineItem.consolidateID && x.rfqAssyID == lineItem.rfqAssemblyID && x.pricingSupplierID == pricingApiID && x.isPurchaseApi == pricingObj.isPurchaseApi
                        && x.status == status))
                    {
                        AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                        {
                            Status = (int)Status.Success,
                            ErrorMessage = string.Empty,
                            Message = string.Empty,
                            AssyID = lineItem.rfqAssemblyID,
                            ConsolidateID = lineItem.consolidateID,
                            PricingAPIName = PricingAPINames.Heilind.GetEnumStringValue(),
                            isPurchaseApi = pricingObj.isPurchaseApi,
                            supplierID = pricingApiID
                        };
                        if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == lineItem.rfqAssemblyID && x.pricingSupplierID == pricingApiID && x.isPurchaseApi == pricingObj.isPurchaseApi
                            && x.status == status
                            ))
                        {
                            int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.Success, string.Empty, string.Empty, lineItem.rfqAssemblyID, pricingApiID, lineItem.consolidateID, status, pricingObj.isPurchaseApi);
                            _ICommonApiPricing.ApiCallforSuccessStatus(objPricingStatus);
                        }
                    }
                    return 1;
                }
                var refstring = JsonConvert.DeserializeObject<dynamic>(result.ToString());
                foreach (var item in refstring.items)
                {
                    AutoPricingPrice partPriceModel = new AutoPricingPrice();
                    partPriceModel.AssemblyId = lineItem.rfqAssemblyID;
                    partPriceModel.consolidateID = lineItem.consolidateID;
                    partPriceModel.PartNumberId = lineItem.mfgPNID.Value;
                    string manufacturername = string.Empty;
                    string manufacturerPartNumber = string.Empty;
                    try
                    {
                        manufacturername = item.mfg_desc;//manufacturer name
                        manufacturerPartNumber = item.mfg_part.ToString().ToUpper();//manufacturer number
                    }
                    catch (Exception e) { continue; }
                    ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                    if ((objMfg != null && objMfg.id != lineItem.mfgCodeID)) // Discussion with DP 22/07/2019 1:10 PM,if mfg not match with db then need to skip,if mfg not added in db then need to add in price
                        continue;


                    if (manufacturerPartNumber.ToLower() != lineItem.mfgPN.ToLower())
                        continue;
                    string PartStatus = ConstantHelper.Active;
                    string productUrl =Convert.ToString(item.url);
                    if (!string.IsNullOrEmpty(productUrl))
                    {
                        productUrl = Regex.Replace(productUrl, ConstantHelper.OnlySingleBackSlashRegex, "/");
                    }

                    var octomanufacturer = new AutoPricingManufacturer()
                    {
                        Name = manufacturername,
                        PartNumber = manufacturerPartNumber,
                        PartStatus = PartStatus,
                        supplier = Helper.Helper.UpdateComponentSupplier.HEILIND.GetEnumStringValue(),
                        mfgPNDescription = item.pdesc,
                    };
                    decimal InStockQuantity = 0;
                    decimal.TryParse(item.on_order.ToString(), out InStockQuantity);
                    int? APILeadTime = null;
                    if (item.lead != null)
                    {
                        string mfgrLeadTime = Convert.ToString(item.lead);
                        int tempLeadTime = 0;

                        if (!string.IsNullOrEmpty(mfgrLeadTime))
                        {
                            if (int.TryParse(mfgrLeadTime.ToLower(), out tempLeadTime))
                                APILeadTime = tempLeadTime / 7;
                        }
                    }
                    string uom = item.uom != null ? Convert.ToString(item.uom) : ConstantHelper.DefaultUom;

                    List<ComponentImages> Images = new List<ComponentImages>();
                    List<DataSheetURL> Sheets = new List<DataSheetURL>();


                    var seller = new AutoPricingSeller()
                    {
                        InStockQuantity = InStockQuantity,
                        MinimumBuy = 0,
                        ProductUrl = productUrl,
                        SellerName = SourceOfPricing.HeilindPricingService.GetEnumStringValue(),
                        SellerUid = "",
                        Sku = item.disty_part,
                        APILeadTime = APILeadTime,
                        Authorized_Reseller = true,
                        TimeStamp = DateTime.UtcNow,
                        Multiplier = 1,
                        Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                        Uom = uom,
                        categoryText = ConstantHelper.TBD, //item.Category.Text,
                        mountingType = ConstantHelper.TBD,
                        ComponentImages = Images,
                        DataSheets = Sheets,
                    };
                    seller.RoHS = item.rohs;
                    seller.NCNR = item.ncnr == CommonStatus.N.GetEnumStringValue() ? CommonStatus.NO.GetEnumStringValue() : item.ncnr == CommonStatus.Y.GetEnumStringValue() ? CommonStatus.YES.GetEnumStringValue() : CommonStatus.UNKNOWN.GetEnumStringValue();


                    seller.PricesByReqQty = new Dictionary<int, string>();
                    if (lineItem.IsCustomPrice && (item.prices != null && item.prices.Count > 0)) //as per discuss with DP if custom price selected and there is not custom price then need to get standard price
                    {
                        seller.PricingType = Helper.Helper.PriceStatus.Special.GetEnumStringValue();
                        for (int j = 0; j < item.prices.Count; j++)
                        {
                            int qtyrange = (int)item.prices[j].price_min;
                            string price = item.prices[j].price.ToString();
                            if (!seller.PricesByReqQty.ContainsKey(qtyrange))
                                seller.PricesByReqQty.Add(qtyrange, price);
                        }
                    }
                    else if (!lineItem.IsCustomPrice || (lineItem.IsCustomPrice && (item.prices == null || item.prices.Count == 0)))
                    {
                        if (item.prices != null && item.prices.Count > 0)
                        {
                            seller.PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue();
                            for (int j = 0; j < item.prices.Count; j++)
                            {
                                int qtyrange = (int)item.prices[j].price_min;
                                string price = item.prices[j].price.ToString();
                                if (!seller.PricesByReqQty.ContainsKey(qtyrange))
                                    seller.PricesByReqQty.Add(qtyrange, price);
                                else if (seller.PricesByReqQty.ContainsKey(qtyrange))
                                {
                                    seller.PricesByReqQty[qtyrange] = price;
                                }
                            }
                        }
                    }
                    if (seller.PricesByReqQty.Count > 0)
                    {
                        var minPriceBreak = seller.PricesByReqQty.Keys.Min();
                        seller.MinimumBuy = minPriceBreak;
                        seller.Multiplier = minPriceBreak;
                        seller.PricesByReqQty = seller.PricesByReqQty.OrderBy(x => x.Key).ToDictionary(x => x.Key, x => x.Value);
                    }
                    if (seller.PricesByReqQty.Count() == 0)
                    {
                        seller.PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue();
                        seller.PricesByReqQty.Add(1, "0.00");
                    }
                    octomanufacturer.Sellers = octomanufacturer.Sellers ?? new List<AutoPricingSeller>();
                    octomanufacturer.Sellers.Add(seller);

                    partPriceModel.Manufacturers = partPriceModel.Manufacturers ?? new List<AutoPricingManufacturer>();
                    partPriceModel.Manufacturers.Add(octomanufacturer);

                    partPricesList.Add(partPriceModel);
                }
                int retint = _ICommonApiPricing.PricingDetail(partPricesList, assyQtyList, lineItem, PricingAPINames.Heilind.GetEnumStringValue(), pricingObj.isPurchaseApi);
                return 1;
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus

                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, heilindServiceQueue);
                }
                else
                {
                    string ErrorMsg = string.Format("{0} {1} {2}", ex.Message, ex.InnerException, ex.StackTrace);
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, ErrorMsg, pricingObj.isPurchaseApi, lineItem.isStockUpdate);
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        consolidateID = lineItem.consolidateID,
                        rfqAssyID = lineItem.rfqAssemblyID,
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = ConstantHelper.Pricing,
                        supplier = PricingAPINames.Heilind.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
                #endregion

                return 0;
            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : call heilind api and get pricing for partnumber
        /// </summary>
        /// <param name="partnerKey">heilind api key</param>
        /// <param name="lineItem">PricingViewModel </param>
        /// <param name="accessKey">login key name</param>
        private dynamic CallApiGetResponse(string partnerKey, string accessKey, PricingViewModel lineItem, bool isPurchaseApi)
        {
            var response = new object();
            var data = _ICommonApiPricing.HeilindApiGetResponse(partnerKey, accessKey, lineItem.mfgPN);
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
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, data, errorMsg, isPurchaseApi, lineItem.isStockUpdate);
                    response = null;
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                string ErrroMsg = string.Format(ConstantHelper.HeilindLineItemException, data);
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrroMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Heilind.GetEnumStringValue(),
                    mfgPN = lineItem.mfgPN
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                #endregion
                response = null;
            }
            return response;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : catch error and update lineitem/assy wise status table 
        /// </summary>
        /// <param name="assemblyId">long</param>
        /// <param name="lineItemId">long</param>
        /// <param name="responseData">string </param>
        /// <param name="errorData">string</param>
        private void UpdateAutoPricingStatusForError(long assemblyId, long consolidateID, string responseData, string errorData, bool isPurchaseApi, bool isStockUpdate)
        {
            #region log error msg in AutoPricingStatus
            string errorMsg = responseData;
            int status = (int)Status.SendRequest;
            int pricingApiID = (int)PricingSupplierID.Heilind;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID && x.rfqAssyID == assemblyId
            && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                {
                    Status = (int)Status.NotPricing,
                    ErrorMessage = errorData,
                    Message = errorMsg,
                    PricingAPIName = PricingAPINames.Heilind.GetEnumStringValue(),
                    AssyID = (int)assemblyId,
                    ConsolidateID = (int)consolidateID,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID,
                    isStockUpdate = isStockUpdate
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID && x.isPurchaseApi == isPurchaseApi
                && x.status == status
                ))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, responseData, errorData, assemblyId, pricingApiID, consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforErrorStatus(statusModel);
                }
            }
            #endregion
        }


    }
}
