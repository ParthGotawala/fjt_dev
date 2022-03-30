using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPricing.Avnet
{
    public class AvnetPricingRequest : IPricingRequest
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IRabbitMQ _IRabbitMQ;
        private readonly Irfq_assy_quantityRepository _Irfq_assy_quantityRepository;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitemRepository _Irfq_consolidated_mfgpn_lineitemRepository;
        private readonly Irfq_lineitem_autopricingstatusRepository _Irfq_lineitem_autopricingstatusRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        string avnetServiceQueue = ConfigurationManager.AppSettings["RabbitAvnetQueue"].ToString();
        public AvnetPricingRequest(ICommonApiPricing ICommonApiPricing,
            Irfq_assy_quantityRepository Irfq_assy_quantityRepository,
                        IsystemconfigrationsRepository IsystemconfigrationsRepository,
                        Irfq_consolidated_mfgpn_lineitemRepository Irfq_consolidated_mfgpn_lineitemRepository,
                        Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
                        Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
                        IRabbitMQ IRabbitMQ, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
                        IDigikeyPricingRepository IDigikeyPricingRepository)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _Irfq_assy_quantityRepository = Irfq_assy_quantityRepository;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitemRepository = Irfq_consolidated_mfgpn_lineitemRepository;
            _Irfq_lineitem_autopricingstatusRepository = Irfq_lineitem_autopricingstatusRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQ = IRabbitMQ;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
        }
        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : get pricing for part and its alternate part from avnet api
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
                        var avnetConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Avnet.GetEnumStringValue());
                        var avnetAuthToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetAuthToken.GetEnumStringValue());
                        var avnetStoreID = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetStoreID.GetEnumStringValue());
                        var avnetWCToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetWCToken.GetEnumStringValue());
                        var avnetWCTrustedToken = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetWCTrustedToken.GetEnumStringValue());
                        var AvnetAPIHostName = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetAPIHostName.GetEnumStringValue());
                        var AvnetAPIPath = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetAPIPath.GetEnumStringValue());
                        var AvnetSubscriptionKey = avnetConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AvnetSubscriptionKey.GetEnumStringValue());
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
                                            mfgName = string.Format(ConstantHelper.MfgNameFormat, alternate.mfgCode, alternate.mfgName),
                                            rohsStatusID = objComponent.RoHSStatusID,
                                            packageSpqQty = objComponent.unit,
                                            connectorTypeID = objComponent.connecterTypeID,
                                            approvedMountingType = alternate.approvedMountingType,
                                            mismatchMountingTypeStep = alternate.mismatchMountingTypeStep,
                                            mismatchFunctionalCategoryStep = alternate.mismatchFunctionalCategoryStep
                                        };
                                        int response = SavePricingDetails(objPricing, avnetStoreID.values, avnetWCToken.values, avnetWCTrustedToken.values, LineItem, AvnetAPIPath.values, AvnetSubscriptionKey.values);
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
                    supplier = PricingAPINames.Avnet.GetEnumStringValue(),
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return;
            }
        }
        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : get pricing list objects
        /// </summary>
        /// <param name="LineItem">rfq_lineitems</param>
        /// <param name="avnetAuthToken">string</param>
        /// <param name="avnetStoreId">string</param>
        private dynamic CallApiGetResponse(PricingViewModel lineItem, string avnetStoreId, string avnetWCToken, string avnetWCTrustedToken, bool isPurchaseApi, string avnetPath, string avnetSubscriptionKey)
        {

            var response = new object();
            var data = _ICommonApiPricing.AvnetApiGetResponse(lineItem.mfgPN, avnetStoreId, avnetWCToken, avnetWCTrustedToken, avnetPath, avnetSubscriptionKey);
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
                else if (data != string.Empty)
                {
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, data, errorMsg, isPurchaseApi, lineItem.isStockUpdate);
                }
                else
                {
                    response = null;
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                string ErrorMsg = string.Format(ConstantHelper.AvnetLineItemException, data);
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Avnet.GetEnumStringValue(),
                    mfgPN = lineItem.mfgPN
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                #endregion
            }
            return response;
        }
        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="objLineItem">rfq_lineitems</param>
        /// <param name="avnetAuthToken">string</param>
        /// <param name="avnetStoreID">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string avnetStoreID, string avnetWCToken, string avnetWCtrustedToken, AutoPricingLineItemwiseStatus pricingObj, string avnetPath, string avnetSubscriptionKey)
        {
            try
            {
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                List<AutoPricingPrice> AvnetPartPrices = new List<AutoPricingPrice>();
                dynamic response = CallApiGetResponse(lineItem, avnetStoreID, avnetWCToken, avnetWCtrustedToken, pricingObj.isPurchaseApi, avnetPath, avnetSubscriptionKey);
                if (response != null && response.productDetails != null)
                {
                    foreach (var AvnetPartDet in response.productDetails)
                    {
                        AutoPricingPrice avnetPartPrice = new AutoPricingPrice();
                        avnetPartPrice.AssemblyId = lineItem.rfqAssemblyID;
                        avnetPartPrice.consolidateID = lineItem.consolidateID;
                        avnetPartPrice.PartNumberId = lineItem.mfgPNID != null ? lineItem.mfgPNID.Value : 0;
                        string manufacturername = AvnetPartDet.manufacturerName;
                        if (string.IsNullOrEmpty(manufacturername))
                        {
                            manufacturername = AvnetPartDet.mfCode;
                        }
                        if (string.IsNullOrEmpty(manufacturername))
                        {
                            continue;
                        }
                        ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                        if ((objMfg != null && objMfg.id != lineItem.mfgCodeID))
                            continue;
                        string manufacturerPartNumber = AvnetPartDet.mfPartNumber;
                        if (manufacturerPartNumber.ToUpper() != lineItem.mfgPN.ToUpper())
                            continue;
                        string homePageUrl = ConstantHelper.AvnetHomePageURL;

                        // Part Status is obsolote or not
                        string partStatus = AvnetPartDet.obsoleteFlag == PartStatus.NO.GetEnumStringValue() ? PartStatus.Active.GetEnumStringValue() : PartStatus.Inactive.GetEnumStringValue();

                        // Avent Response object to get part status details.
                        var avnetmanufacturer = new AutoPricingManufacturer()
                        {
                            Name = manufacturername,
                            HomePageUrl = homePageUrl,
                            PartNumber = manufacturerPartNumber,
                            PartStatus = partStatus,
                            mfgPNDescription = AvnetPartDet.shortDescription
                        };

                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                        decimal InStockQuantity = 0;
                        //In Stock quantity
                        try
                        {
                            InStockQuantity = AvnetPartDet.inStock ?? 0;
                        }
                        catch (Exception e)
                        {
                            InStockQuantity = 0;
                        }
                        decimal MinimumBuy = 1;
                        try
                        {
                            // Minimum qunatity to buy
                            MinimumBuy = AvnetPartDet.minimumQuantity;
                        }
                        catch (Exception e) { }

                        // factoryLeadTimein Days
                        int? leadTime = null;
                        try
                        {
                            leadTime = (AvnetPartDet.factoryLeadTime == null) ? null : (AvnetPartDet.factoryLeadTime / 7);
                        }
                        catch (Exception e)
                        {
                            leadTime = null;
                        }

                        // Product URL
                        string productURL = AvnetPartDet.pdpUrl;
                        string NCNR = CommonStatus.UNKNOWN.GetEnumStringValue();

                        // Quantity avaliable in multiple of qty
                        decimal Multiplier = AvnetPartDet.multipleQuantity;

                        // Avent Response get all pricing range object and add to dictionary
                        foreach (var priceItem in AvnetPartDet.price.rangePrice)
                        {
                            int qtyrange = priceItem.minimumQty.value;
                            string price = priceItem.priceInRange.value;
                            if (!PricesByReqQty.ContainsKey(qtyrange))
                                PricesByReqQty.Add(qtyrange, price);
                        }
                        if (PricesByReqQty.Count() == 0)
                        {
                            PricesByReqQty.Add(1, "0.00");
                        }
                        //avnet unit of measer
                        string Uom = ConstantHelper.DefaultUom;
                        try
                        {
                            if (AvnetPartDet.technicalAttributes != null)
                            {
                                foreach (var attributes in AvnetPartDet.technicalAttributes)
                                {
                                    if (attributes.name == ConstantHelper.CableLength)
                                    {
                                        Uom = attributes.value;
                                        break;
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                        // "packageTypeCode": "BLK"
                        // "packageTypeCode": "TRY"
                        string Packaging = AvnetPartDet.packageTypeCode;

                        //‘Yes’, ‘No’, ‘Exempt’
                        string RohsStatus = AvnetPartDet.ROHSComplianceCode;

                        // "customReelFlag": "N"
                        string Reeling = AvnetPartDet.customReelFlag == CommonStatus.Y.GetEnumStringValue() ? CommonStatus.YES.GetEnumStringValue() : CommonStatus.NO.GetEnumStringValue();

                        // create seller object with details of qty, leadtime, in stock qty, product url etc.
                        var seller = new AutoPricingSeller()
                        {
                            InStockQuantity = InStockQuantity,
                            MinimumBuy = MinimumBuy,
                            SellerName = SourceOfPricing.AvnetPricingService.GetEnumStringValue(),
                            ProductUrl = productURL ?? homePageUrl,
                            Sku = AvnetPartDet.supplierPartNumber,
                            HomePageUrl = homePageUrl,
                            APILeadTime = leadTime,
                            Authorized_Reseller = true,
                            TimeStamp = DateTime.UtcNow,
                            Multiplier = Multiplier,
                            Reeling = Reeling,
                            Packaging = Packaging,
                            Uom = Uom,
                            PricingType = lineItem.IsCustomPrice ? Helper.Helper.PriceStatus.Special.GetEnumStringValue() : Helper.Helper.PriceStatus.Standard.GetEnumStringValue(),
                            NoOfPosition = null,//avnet not returning no of position
                            detailDescription = AvnetPartDet.longDescription
                        };
                        seller.PricesByReqQty = PricesByReqQty;
                        seller.RoHS = RohsStatus;
                        seller.NCNR = NCNR;

                        avnetmanufacturer.Sellers = avnetmanufacturer.Sellers ?? new List<AutoPricingSeller>();
                        avnetmanufacturer.Sellers.Add(seller);
                        avnetPartPrice.Manufacturers = avnetPartPrice.Manufacturers ?? new List<AutoPricingManufacturer>();
                        avnetPartPrice.Manufacturers.Add(avnetmanufacturer);
                        AvnetPartPrices.Add(avnetPartPrice);
                    }
                }
                int retint = _ICommonApiPricing.PricingDetail(AvnetPartPrices, assyQtyList, lineItem, PricingAPINames.Avnet.GetEnumStringValue(), pricingObj.isPurchaseApi);
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus

                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, avnetServiceQueue);
                }
                else
                {
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        consolidateID = lineItem.consolidateID,
                        rfqAssyID = lineItem.rfqAssemblyID,
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = ConstantHelper.Pricing,
                        supplier = PricingAPINames.Avnet.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    string ErrorMsg = string.Format(ex.Message, ex.InnerException, ex.StackTrace);
                    if (ex.Message.Contains(ConstantHelper.AvnetError))
                        ErrorMsg = ex.Message;
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), pricingObj.isPurchaseApi, lineItem.isStockUpdate);
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
                #endregion
            }
            return 1;
        }

        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : save status for pricing after getting error
        /// </summary>
        /// <param name="assemblyId">long</param>
        /// <param name="lineItemId">long</param>
        /// <param name="responseData">string</param>
        /// <param name="errorData">string</param>
        private void UpdateAutoPricingStatusForError(long assemblyId, long consolidateID, string responseData, string errorData, bool isPurchaseApi, bool isStockUpdate)
        {
            #region log error msg in AutoPricingStatus
            int pricingApiID = (int)PricingSupplierID.Avnet;
            int status = (int)Status.SendRequest;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID && x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                {
                    Status = (int)Status.NotPricing,
                    Message = responseData,
                    ErrorMessage = errorData,
                    PricingAPIName = PricingAPINames.Avnet.GetEnumStringValue(),
                    AssyID = (int)assemblyId,
                    ConsolidateID = (int)consolidateID,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID,
                    isStockUpdate = isStockUpdate
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID && x.isPurchaseApi == isPurchaseApi
                && x.status == status))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, responseData, errorData, assemblyId, pricingApiID, consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforErrorStatus(statusModel);
                }
            }
            #endregion
        }
    }
}
