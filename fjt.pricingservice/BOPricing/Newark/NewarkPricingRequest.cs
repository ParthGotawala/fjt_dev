using fjt.pricingservice.BOPricing.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.MySqlDBModel;
using RestSharp;
using Newtonsoft.Json;
using static fjt.pricingservice.Helper.Helper;
using fjt.pricingservice.Helper;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;

namespace fjt.pricingservice.BOPricing.Newark
{
    public class NewarkPricingRequest : IPricingRequest
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
        string newarkKeyServiceQueue = ConfigurationManager.AppSettings["RabbitNewarkQueue"].ToString();
        public NewarkPricingRequest(
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
        /// Purpose : get pricing for part and its alternate part from newark api
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
                        var newarkConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(PricingAPINames.Newark.GetEnumStringValue()).ToList();
                        var NewarkApiKey = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkApiKey.GetEnumStringValue());
                        var NewarkApiSecretKey = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkSecretKey.GetEnumStringValue());
                        var NewarkApiCustomerID = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkCustomerID.GetEnumStringValue());
                        var NewarkAPIRequestsLimit = newarkConfiguration.FirstOrDefault(x => x.key == ConfigKeys.NewarkAPIRequestsLimit.GetEnumStringValue());
                        if (NewarkApiKey == null)
                        {
                            UpdateAutoPricingStatusForError(LineItem.AssyID, LineItem.ConsolidateID, ConstantHelper.NewarkCardentialNotFound, string.Empty, LineItem.isPurchaseApi, LineItem.isStockUpdate);
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
                                RestrictPartModel restrict = listRestrictedParts.Where(x => x.mfgPNID == alternate.mfgPNID).FirstOrDefault(); //&& x.consolidateID==LineItem.ConsolidateID
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
                                            IsCustomPrice = LineItem.IsCustomPrice,
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
                                        int response = SavePricingDetails(objPricing, NewarkApiKey.values, LineItem.IsCustomPrice, NewarkApiCustomerID.values, NewarkApiSecretKey.values, LineItem, NewarkAPIRequestsLimit.values);
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
                    supplier = PricingAPINames.Newark.GetEnumStringValue(),
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return;
            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save 
        /// </summary>
        /// <param name="objLineItem">rfq_lineitems</param>
        /// <param name="NewarkApiKey">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string NewarkApiKey, bool isCustom, string customerID, string secretKey, AutoPricingLineItemwiseStatus pricingObj,string NewarkAPIRequestsLimit)
        {
            try
            {
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObj.isPurchaseApi);
                List<AutoPricingPrice> OctoPartPrices = new List<AutoPricingPrice>();
                var response = CallApiGetResponse(ConstantHelper.NewarkBaseURI, NewarkApiKey, lineItem, ConstantHelper.NewarkSleepingTime, isCustom, customerID, secretKey, pricingObj.isPurchaseApi, NewarkAPIRequestsLimit);
                if (response.resultParts != null)
                {
                    var refstring = JsonConvert.DeserializeObject<dynamic>(response.resultParts.ToString());
                    if (refstring.manufacturerPartNumberSearchReturn != null && refstring.manufacturerPartNumberSearchReturn.products != null)
                    {
                        foreach (var item in refstring.manufacturerPartNumberSearchReturn.products)
                        {
                            AutoPricingPrice octoPartPrice = new AutoPricingPrice();
                            octoPartPrice.AssemblyId = (long)lineItem.rfqAssemblyID;
                            octoPartPrice.consolidateID = (long)response.consolidateID;
                            octoPartPrice.PartNumberId = (int)response.partNoId;
                            octoPartPrice.PriceType = lineItem.IsCustomPrice ? PriceStatus.Special.GetEnumStringValue() : PriceStatus.Standard.GetEnumStringValue();
                            string manufacturername = item.brandName.Value;
                            ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                            if ((objMfg != null && objMfg.id != lineItem.mfgCodeID))
                                continue;

                            //string manufuid = item.vendorId.Value;
                            string manufacturerHomepageUrl = string.Empty;
                            string manufacturerPartNumber = item.translatedManufacturerPartNumber.Value;
                            if (manufacturerPartNumber.ToUpper().Trim(' ') != lineItem.mfgPN.ToUpper().Trim(' '))
                                continue;
                            var octomanufacturer = new AutoPricingManufacturer()
                            {
                                Name = manufacturername,
                                HomePageUrl = string.Empty,
                                PartNumber = manufacturerPartNumber,
                                supplier = Helper.Helper.UpdateComponentSupplier.Newark.GetEnumStringValue(),
                                PartStatus = ConstantHelper.Active,
                                mfgPNDescription = item.displayName,
                            };
                            decimal InStockQuantity = 0;
                            decimal MinimumBuy = 0;
                            decimal multi = 0;
                            decimal.TryParse(item.inv.ToString(), out InStockQuantity);
                            decimal.TryParse(item.translatedMinimumOrderQuality.ToString(), out MinimumBuy);
                            decimal.TryParse(item.packSize.ToString(), out multi);
                            int? APILeadTime = null;
                            decimal weeks = 0;
                            if (item.stock != null && !string.IsNullOrEmpty(Convert.ToString(item.stock)))
                            {
                                try
                                {
                                    APILeadTime = item.stock.leastLeadTime.Value != null ? Convert.ToInt32(item.stock.leastLeadTime.Value) : null;
                                    weeks = APILeadTime.Value / 7;
                                    APILeadTime = (int)(Math.Ceiling(weeks));
                                }
                                catch (Exception e)
                                {
                                    APILeadTime = null;
                                }
                            }

                            int? noOfPosition = null;
                            string lengthtext = string.Empty;
                            string widthTxt = string.Empty;
                            string heightText = string.Empty;
                            string tolerance = string.Empty;
                            double? minTemp = null;
                            double? maxTemp = null;
                            string minTempString = string.Empty;
                            string maxTempString = string.Empty;
                            string features = string.Empty;
                            string packaging = string.Empty;
                            string sizeDimension = string.Empty;
                            string powerRating = string.Empty;
                            string value = string.Empty;
                            string voltage = string.Empty;
                            string partPackage = string.Empty;
                            string color = string.Empty;
                            string operatingTemp = string.Empty;
                            string noOfPositionText = string.Empty;
                            string noOfRowsText = string.Empty;

                            int? noOfRows = null;
                            if (item.displayName.ToString().ToLower().Contains(ConstantHelper.Epoxy))
                            {
                                features = ConstantHelper.ConductiveEpoxy;
                            }
                            if (item.attributes != null)
                            {
                                foreach (var attribute in item.attributes)
                                {
                                    if (attribute.attributeLabel == ConstantHelper.NoOfPin || attribute.attributeLabel == ConstantHelper.NoOfContact)
                                    {
                                        noOfPosition = attribute.attributeValue;
                                        noOfPositionText = attribute.attributeValue.ToString();
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkLength)
                                    {
                                        lengthtext = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkWidth)
                                    {
                                        widthTxt = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.NewarkHeight || attribute.attributeLabel == ConstantHelper.NewarkHeightMax)
                                    {
                                        heightText = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.Tolerance || attribute.attributeLabel == ConstantHelper.CapaTolerance)
                                    {
                                        tolerance = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.OperatingMin)
                                    {
                                        minTempString = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        bool isFahrenheit = false;
                                        if (minTempString.Contains(ConstantHelper.TemperatureFahrenheitSign))
                                        {
                                            isFahrenheit = true;
                                        }
                                        minTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTempString.Replace(ConstantHelper.TemperaturePlusMinusSign, "-"), isFahrenheit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel == ConstantHelper.OperatingMax)
                                    {
                                        maxTempString = string.Format("{0}{1}", attribute.attributeValue, attribute.attributeUnit);
                                        bool isFahrenheit = false;
                                        if (maxTempString.Contains(ConstantHelper.TemperatureFahrenheitSign))
                                        {
                                            isFahrenheit = true;
                                        }
                                        minTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(maxTempString.Replace(ConstantHelper.TemperaturePlusMinusSign, ""), isFahrenheit);
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackaging)
                                    {
                                        packaging = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakPowerRating)
                                    {
                                        powerRating = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarakSizeDimension)
                                    {
                                        sizeDimension = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkCapacitance ||
                                        attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkInductance ||
                                         attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkResistance)
                                    {
                                        value = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageRating ||
                                        attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkVoltageIsolation)
                                    {
                                        partPackage = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkPackage)
                                    {
                                        partPackage = attribute.attributeValue;
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString().ToLower() == ConstantHelper.NewarkNoOfRows)
                                    {
                                        noOfRows = attribute.attributeValue;
                                        noOfRowsText = attribute.attributeValue.ToString();
                                        continue;
                                    }
                                    if (attribute.attributeLabel.ToString() == ConstantHelper.LedColors)
                                    {
                                        color = attribute.attributeValue;
                                        continue;
                                    }
                                }
                            }
                            if (lengthtext != string.Empty && widthTxt != string.Empty)
                            {
                                sizeDimension = string.Format("{0}x{1}", lengthtext, widthTxt);
                            }
                            if (minTempString != string.Empty && maxTempString != string.Empty)
                            {
                                operatingTemp = string.Format("{0}~{1}", minTempString, maxTempString);
                            }
                            //multiple data sheet link
                            List<DataSheetURL> dataSheets = new List<DataSheetURL>();
                            if (item.datasheets != null)
                            {
                                foreach (var DataLinks in item.datasheets)
                                {
                                    DataSheetURL dataSheet = new DataSheetURL();
                                    dataSheet.SheetURL = DataLinks.url;
                                    dataSheets.Add(dataSheet);
                                }
                            }
                            /* Note:- As discussed on 09/05/2019 with dixitsir changed multiplier logic from packsize to translatedMinimumOrderQuality attribute 
                                    as it causing in calculation of unit measer */
                            //decimal Multiplier = 1;
                            //decimal.TryParse(Convert.ToString(item.packSize), out Multiplier);
                            string Uom = item.unitOfMeasure == null ? ConstantHelper.DefaultUom : item.unitOfMeasure;
                            var seller = new AutoPricingSeller()
                            {
                                InStockQuantity = InStockQuantity,
                                MinimumBuy = MinimumBuy,
                                ProductUrl = string.Format("{0}{1}", ConstantHelper.NewarkHomePageUrl, item.sku),
                                SellerName = SourceOfPricing.NewarkPartPricingService.GetEnumStringValue(),
                                Sku = item.sku,
                                HomePageUrl = ConstantHelper.NewarkHomePageUrl,
                                APILeadTime = APILeadTime,
                                Authorized_Reseller = true,
                                TimeStamp = DateTime.UtcNow,
                                Multiplier = multi == 0 ? MinimumBuy : multi,
                                Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                                Uom = Uom,
                                PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue(),
                                NoOfPosition = noOfPosition,
                                sizeDimension = sizeDimension,
                                heightText = heightText,
                                tolerance = tolerance,
                                minOperatingTemp = minTemp,
                                maxOperatingTemp = maxTemp,
                                feature = features,
                                Packaging = packaging,
                                dataSheetLink = item.datasheets != null ? item.datasheets[0].url : null,
                                mountingType = string.Empty,
                                connectorTypetext = string.Empty,
                                operatingTemp = operatingTemp,
                                powerRating = powerRating,
                                partValue = value,
                                partPackage = partPackage,
                                volatage = voltage,
                                noOfRows = noOfRows,
                                color = color,
                                DataSheets = dataSheets,
                                noOfPositionText = noOfPositionText,
                                noOfRowsText = noOfRowsText
                            };
                            seller.RoHS = item.rohsStatusCode;
                            seller.NCNR = CommonStatus.UNKNOWN.GetEnumStringValue();
                            seller.PricesByReqQty = new Dictionary<int, string>();
                            if (item.prices != null)
                            {
                                for (int j = 0; j < item.prices.Count; j++)
                                {
                                    int qtyrange = (int)item.prices[j].from.Value;
                                    string price = item.prices[j].cost.Value.ToString();
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
                            OctoPartPrices.Add(octoPartPrice);
                        }
                        int retint = _ICommonApiPricing.PricingDetail(OctoPartPrices, assyQtyList, lineItem, PricingAPINames.Newark.GetEnumStringValue(), pricingObj.isPurchaseApi);
                    }
                    else
                    {
                        int retint = _ICommonApiPricing.PricingDetail(OctoPartPrices, assyQtyList, lineItem, PricingAPINames.Newark.GetEnumStringValue(), pricingObj.isPurchaseApi);
                    }
                }
                else
                {
                    int status = (int)Status.SendRequest;
                    int pricingApiID = (int)PricingSupplierID.Newark;
                    if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == lineItem.consolidateID && x.rfqAssyID == lineItem.rfqAssemblyID && x.pricingSupplierID == pricingApiID
                    && x.status == status && x.isPurchaseApi == pricingObj.isPurchaseApi
                    ))
                    {
                        AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                        {
                            Status = (int)Status.Success,
                            ErrorMessage = string.Empty,
                            Message = string.Empty,
                            AssyID = lineItem.rfqAssemblyID,
                            ConsolidateID = lineItem.consolidateID,
                            PricingAPIName = PricingAPINames.Newark.GetEnumStringValue(),
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
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObj, newarkKeyServiceQueue);
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
                        supplier = PricingAPINames.Newark.GetEnumStringValue(),
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
        /// Purpose : call newark api and get pricing for partnumber
        /// </summary>
        /// <param name="baseurl">newark api url</param>
        /// <param name="apiKey">newark api key</param>
        /// <param name="_lineItem">rfq_lineitems </param>
        /// <param name="apiSleepTime">sleep time between api call</param>
        private NewarkResult CallApiGetResponse(string baseurl, string apiKey, PricingViewModel lineItem,
            string apiSleepTime, bool isCustom, string customerID, string secretKey, bool isPurchaseApi,string NewarkAPIRequestsLimit)
        {
            NewarkResult result = new NewarkResult();
            string octopartUrlBase = baseurl;
            string octopartUrlEndpoint = ConstantHelper.OctopartUrlEndpoint;
            var client = new RestClient(octopartUrlBase);
            var req = new RestRequest(octopartUrlEndpoint, Method.GET)
                    .AddParameter(ConstantHelper.ApiKeyParam, apiKey)
                    .AddParameter(ConstantHelper.Term, string.Format("manuPartNum:{0}", lineItem.mfgPN))
                    .AddParameter(ConstantHelper.StoreId, ConstantHelper.Newarkurl)
                    .AddParameter(ConstantHelper.ResponseFormat, ConstantHelper.ResponseJsonFormat)
                    .AddParameter(ConstantHelper.ResponseGroup, ConstantHelper.ResponsegroupSize);

            string _requestString = string.Empty;
            if (isCustom)
            {
                string strTimeStamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fff");
                // string strTimeDet = DateTime.UtcNow.ToString("yyyy-MM-ddThh:mm:ss.zzz");
                string strSignature = Helper.Helper.Encode(string.Format("{0}{1}", "searchByManufacturerPartNumber", strTimeStamp), secretKey);

                req.AddParameter("userInfo.signature", strSignature);
                req.AddParameter("userInfo.timestamp", strTimeStamp);
                req.AddParameter("userInfo.customerId", customerID);
            }
            req.Parameters.ForEach(x => _requestString += x.Name + " : " + x.Value + " ");
            var data = client.Execute(req).Content;
            System.Threading.Thread.Sleep(Convert.ToInt32(apiSleepTime));
            try
            {
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                    {
                        supplierID = (int)PricingSupplierID.Newark,
                        supplierName = PricingAPINames.Newark.ToString(),
                        appName = string.Empty,
                        currentDate = DateTime.UtcNow.Date,
                        isLimitExceed = false,
                        clientID = apiKey,
                        limitExceedText = "No",
                        callLimit= NewarkAPIRequestsLimit
                    };
                    _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    var response = JsonConvert.DeserializeObject<dynamic>(data);
                    /* Check for Fault in Response */
                    if (response.Fault != null)
                    {
                        try
                        {
                            #region API-Specific Errors
                            // http://partner.element14.com/docs/Product_Search_API_REST__Description#apierrors
                            //Error	    Description
                            //100001    Invalid Timestamp
                            //100002	Internal Failure. Please try after some time or contact the web service provider
                            //100003	Invalid Password
                            //100004    Invalid Customer Details
                            //100005	Signature Decryption Exception. Please contact the Web Service Admin
                            //100006	Invalid Timestamp Format
                            //100007	Invalid Locale
                            //200001	SKUs not valid
                            //200002	Could Not Query for the keyword
                            //200003	Could Not Query for the keyword
                            //200004	Manufacturer Part Number is not valid
                            #endregion

                            string exceptionCode = string.Empty;

                            if (response.Fault.Detail == null)
                            {
                                data = string.Format(ConstantHelper.ApiException,
                                    response, ConstantHelper.NewarkApiError);
                            }
                            else if (response.Fault.Detail.SearchServiceException != null)
                            {
                                exceptionCode = response.Fault.Detail.SearchServiceException.searchException.exceptionCode.Value;
                                data = string.Format(ConstantHelper.NewarkError,
                                    response.Fault.Detail.SearchServiceException.searchException.exceptionCode,
                                    response.Fault.Detail.SearchServiceException.searchException.exceptionString,
                                    ConstantHelper.NewarkApiError);
                            }
                            else if (response.Fault.Detail.searchException != null)
                            {
                                exceptionCode = response.Fault.Detail.searchException.exceptionCode.Value;
                                if (exceptionCode == NewarkApiError.QueryKeyword.GetEnumStringValue())
                                {
                                    return result;
                                }
                                data = string.Format(ConstantHelper.NewarkError,
                                   response.Fault.Detail.searchException.exceptionCode,
                                   response.Fault.Detail.searchException.exceptionString,
                                   ConstantHelper.NewarkApiError);
                            }

                            if (exceptionCode != NewarkApiError.SKUNOtValid.GetEnumStringValue() && exceptionCode != NewarkApiError.KeywordNotValid.GetEnumStringValue() && exceptionCode != NewarkApiError.QueryKeyword.GetEnumStringValue() && exceptionCode != NewarkApiError.MfgNotValid.GetEnumStringValue())
                                throw new Exception(data);
                            else
                            {
                                #region log error msg in AutoPricingLineItemStatus
                                string ErrroMsg = string.Format(ConstantHelper.LineItemException, data);
                                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrroMsg, string.Format("{0}", response.Fault), isPurchaseApi, lineItem.isStockUpdate);
                                #endregion
                            }
                        }

                        catch (Exception ex)
                        {
                            #region log error msg in AutoPricingLineItemStatus
                            string ErrroMsg = string.Format(data, response);
                            UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ex.Message, ErrroMsg, isPurchaseApi, lineItem.isStockUpdate);
                            ServiceErrorLog objErrorLog = new ServiceErrorLog()
                            {
                                consolidateID = lineItem.consolidateID,
                                rfqAssyID = lineItem.rfqAssemblyID,
                                error = ex.Message,
                                stackTrace = ex.StackTrace,
                                Source = ConstantHelper.Pricing,
                                supplier = PricingAPINames.Newark.GetEnumStringValue(),
                                mfgPN = lineItem.mfgPN
                            };
                            _IRabbitMQ.SendRequest(objErrorLog);
                            #endregion
                        }
                    }
                    else
                    {

                        result.resultParts = response;
                        result.assemblyId = lineItem.rfqAssemblyID;
                        result.consolidateID = lineItem.consolidateID;
                    }
                }
                else
                {
                    if (data.ToString() == ConstantHelper.NewarkLimit)
                    {
                        SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                        {
                            supplierID = (int)PricingSupplierID.Newark,
                            supplierName = PricingAPINames.Newark.ToString(),
                            appName = string.Empty,
                            currentDate = DateTime.UtcNow.Date,
                            isLimitExceed = true,
                            clientID = apiKey,
                            limitExceedText = "Yes",
                            callLimit= NewarkAPIRequestsLimit
                        };
                        _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    }
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, data, errorMsg, isPurchaseApi, lineItem.isStockUpdate);
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                string ErrroMsg = string.Format(ConstantHelper.LineItemException, data);
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrroMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    consolidateID = lineItem.consolidateID,
                    rfqAssyID = lineItem.rfqAssemblyID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.Newark.GetEnumStringValue(),
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
        private void UpdateAutoPricingStatusForError(long assemblyId, long consolidateID, string responseData, string errorData, bool isPurchaseApi, bool isStockUpdate)
        {
            #region log error msg in AutoPricingStatus
            string errorMsg = responseData;
            int pricingApiID = (int)PricingSupplierID.Newark;
            int status = (int)Status.SendRequest;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID
            && x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus objPricingStatus = new AutoPricingLineItemwiseStatus()
                {
                    PricingAPIName = PricingAPINames.Newark.GetEnumStringValue(),
                    Status = (int)Status.NotPricing,
                    ErrorMessage = errorData,
                    Message = errorMsg,
                    ConsolidateID = (int)consolidateID,
                    AssyID = (int)assemblyId,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID,
                    isStockUpdate = isStockUpdate
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
