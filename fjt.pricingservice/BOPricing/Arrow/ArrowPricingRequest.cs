using fjt.pricingservice.BOPricing.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.MySqlDBModel;
using static fjt.pricingservice.Helper.Helper;
using fjt.pricingservice.Helper;
using RestSharp;
using Newtonsoft.Json;
using fjt.pricingservice.ErrorLog.Interface;
using System.Configuration;
using fjt.pricingservice.Handlers.Interfaces;

namespace fjt.pricingservice.BOPricing.Arrow
{
    public class ArrowPricingRequest : IPricingRequest
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
        string arrowKeyServiceQueue = ConfigurationManager.AppSettings["RabbitArrowQueue"].ToString();
        public ArrowPricingRequest(
            Irfq_assy_quantityRepository Irfq_assy_quantityRepository,
            ICommonApiPricing ICommonApiPricing,
            IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_consolidated_mfgpn_lineitemRepository Irfq_consolidated_mfgpn_lineitemRepository,
            Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
            IRabbitMQ IRabbitMQ, IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
            IDigikeyPricingRepository IDigikeyPricingRepository)
        {
            _Irfq_assy_quantityRepository = Irfq_assy_quantityRepository;
            _Irfq_lineitem_autopricingstatusRepository = Irfq_lineitem_autopricingstatusRepository;
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitemRepository = Irfq_consolidated_mfgpn_lineitemRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQ = IRabbitMQ;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : get pricing for part and its alternate part from arrow api
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
                        var arrowConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Arrow.GetEnumStringValue()).ToList();
                        var ArrowApiKey = arrowConfiguration.FirstOrDefault(x => x.key == ConfigKeys.ArrowApiKey.GetEnumStringValue());
                        var ArrowLoginKey = arrowConfiguration.FirstOrDefault(x => x.key == ConfigKeys.ArrowLoginKey.GetEnumStringValue());
                        if (ArrowApiKey == null || ArrowLoginKey == null)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.ArrowCardentialNotFound, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
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
                                        if (alternate.mfgPN.Length > 2)
                                        {
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
                                            int response = SavePricingDetails(objPricing, ArrowApiKey.values, ArrowLoginKey.values, LineItem);
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
                UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ex.Message, ex.StackTrace, LineItem.isPurchaseApi, LineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = LineItem.ConsolidateID,
                    rfqAssyID = LineItem.AssyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Arrow.GetEnumStringValue(),
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
        /// <param name="ArrowApiKey">string</param>
        /// <param name="ArrowLoginKey">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string ArrowApiKey, string ArrowLoginKey, AutoPricingLineItemwiseStatus pricingObj)
        {
            try
            {
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                List<AutoPricingPrice> ArrowPartPrices = new List<AutoPricingPrice>();
                dynamic result = CallApiGetResponse(ArrowApiKey, ArrowLoginKey, lineItem, pricingObj.isPurchaseApi);
                if (result == null) {

                    int status = (int)Status.SendRequest;
                    int pricingApiID = (int)PricingSupplierID.Arrow;
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
                            PricingAPIName = PricingAPINames.Arrow.GetEnumStringValue(),
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
                var isexternalApi = true;
                foreach (var ArrowPart in refstring.itemserviceresult.data)
                {
                    isexternalApi = false;
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
                                        AutoPricingPrice arrowPartPrice = new AutoPricingPrice();
                                        arrowPartPrice.AssemblyId = lineItem.rfqAssemblyID;
                                        arrowPartPrice.consolidateID = lineItem.consolidateID;
                                        arrowPartPrice.PartNumberId = lineItem.mfgPNID != null ? lineItem.mfgPNID.Value : 0;
                                        string manufacturername = ArrowPartDet.manufacturer.mfrName;
                                        ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                                        if ((objMfg != null && objMfg.id != lineItem.mfgCodeID))
                                            continue;
                                        string manufacturerPartNumber = ArrowPartDet.partNum;
                                        if (manufacturerPartNumber.ToUpper().Trim(' ') != lineItem.mfgPN.ToUpper().Trim(' '))
                                            continue;
                                        var arrowmanufacturer = new AutoPricingManufacturer()
                                        {
                                            Name = manufacturername,
                                            PartNumber = manufacturerPartNumber,
                                            mfgPNDescription = ArrowPartDet.desc,
                                        };
                                        decimal InStockQuantity = 0;
                                        decimal MinimumBuy = 0;
                                        int? leadTime = null;
                                        decimal Multiplier = 1;
                                        string NCNR = string.Empty;
                                        string productURL = string.Empty;
                                        string RohsStatus = string.Empty;
                                        string Packaging = string.Empty;
                                        string distyPart = string.Empty;
                                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                                        foreach (var AvailableQty in arrowPrice.Availability)
                                        {
                                            InStockQuantity = AvailableQty.fohQty;
                                            break;
                                        }
                                        MinimumBuy = arrowPrice.minimumOrderQuantity;
                                        distyPart = arrowPrice.sourcePartId;
                                        if (arrowPrice.mfrLeadTime != null)
                                        {
                                            leadTime = arrowPrice.mfrLeadTime;
                                        }
                                        productURL = arrowPrice.resources[0].uri;
                                        NCNR = arrowPrice.isNcnr == true ? CommonStatus.YES.GetEnumStringValue() : CommonStatus.NO.GetEnumStringValue();
                                        if (arrowPrice.Prices != null && arrowPrice.Prices.resaleList != null)
                                        {
                                            foreach (var priceBreak in arrowPrice.Prices.resaleList)
                                            {
                                                int qtyrange = priceBreak.minQty;
                                                string price = priceBreak.price;
                                                if (!PricesByReqQty.ContainsKey(qtyrange))
                                                    PricesByReqQty.Add(qtyrange, price);
                                            }
                                        }
                                        if (PricesByReqQty.Count() == 0)
                                        {
                                            PricesByReqQty.Add(1, "0.00");
                                        }
                                        Packaging = arrowPrice.containerType;
                                        if (ArrowPartDet.EnvData != null && ArrowPartDet.EnvData.compliance != null)
                                        {
                                            foreach (var rohsPart in ArrowPartDet.EnvData.compliance)
                                            {
                                                if (rohsPart.displayLabel == ConstantHelper.Rohs)
                                                {
                                                    RohsStatus = rohsPart.displayValue;
                                                }
                                            }
                                        }

                                        var seller = new AutoPricingSeller()
                                        {
                                            InStockQuantity = InStockQuantity,
                                            MinimumBuy = MinimumBuy,
                                            SellerName = SourceOfPricing.ArrowPricingService.GetEnumStringValue(),
                                            ProductUrl = productURL ?? ConstantHelper.ArrowHomepageUrl,
                                            Sku = distyPart,
                                            HomePageUrl = ConstantHelper.ArrowHomepageUrl,
                                            APILeadTime = leadTime,
                                            Authorized_Reseller = true,
                                            TimeStamp = DateTime.UtcNow,
                                            Multiplier = Multiplier,
                                            Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                                            Packaging = Packaging,
                                            Uom = ConstantHelper.DefaultUom,
                                            PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue(),
                                            NoOfPosition = null,
                                            //arrow not giving no of position
                                        };
                                        seller.PricesByReqQty = PricesByReqQty;
                                        seller.RoHS = RohsStatus;
                                        seller.NCNR = NCNR;

                                        arrowmanufacturer.Sellers = arrowmanufacturer.Sellers ?? new List<AutoPricingSeller>();
                                        arrowmanufacturer.Sellers.Add(seller);
                                        arrowPartPrice.Manufacturers = arrowPartPrice.Manufacturers ?? new List<AutoPricingManufacturer>();
                                        arrowPartPrice.Manufacturers.Add(arrowmanufacturer);
                                        ArrowPartPrices.Add(arrowPartPrice);
                                    }
                                }
                            }


                        }
                        int retint = _ICommonApiPricing.PricingDetail(ArrowPartPrices, assyQtyList, lineItem, PricingAPINames.Arrow.GetEnumStringValue(), pricingObj.isPurchaseApi);
                    }
                    else
                    {
                        int status = (int)Status.SendRequest;
                        int pricingApiID = (int)PricingSupplierID.Arrow;
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
                                PricingAPIName = PricingAPINames.Arrow.GetEnumStringValue(),
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
                    }
                }
                if (isexternalApi)
                {
                    #region log error msg in AutoPricingStatus
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        consolidateID = lineItem.consolidateID,
                        rfqAssyID = lineItem.rfqAssemblyID,
                        error = ConstantHelper.ArrowIssue,
                        stackTrace = ConstantHelper.ArrowIssue,
                        Source = ConstantHelper.Pricing,
                        supplier = PricingAPINames.Arrow.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    string ErrorMsg = string.Format("{0} {1} {2}", objErrorLog.error, string.Empty, objErrorLog.stackTrace);
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, ErrorMsg, pricingObj.isPurchaseApi, lineItem.isStockUpdate);
                    #endregion
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
                return 1;
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus

                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, arrowKeyServiceQueue);
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
                        supplier = PricingAPINames.Arrow.GetEnumStringValue(),
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
        /// Purpose : call arrow api and get pricing for partnumber
        /// </summary>
        /// <param name="apiKey">arrow api key</param>
        /// <param name="lineItem">PricingViewModel </param>
        /// <param name="loginkey">login key name</param>
        private dynamic CallApiGetResponse(string apikey, string loginkey, PricingViewModel lineItem, bool isPurchaseApi)
        {
            var response = new object();
            var data = _ICommonApiPricing.ArrowApiGetResponse(apikey, loginkey, lineItem.mfgPN);
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
                    var refstring = JsonConvert.DeserializeObject<dynamic>(response.ToString());
                    if (refstring.itemserviceresult.transactionArea[0].response.returnMsg.ToString() == ConstantHelper.ArrowLengthException)
                    {
                        UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, refstring.itemserviceresult.transactionArea[0].response.returnMsg.ToString(), refstring.itemserviceresult.transactionArea[0].response.returnMsg.ToString(), isPurchaseApi, lineItem.isStockUpdate);
                        response = null;
                    }
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
                string ErrroMsg = string.Format(ConstantHelper.ArrowLineItemException, data);
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrroMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Arrow.GetEnumStringValue(),
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
            int pricingApiID = (int)PricingSupplierID.Arrow;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID && x.rfqAssyID == assemblyId
            && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                {
                    Status = (int)Status.NotPricing,
                    ErrorMessage = errorData,
                    Message = errorMsg,
                    PricingAPIName = PricingAPINames.Arrow.GetEnumStringValue(),
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
