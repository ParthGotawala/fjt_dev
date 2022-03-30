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
using System.Threading;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPricing.Mouser
{
    public class MouserJSONPricingRequest : IPricingRequest
    {
        private readonly Irfq_assy_quantityRepository _Irfq_assy_quantityRepository;
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IRabbitMQ _IRabbitMQ;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitemRepository _Irfq_consolidated_mfgpn_lineitemRepository;
        private readonly Irfq_lineitem_autopricingstatusRepository _Irfq_lineitem_autopricingstatusRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        string mouserServiceQueue = ConfigurationManager.AppSettings["RabbitMouserQueue"].ToString();
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        public MouserJSONPricingRequest(Irfq_assy_quantityRepository Irfq_assy_quantityRepository,
            ICommonApiPricing ICommonApiPricing,
            IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_consolidated_mfgpn_lineitemRepository Irfq_consolidated_mfgpn_lineitemRepository,
            Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
            IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
            IRabbitMQ IRabbitMQ,
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
        /// Purpose : get pricing for part and its alternate part from mouser api
        /// </summary>
        /// <param name="LineItem">AutoPricingLineItemwiseStatus</param>
        public void Pricing(AutoPricingLineItemwiseStatus LineItem)
        {
            var objLineItem = _Irfq_consolidated_mfgpn_lineitemRepository.GetRfqConsolidateLineItem(LineItem.ConsolidateID, LineItem.AssyID, LineItem.isPurchaseApi);
            PricingViewModel objPricing = new PricingViewModel()
            {
                rfqAssemblyID = LineItem.AssyID,
                consolidateID = LineItem.ConsolidateID,
                qpa = objLineItem.qpa,
                RequestQty = LineItem.RequestQty,
                isExact = LineItem.IsExact
            };
            try
            {
                bool isPricing = _Irfq_lineitem_autopricingstatusRepository.GetLineItem(LineItem.PricingAPIName, LineItem.AssyID, LineItem.ConsolidateID, LineItem.isPurchaseApi);
                if (isPricing)
                {
                    if (objLineItem != null)
                    {
                        var mouserConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Mouser.GetEnumStringValue()).ToList();
                        var listRestrictedParts = _Irfq_lineitem_autopricingstatusRepository.GetRestrictedPartsForAssy(LineItem.AssyID, LineItem.isPurchaseApi);
                        var MouserApiKey = mouserConfiguration.FirstOrDefault(x => x.key == ConfigKeys.MouserApiKey.GetEnumStringValue());
                        var MouserAPIRequestsLimit = mouserConfiguration.FirstOrDefault(x => x.key == ConfigKeys.MouserAPIRequestsLimit.GetEnumStringValue());
                        if (MouserApiKey == null)
                        {
                            SaveException(ConstantHelper.MouserCardentialNotFound, string.Empty, objPricing, LineItem.isPurchaseApi);
                            return;
                        }
                        var lineItemList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetRfqConsolidateLineItemParts(LineItem.ConsolidateID, LineItem.isPurchaseApi);
                        if (lineItemList.Count() == 0)
                        {
                            SaveException(ConstantHelper.CustomPart, string.Empty, objPricing, LineItem.isPurchaseApi);
                            return;
                        }
                        List<ConsolidateMfgPnAlternatePart> componentList = lineItemList.Where(x => (x.RoHSStatusID != ConstantHelper.Non_RoHS || (x.RoHSStatusID == ConstantHelper.Non_RoHS && x.customerApproval == ConstantHelper.CustomerApproved))).ToList();
                        if (lineItemList.Count() > 0 && componentList.Count() == 0)
                        {
                            SaveException(ConstantHelper.RohsNotApproved, string.Empty, objPricing, LineItem.isPurchaseApi);
                            return;
                        }

                        componentList = componentList.Where(x => x.isGoodPart == ConstantHelper.CorrectPart).ToList();
                        if (lineItemList.Count() > 0 && componentList.Count() == 0)
                        {
                            SaveException(ConstantHelper.BadComponent, string.Empty, objPricing, LineItem.isPurchaseApi);
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
                                RestrictPartModel restrict = listRestrictedParts.Where(x => x.mfgPNID == alternate.mfgPNID).FirstOrDefault();//&& x.consolidateID==LineItem.ConsolidateID
                                if (restrict == null)
                                {
                                    isrestrictedParts = false;
                                    int count = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.checkTBDParameters(alternate.mfgPNID.Value);
                                    if (count == 0)
                                    {
                                        isTBD = false;
                                        ComponentViewModel objComponent = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentData(alternate.mfgPNID.Value);
                                        objPricing.mfgPN = alternate.mfgPN;
                                        objPricing.mfgPNID = alternate.mfgPNID;
                                        objPricing.PIDCode = alternate.PIDCode;
                                        objPricing.NoOfPositions = objLineItem.numOfPosition != null ? (int?)objLineItem.numOfPosition.Value : null;//objLineItem.numOfPosition != null ? (int)objLineItem.numOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null;
                                        objPricing.ApiNoOfPosition = objComponent.noOfPosition != null ? (int?)objComponent.noOfPosition.Value : null; //objComponent.noOfPosition != null ? objComponent.noOfPosition / (objComponent.noOfRows != null ? objComponent.noOfRows : 1) : null;
                                        objPricing.NoOfRows = objLineItem.numOfRows;
                                        objPricing.ApiNoOfRows = objComponent.noOfRows;
                                        objPricing.isPackaging = alternate.isPackaging;
                                        objPricing.mfgCodeID = alternate.mfgCodeID;
                                        objPricing.SupplierID = LineItem.supplierID;
                                        objPricing.BOMUnitID = objLineItem.uomID;
                                        objPricing.ComponentUnitID = objComponent.uom;
                                        objPricing.PackageQty = objComponent.packageQty;
                                        objPricing.mountingtypeID = objComponent.mountingTypeID;
                                        objPricing.functionalCategoryID = objComponent.functionalCategoryID;
                                        objPricing.isStockUpdate = LineItem.isStockUpdate;
                                        objPricing.partPackage = objComponent.packaging;
                                        objPricing.rohsStatusID = objComponent.RoHSStatusID;
                                        objPricing.packageSpqQty = objComponent.unit;
                                        objPricing.mfgName = string.Format(ConstantHelper.MfgNameFormat, alternate.mfgCode, alternate.mfgName);
                                        objPricing.connectorTypeID = objComponent.connecterTypeID;
                                        objPricing.approvedMountingType = alternate.approvedMountingType;
                                        objPricing.mismatchMountingTypeStep = alternate.mismatchMountingTypeStep;
                                        objPricing.mismatchFunctionalCategoryStep = alternate.mismatchFunctionalCategoryStep;
                                        int response = SavePricingDetails(objPricing, MouserApiKey.values, LineItem, MouserAPIRequestsLimit.values);
                                    }
                                }
                            }
                            if (isrestrictedParts)
                            {
                                SaveException(ConstantHelper.RestrictedPart, string.Empty, objPricing, LineItem.isPurchaseApi);
                                return;
                            }
                            if (isTBD)
                            {
                                SaveException(ConstantHelper.TBDPart, string.Empty, objPricing, LineItem.isPurchaseApi);
                                return;
                            }
                        }
                    }
                    else
                    {
                        SaveException(ConstantHelper.LineItemNotFound, string.Empty, objPricing, LineItem.isPurchaseApi);
                        return;
                    }
                }
            }
            catch (Exception ex)
            {

                if (ex.Message == ConstantHelper.ErrorException)
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(LineItem, mouserServiceQueue);
                }
                else
                {
                    SaveException(ex.Message, ex.StackTrace, objPricing, LineItem.isPurchaseApi);
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        consolidateID = objPricing.consolidateID,
                        rfqAssyID = objPricing.rfqAssemblyID,
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = ConstantHelper.Pricing,
                        supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                        mfgPN = objPricing.mfgPN
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
                return;
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="lineItem">PricingViewModel</param>
        /// <param name="MouserApiKey">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string MouserApiKey, AutoPricingLineItemwiseStatus pricingObj,string MouserAPIRequestsLimit)
        {
            try
            {
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                List<AutoPricingPrice> OctoPartPrices = new List<AutoPricingPrice>();
                dynamic result = CallApiGetResponse(MouserApiKey, ConstantHelper.MouserDelay.ToString(), lineItem, pricingObj.isPurchaseApi, MouserAPIRequestsLimit);
                if (result != null && result.SearchResults != null)
                {
                    foreach (var _MouserPart in result.SearchResults.Parts)
                    {
                        AutoPricingPrice octoPartPrice = new AutoPricingPrice();
                        octoPartPrice.AssemblyId = lineItem.rfqAssemblyID;
                        octoPartPrice.consolidateID = lineItem.consolidateID;
                        octoPartPrice.PartNumberId = lineItem.mfgPNID.Value;
                        string manufacturername = _MouserPart.Manufacturer;
                        ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                        if ((objMfg != null && objMfg.id != lineItem.mfgCodeID))
                            continue;

                        string manufacturerPartNumber = _MouserPart.ManufacturerPartNumber;
                        if (manufacturerPartNumber.ToUpper().Trim(' ') != lineItem.mfgPN.ToUpper().Trim(' '))
                            continue;

                        string LifecycleStatus = _MouserPart.LifecycleStatus != null ? _MouserPart.LifecycleStatus.ToString() : string.Empty;
                        var octomanufacturer = new AutoPricingManufacturer()
                        {
                            Name = manufacturername,
                            PartNumber = manufacturerPartNumber,
                            supplier = Helper.Helper.UpdateComponentSupplier.Mouser.GetEnumStringValue(),
                            PartStatus = string.IsNullOrEmpty(LifecycleStatus) ? ConstantHelper.Active : LifecycleStatus,
                            mfgPNDescription = _MouserPart.Description,
                        };
                        decimal InStockQuantity = 0;
                        decimal MinimumBuy = 0;
                        decimal weeks = 0;
                        string Min = _MouserPart.Min != null ? _MouserPart.Min.ToString() : string.Empty;
                        string Availability = _MouserPart.Availability != null ? _MouserPart.Availability.ToString() : string.Empty;
                        if (!string.IsNullOrEmpty(Availability))
                            decimal.TryParse(Availability.Replace(ConstantHelper.MouserInstock, ""), out InStockQuantity);
                        decimal.TryParse(Min, out MinimumBuy);
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
                        string Uom = ConstantHelper.DefaultUom;
                        decimal Multiplier = 1;
                        string features = string.Empty;
                        string Mult = _MouserPart.Mult != null ? _MouserPart.Mult.ToString() : string.Empty;
                        decimal.TryParse(Mult, out Multiplier);
                        string packaging = null;
                        decimal? packageQty = null;
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
                        string DataSheetUrl = _MouserPart.DataSheetUrl != null ? _MouserPart.DataSheetUrl.ToString() : string.Empty;
                        if (DataSheetUrl != string.Empty && DataSheetUrl.ToLower().Contains(ConstantHelper.Epoxy))
                        {
                            features = ConstantHelper.ConductiveEpoxy;
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
                        var seller = new AutoPricingSeller()
                        {
                            InStockQuantity = InStockQuantity,
                            MinimumBuy = MinimumBuy,
                            SellerName = SourceOfPricing.MouserPartPricingService.GetEnumStringValue(),
                            ProductUrl = _MouserPart.ProductDetailUrl ?? ConstantHelper.MouserHomepageUrl,
                            Sku = _MouserPart.MouserPartNumber,
                            HomePageUrl = ConstantHelper.MouserHomepageUrl,
                            APILeadTime = _leadTime,
                            Authorized_Reseller = true,
                            TimeStamp = DateTime.UtcNow,
                            Multiplier = Multiplier,
                            Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                            Uom = Uom,
                            PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue(),
                            NoOfPosition = null, //mouser is not returning no of position
                            dataSheetLink = DataSheetUrl,
                            feature = features,
                            Packaging = packaging,
                            categoryText = _MouserPart.Category,
                            mountingType = string.Empty,
                            connectorTypetext = string.Empty,
                            imageURL = _MouserPart.ImagePath,
                            ComponentImages = Images,
                            DataSheets = dataSheets
                        };

                        seller.PricesByReqQty = new Dictionary<int, string>();
                        seller.RoHS = _MouserPart.ROHSStatus;
                        seller.NCNR = CommonStatus.UNKNOWN.GetEnumStringValue();
                        foreach (var _priceBreaks in _MouserPart.PriceBreaks)
                        {
                            int qtyrange = _priceBreaks.Quantity;
                            string price = _priceBreaks.Price;
                            if (!seller.PricesByReqQty.ContainsKey(qtyrange))
                                seller.PricesByReqQty.Add(qtyrange, price);
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
                        OctoPartPrices.Add(octoPartPrice);
                    }
                }
                int retint = _ICommonApiPricing.PricingDetail(OctoPartPrices, assyQtyList, lineItem, PricingAPINames.Mouser.GetEnumStringValue(), pricingObj.isPurchaseApi);
                return 1;
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus

                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, mouserServiceQueue);
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
                        supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    SaveException(ex.Message, ex.StackTrace, lineItem, pricingObj.isPurchaseApi);
                    _IRabbitMQ.SendRequest(objErrorLog);
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
        public dynamic CallApiGetResponse(string apiKey, string sleepTime, PricingViewModel lineItem, bool isPurchaseApi,string MouserAPIRequestsLimit)
        {
            Thread.Sleep(int.Parse(sleepTime));
            var response = new object();
            var data = _ICommonApiPricing.MouserApiGetResponse(apiKey, lineItem.mfgPN);
            try
            {
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    response = JsonConvert.DeserializeObject<dynamic>(data);
                    dynamic obj = response;
                    if (obj != null && obj.SearchResults == null)
                    {
                        foreach (var Error in obj.Errors)
                        {
                            if (Error.Message.ToString() == ConstantHelper.MouserMaximumCall)
                            {
                                _IRabbitMQSendMessageRequestHandler.SendRequest(lineItem, mouserServiceQueue);
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
                                    clientID = apiKey,
                                    limitExceedText = "Yes",
                                    callLimit= MouserAPIRequestsLimit
                                };
                                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                            }
                            else
                            {
                                SaveException(string.Format("{0} {1}", Error.PropertyName, Error.Message), "Mouser API Issue", lineItem, isPurchaseApi);
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
                            clientID = apiKey,
                            limitExceedText = "No",
                            callLimit= MouserAPIRequestsLimit
                        };
                        _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    }
                }
                else
                {
                    response = null;
                }
            }
            catch (Exception ex)
            {
                SaveException(ex.Message, ex.StackTrace, lineItem, isPurchaseApi);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Mouser.GetEnumStringValue(),
                    mfgPN = lineItem.mfgPN
                };
                // _IRabbitMQ.SendRequest(objErrorLog);
            }
            return response;
        }

        private void SaveException(string message, string errormessage, PricingViewModel lineItem, bool isPurchaseApi)
        {
            if (message == ConstantHelper.Invalidkey)
            {
                message = ConstantHelper.InvalidkeyMessage;
            }
            #region log error msg in AutoPricingStatus
            int pricingApiID = (int)PricingSupplierID.Mouser;
            int status = (int)Status.SendRequest;
            string ErrorMsg = string.Format(ConstantHelper.MouserException, "");
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == lineItem.consolidateID
            && x.rfqAssyID == lineItem.rfqAssemblyID && x.pricingSupplierID == pricingApiID
            && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                {
                    PricingAPIName = PricingAPINames.Mouser.GetEnumStringValue(),
                    Status = (int)Status.NotPricing,
                    ErrorMessage = string.Format("{0} <br/> {1} <br/> {2}", ErrorMsg, message, errormessage),
                    Message = message,
                    ConsolidateID = lineItem.consolidateID,
                    AssyID = lineItem.rfqAssemblyID,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID,
                    isStockUpdate = lineItem.isStockUpdate
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == lineItem.rfqAssemblyID
                && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
                ))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, ErrorMsg, objPricingStatus.ErrorMessage, lineItem.rfqAssemblyID, pricingApiID, lineItem.consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforErrorStatus(objPricingStatus);
                }
            }
            #endregion
        }
    }
}
