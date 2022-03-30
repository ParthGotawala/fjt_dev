using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using static fjt.pricingservice.Helper.Helper;
using fjt.pricingservice.Helper;
using RestSharp;
using Newtonsoft.Json;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;

namespace fjt.pricingservice.BOPricing.TTI
{
    public class TTIPricingRequest : IPricingRequest
    {
        private readonly Irfq_assy_quantityRepository _Irfq_assy_quantityRepository;
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IRabbitMQ _IRabbitMQ;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitemRepository _Irfq_consolidated_mfgpn_lineitemRepository;
        private readonly Irfq_lineitem_autopricingstatusRepository _Irfq_lineitem_autopricingstatusRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        string ttiKeyServiceQueue = ConfigurationManager.AppSettings["RabbitTTIQueue"].ToString();
        public TTIPricingRequest(Irfq_assy_quantityRepository Irfq_assy_quantityRepository,
         ICommonApiPricing ICommonApiPricing,
         IsystemconfigrationsRepository IsystemconfigrationsRepository,
         Irfq_consolidated_mfgpn_lineitemRepository Irfq_consolidated_mfgpn_lineitemRepository,
         Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
         Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
         IRabbitMQ IRabbitMQ, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
         IDigikeyPricingRepository IDigikeyPricingRepository)
        {
            _Irfq_assy_quantityRepository = Irfq_assy_quantityRepository;
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitemRepository = Irfq_consolidated_mfgpn_lineitemRepository;
            _Irfq_lineitem_autopricingstatusRepository = Irfq_lineitem_autopricingstatusRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQ = IRabbitMQ;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : get pricing for part and its alternate part from tti api
        /// </summary>
        /// <param name="LineItem">AutoPricingLineItemwiseStatus</param>
        public void Pricing(AutoPricingLineItemwiseStatus LineItem)
        {
            try
            {
                bool isPricing = _Irfq_lineitem_autopricingstatusRepository.GetLineItem(LineItem.PricingAPIName, LineItem.AssyID, LineItem.ConsolidateID, LineItem.isPurchaseApi);
                if (isPricing)
                {
                    var objLineItem = _Irfq_consolidated_mfgpn_lineitemRepository.GetRfqConsolidateLineItem(LineItem.ConsolidateID, LineItem.AssyID, LineItem.isPurchaseApi);
                    var listRestrictedParts = _Irfq_lineitem_autopricingstatusRepository.GetRestrictedPartsForAssy(LineItem.AssyID, LineItem.isPurchaseApi);
                    if (objLineItem != null)
                    {
                        var ttiConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.TTI.GetEnumStringValue()).ToList();
                        var TTIAccessToken = ttiConfiguration.FirstOrDefault(x => x.key == ConfigKeys.TTIAccessToken.GetEnumStringValue());
                        var TTIHeader = ttiConfiguration.FirstOrDefault(x => x.key == ConfigKeys.TTIHeader.GetEnumStringValue());
                        if (TTIAccessToken == null || TTIHeader == null)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.TTINOTFound, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
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
                            bool islessChar = true;
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
                                        if (alternate.mfgPN.Length > 2) {
                                            islessChar = false;
                                            ComponentViewModel objComponent = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentData(alternate.mfgPNID.Value);
                                            PricingViewModel objPricing = new PricingViewModel()
                                            {
                                                mfgPN = alternate.mfgPN,
                                                mfgPNID = alternate.mfgPNID,
                                                rfqAssemblyID = LineItem.AssyID,
                                                consolidateID = LineItem.ConsolidateID,
                                                qpa = objLineItem.qpa,
                                                PIDCode = alternate.PIDCode,
                                                IsCustomPrice = LineItem.IsCustomPrice,
                                                RequestQty = LineItem.RequestQty,
                                                NoOfPositions = objLineItem.numOfPosition != null ? (int?)objLineItem.numOfPosition.Value : null,//objLineItem.numOfPosition != null ? (int)objLineItem.numOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null,
                                                ApiNoOfPosition = objComponent.noOfPosition != null ? (int?)objComponent.noOfPosition.Value : null,//objComponent.noOfPosition != null ? objComponent.noOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null,
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
                                                rohsStatusID = objComponent.RoHSStatusID,
                                                packageSpqQty = objComponent.unit,
                                                mfgName = string.Format(ConstantHelper.MfgNameFormat, alternate.mfgCode, alternate.mfgName),
                                                connectorTypeID = objComponent.connecterTypeID,
                                                approvedMountingType = alternate.approvedMountingType,
                                                mismatchMountingTypeStep = alternate.mismatchMountingTypeStep,
                                                mismatchFunctionalCategoryStep = alternate.mismatchFunctionalCategoryStep
                                            };
                                            int response = SavePricingDetails(objPricing, TTIAccessToken.values, TTIHeader.values, LineItem);
                                        }
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
                            if (islessChar)
                            {
                                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.ArrowLengthException, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
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
                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ex.Message, ex.StackTrace, LineItem.isPurchaseApi,LineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = LineItem.ConsolidateID,
                    rfqAssyID = LineItem.AssyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.TTI.GetEnumStringValue(),
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return;
            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save 
        /// </summary>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="TTiAccessToken">string</param>
        /// <param name="TTIHeader">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string TTiAccessToken, string TTIHeader, AutoPricingLineItemwiseStatus pricingObj)
        {
            try
            {
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                List<AutoPricingPrice> TTIPartPrices = new List<AutoPricingPrice>();
                var response = CallApiGetResponse(TTiAccessToken, TTIHeader, lineItem, pricingObj.isPurchaseApi);
                if (response.resultParts != null && response.resultParts.code != ConstantHelper.TTIErrorCode)
                {
                    var refstring = JsonConvert.DeserializeObject<dynamic>(response.resultParts.ToString());
                    if (refstring.records != null)
                    {
                        foreach (var item in refstring.records)
                        {
                            AutoPricingPrice octoPartPrice = new AutoPricingPrice();
                            octoPartPrice.AssemblyId = (long)lineItem.rfqAssemblyID;
                            octoPartPrice.consolidateID = (long)response.consolidateID;
                            octoPartPrice.PartNumberId = (int)response.partNoId;
                            octoPartPrice.PriceType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue();
                            string manufacturername = item.mfgLongname;
                            ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                            if ((objMfg != null && objMfg.id != lineItem.mfgCodeID))
                                continue;
                            string manufacturerHomepageUrl = item.buyUrl;
                            string manufacturerPartNumber = item.mfrPartNumber;
                            if (manufacturerPartNumber.ToUpper().Trim(' ') != lineItem.mfgPN.ToUpper().Trim(' '))
                                continue;
                            var octomanufacturer = new AutoPricingManufacturer()
                            {
                                Name = manufacturername,
                                HomePageUrl = manufacturerHomepageUrl,
                                PartNumber = manufacturerPartNumber,
                                mfgPNDescription = item.partsDescription,
                            };
                            decimal InStockQuantity = 0;
                            decimal MinimumBuy = 0;
                            decimal.TryParse(item.ttiAts.ToString(), out InStockQuantity);
                            if (item.ttiSalesMin != null)
                                decimal.TryParse(item.ttiSalesMin.ToString(), out MinimumBuy);
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
                            decimal Multiplier = item.ttiSalesMult != null ? item.ttiSalesMult : MinimumBuy;
                            string Uom = ConstantHelper.DefaultUom;

                            // multiple data sheet 
                            List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                            DataSheetURL dataSheet = new DataSheetURL();
                            dataSheet.SheetURL = item.datasheetURL;
                            dataSheets.Add(dataSheet);

                            var seller = new AutoPricingSeller()
                            {
                                InStockQuantity = InStockQuantity,
                                MinimumBuy = MinimumBuy,
                                ProductUrl = item.buyUrl,
                                SellerName = SourceOfPricing.TTIPricingService.GetEnumStringValue(),
                                Sku = item.ttiPartsNumber,
                                HomePageUrl = ConstantHelper.TTIHomePageURL,
                                APILeadTime = APILeadTime,
                                Authorized_Reseller = true,
                                TimeStamp = DateTime.UtcNow,
                                Multiplier = Multiplier,
                                Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                                Uom = Uom,
                                dataSheetLink = item.datasheetURL,
                                DataSheets = dataSheets
                            };
                            seller.RoHS = item.roHsCompIndDisplay;
                            seller.NCNR = CommonStatus.UNKNOWN.GetEnumStringValue();
                            seller.Packaging = item.packaging ?? "";
                            seller.PricesByReqQty = new Dictionary<int, string>();
                            if (item.pricing != null && item.pricing.priceList != null)
                            {
                                for (int j = 0; j < item.pricing.priceList.Count; j++)
                                {
                                    int qtyrange = (int)item.pricing.priceList[j].quantity;
                                    string price = item.pricing.priceList[j].price.ToString();
                                    if (!seller.PricesByReqQty.ContainsKey(qtyrange))
                                        seller.PricesByReqQty.Add(qtyrange, price);
                                }
                            }
                            if (seller.PricesByReqQty.Count() == 0)
                            {
                                seller.PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue();
                                seller.PricesByReqQty.Add(1, "0.00");
                            }
                            octomanufacturer.Sellers = octomanufacturer.Sellers ?? new List<AutoPricingSeller>();
                            octomanufacturer.Sellers.Add(seller);
                            octoPartPrice.Manufacturers = octoPartPrice.Manufacturers ?? new List<AutoPricingManufacturer>();
                            octoPartPrice.Manufacturers.Add(octomanufacturer);
                            TTIPartPrices.Add(octoPartPrice);
                            if (lineItem.IsCustomPrice && item.pricing.vipPrice != null)
                            {
                                AutoPricingPrice customPrice = new AutoPricingPrice();
                                customPrice = octoPartPrice;
                                customPrice.PriceType = Helper.Helper.PriceStatus.Special.GetEnumStringValue();
                                customPrice.VIPPrice = item.pricing.vipPrice;
                                TTIPartPrices.Add(customPrice);
                            }
                        }
                        int retint = _ICommonApiPricing.PricingDetail(TTIPartPrices, assyQtyList, lineItem, PricingAPINames.TTI.GetEnumStringValue(), pricingObj.isPurchaseApi);
                    }
                    else
                    {
                        int retint = _ICommonApiPricing.PricingDetail(TTIPartPrices, assyQtyList, lineItem, PricingAPINames.TTI.GetEnumStringValue(), pricingObj.isPurchaseApi);
                    }
                }
                else
                {
                    int status = (int)Status.SendRequest;
                    int pricingApiID = (int)PricingSupplierID.TTI;
                    if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == lineItem.consolidateID && x.rfqAssyID == lineItem.rfqAssemblyID && x.pricingSupplierID == pricingApiID && x.isPurchaseApi == pricingObj.isPurchaseApi
                    && x.status == status
                   ))
                    {
                        AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                        {
                            Status = (int)Status.Success,
                            ErrorMessage = string.Empty,
                            Message = string.Empty,
                            AssyID = lineItem.rfqAssemblyID,
                            ConsolidateID = lineItem.consolidateID,
                            PricingAPIName = PricingAPINames.TTI.GetEnumStringValue(),
                            isPurchaseApi = pricingObj.isPurchaseApi,
                            supplierID = pricingApiID
                        };
                        if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == lineItem.rfqAssemblyID
                        && x.pricingSupplierID == pricingApiID
                        && x.status == status && x.isPurchaseApi == pricingObj.isPurchaseApi
                        ))
                        {
                            _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.Success, string.Empty, string.Empty, lineItem.rfqAssemblyID, pricingApiID, lineItem.consolidateID, status, pricingObj.isPurchaseApi);
                            _ICommonApiPricing.ApiCallforSuccessStatus(objPricingStatus);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                
                #region log error msg in AutoPricingStatus
                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, ttiKeyServiceQueue);
                }
                else
                {
                    string ErrorMsg = string.Format("{0} {1} {2}", ex.Message, ex.InnerException, ex.StackTrace);
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ex.Message, ErrorMsg, pricingObj.isPurchaseApi, lineItem.isStockUpdate);
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        consolidateID = lineItem.consolidateID,
                        rfqAssyID = lineItem.rfqAssemblyID,
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = ConstantHelper.Pricing,
                        supplier = PricingAPINames.TTI.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
                #endregion
            }
            return 0;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : call tti api and get pricing for partnumber
        /// </summary>
        /// <param name="apiAccessToken">Access token for TTI Access</param>
        /// <param name="apiHeader">User Agent header for TTI</param>
        /// <param name="lineItem">rfq_lineitems </param>

        private TTIResult CallApiGetResponse(string apiAccessToken, string apiHeader, PricingViewModel lineItem, bool isPurchaseApi)

        {
            TTIResult result = new TTIResult();
            var response = _ICommonApiPricing.TTIApiGetResponse(lineItem.mfgPN, apiAccessToken, apiHeader);
            result.assemblyId = lineItem.rfqAssemblyID;
            result.consolidateID = lineItem.consolidateID;
            result.partNoId = lineItem.mfgPNID != null ? lineItem.mfgPNID.Value : 0;
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
                if (_ICommonApiPricing.ValidateJSON(response.Content))
                {
                    dynamic converse = JsonConvert.DeserializeObject<dynamic>(response.Content);
                    result.resultParts = converse;
                }
                else
                {
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ConstantHelper.TTINoResponse, ConstantHelper.TTINoResponse, isPurchaseApi,lineItem.isStockUpdate);
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                string ErrorMsg = string.Format(ConstantHelper.TTILineItemException, response.Content);
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.TTI.GetEnumStringValue(),
                    mfgPN = lineItem.mfgPN
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                #endregion
            }
            return result;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : catch error and update lineitem/assy wise status table 
        /// </summary>
        /// <param name="assemblyId">long</param>
        /// <param name="consolidateID">long</param>
        /// <param name="responseData">string </param>
        /// <param name="errorData">string</param>
        private void UpdateAutoPricingStatusForError(long assemblyId, long consolidateID, string responseData, string errorData, bool isPurchaseApi,bool isStockUpdate)
        {
            #region log error msg in AutoPricingStatus
            string errorMsg = responseData;
            int pricingApiID = (int)PricingSupplierID.TTI;
            int status = (int)Status.SendRequest;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID
            && x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                {
                    PricingAPIName = PricingAPINames.TTI.GetEnumStringValue(),
                    Status = (int)Status.NotPricing,
                    ErrorMessage = errorData,
                    Message = errorMsg,
                    ConsolidateID = (int)consolidateID,
                    AssyID = (int)assemblyId,
                    isPurchaseApi = isPurchaseApi,
                    supplierID= pricingApiID,
                    isStockUpdate= isStockUpdate
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == assemblyId
                && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
                ))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, errorMsg, objPricingStatus.ErrorMessage, assemblyId, pricingApiID, consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforErrorStatus(objPricingStatus);
                }
            }
            #endregion
        }
    }
}
