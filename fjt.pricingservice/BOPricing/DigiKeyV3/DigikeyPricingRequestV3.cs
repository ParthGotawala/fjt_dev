using fjt.pricingservice.BOPricing.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using fjt.pricingservice.Model;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;
using fjt.pricingservice.Helper;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPricing.DigiKeyV3
{
    public class DigikeyPricingRequestV3 : IPricingRequest
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
        string digiKeyServiceQueue = ConfigurationManager.AppSettings["RabbitDigiKeyV3Queue"].ToString();
        public DigikeyPricingRequestV3(ICommonApiPricing ICommonApiPricing, IDigikeyPricingRepository IDigikeyPricingRepository,
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
        /// Purpose : get pricing for part and its alternate part from digikey api
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
                        var digiKeyConfiguration = _IsystemconfigrationsRepository.GetExternalApiConfig(ConstantHelper.DkSupplierID, ConstantHelper.FJTV3);
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
                                            IsCustomPrice = LineItem.IsCustomPrice,
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
                                        string customerID = LineItem.IsCustomPrice ? digiKeyConfiguration.specialPriceCustomerID : string.Empty;
                                        int response = SavePricingDetails(objPricing, digiKeyConfiguration.accessToken, digiKeyConfiguration.clientID, customerID, digiKeyConfiguration.perCallRecordCount != null ? digiKeyConfiguration.perCallRecordCount.Value : 3, LineItem, digiKeyConfiguration.dkCallLimit);
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
                    supplier = LineItem.PricingAPIName
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return;
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : get pricing list objects
        /// </summary>
        /// <param name="LineItem">rfq_lineitems</param>
        /// <param name="DigikeyAccessToken">string</param>
        /// <param name="DigiKeyClientId">string</param>
        private List<dynamic> CallApiGetResponse(PricingViewModel lineItem, string DigikeyAccessToken, string DigiKeyClientId, string CustomerID, int packagesCount, bool isPurchaseApi,int? dkCallLimit)
        {
            var resultParts = new List<object>();
            var data = _ICommonApiPricing.KeywordSearchV3(Helper.Helper.KeywordSearchApiV3, DigikeyAccessToken, DigiKeyClientId, lineItem.mfgPN, packagesCount, CustomerID);
            try
            {
                var errorMsg = string.Empty;
                if (_ICommonApiPricing.ValidateJSON(data))
                {
                    var isTokenExpired = false;
                    var isRateLimitExceeded = false;
                    var response = JsonConvert.DeserializeObject<dynamic>(data);

                    /* If Rate Limit exceeded then wait for 1 min and retry with the same request */
                    if (response != null &&
                        response.StatusCode != null)
                    {
                        System.Threading.Thread.Sleep(Helper.ConstantHelper.DigikeyTimeoutMiliSeconds);

                        data = _ICommonApiPricing.KeywordSearchV3(Helper.Helper.KeywordSearchApiV3, DigikeyAccessToken, DigiKeyClientId, lineItem.mfgPN, packagesCount, CustomerID);
                        response = JsonConvert.DeserializeObject<dynamic>(data);
                        if (response != null &&
                            response.StatusCode != null && response.StatusCode == ConstantHelper.TOOMANYREQUESTS)
                        {
                            isRateLimitExceeded = true;
                        }
                    }

                    if (response != null &&
                        response.StatusCode != null && response.StatusCode == ConstantHelper.UNAUTHORIZED)
                        isTokenExpired = true;

                    if (response == null || response.ResultCount == 0)
                        return resultParts;

                    if (!isTokenExpired && !isRateLimitExceeded)
                    {
                        response = _ICommonApiPricing.GetCspPricingsV3(Helper.Helper.KeywordPartSearchV3, DigikeyAccessToken, DigiKeyClientId, response, CustomerID, packagesCount);
                    }
                    SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                    {
                        supplierID = (int)PricingSupplierID.DigiKeyV3,
                        supplierName = PricingAPINames.DigiKey.ToString(),
                        appName = ConstantHelper.FJTV3,
                        currentDate = DateTime.UtcNow.Date,
                        isLimitExceed = isRateLimitExceeded,
                        clientID = DigiKeyClientId,
                        limitExceedText = isRateLimitExceeded ? "Yes" : "No",
                        callLimit=dkCallLimit==null?"": dkCallLimit.ToString()
                    };
                    _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                    DigiKeyResult digiKeyResult = new DigiKeyResult();
                    digiKeyResult.ApiResult = response;
                    digiKeyResult.IsTokenExpired = isTokenExpired;
                    digiKeyResult.IsRateLimitExceeded = isRateLimitExceeded;
                    digiKeyResult.consolidateID = lineItem.consolidateID;
                    digiKeyResult.AssemblyId = lineItem.rfqAssemblyID;
                    digiKeyResult.PartNoId = lineItem.mfgPNID != null ? lineItem.mfgPNID.Value : 0;
                    resultParts.Add(digiKeyResult);
                }
                else
                {
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, data, errorMsg, isPurchaseApi, lineItem.isStockUpdate);
                }
            }
            catch (Exception ex)
            {
                UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ex.Message, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), isPurchaseApi, lineItem.isStockUpdate);
            }
            return resultParts;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="objLineItem">rfq_lineitems</param>
        /// <param name="AccessToken">string</param>
        /// <param name="ClientID">string</param>
        private int SavePricingDetails(PricingViewModel lineItem, string AccessToken, string ClientID, string CustomerID, int recordCount, AutoPricingLineItemwiseStatus pricingObject,int? dkCallLimit)
        {
            try
            {
                bomStatus objbomStatuss = new bomStatus()
                {
                    appID = ConstantHelper.FJTV3,
                    Source = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(),
                    ClientID = ClientID,
                    userID = pricingObject.userID,
                    employeeID = pricingObject.employeeID
                };
                _ICommonApiPricing.sendExceedLimitNotification(objbomStatuss);
                var assyQtyList = _Irfq_assy_quantityRepository.GetRfqAssyQuantity(lineItem.rfqAssemblyID, pricingObject.isPurchaseApi);
                List<AutoPricingPrice> partPricesList = new List<AutoPricingPrice>();
                var response = CallApiGetResponse(lineItem, AccessToken, ClientID, CustomerID, recordCount, pricingObject.isPurchaseApi,dkCallLimit);
                if (response.Any() && response.FirstOrDefault().IsTokenExpired == true)
                {
                    var newAccessToken = string.Empty;
                    _ICommonApiPricing.RegenerateExternalAccessTokenV3(ConstantHelper.FJTV3, AccessToken, out newAccessToken);

                    /* If failed for first time then try it one more time */
                    if (AccessToken == newAccessToken)
                        _ICommonApiPricing.RegenerateExternalAccessTokenV3(ConstantHelper.FJTV3, AccessToken, out newAccessToken);
                    if (AccessToken == newAccessToken)
                    {
                        var apiErrorMoreInfo = response.FirstOrDefault().ApiResult.ErrorMessage;
                        int updateLineItem = _Irfq_lineitem_autopricingstatusRepository.UpdateAllLineItemwiseAutoPricing(apiErrorMoreInfo, ConstantHelper.TokenExpires, Helper.Helper.UpdateComponentSupplier.DigiKey.ToString(), lineItem.consolidateID);
                        UpdateAPIStatusWithAPIResponse(lineItem.rfqAssemblyID, lineItem.consolidateID, apiErrorMoreInfo, ConstantHelper.TokenExpires, pricingObject.isPurchaseApi);
                    }
                    else
                    {
                        AccessToken = newAccessToken;
                        response = CallApiGetResponse(lineItem, AccessToken, ClientID, CustomerID, recordCount, pricingObject.isPurchaseApi, dkCallLimit);
                    }
                }
                /* Check if Rate Limit Exceeded */
                if (response.Any() && response.FirstOrDefault().IsRateLimitExceeded == true)
                {
                    var apiErrorMoreInfo = response.FirstOrDefault().ApiResult.ErrorMessage;
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ConstantHelper.DigiKeyRateLimitExceeded, ConstantHelper.DigiKeyRateLimitExceeded, pricingObject.isPurchaseApi, lineItem.isStockUpdate);
                    // UpdateAPIStatusWithAPIResponse(lineItem.rfqAssemblyID, lineItem.consolidateID, apiErrorMoreInfo, ConstantHelper.DigiKeyRateLimitExceeded, lineItem.userID);
                    /* If circuit break point is reached then update the status of all remaining lineitmes * and break the loop  */
                    bomStatus objbomStatus = new bomStatus()
                    {
                        appID = ConstantHelper.FJTV3,
                        Source = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(),
                        ClientID = ClientID,
                        userID = pricingObject.userID,
                        employeeID = pricingObject.employeeID
                    };
                    _ICommonApiPricing.sendExceedLimitNotification(objbomStatus);

                }
                foreach (var result in response)
                {
                    AutoPricingPrice partPriceModel = new AutoPricingPrice();
                    partPriceModel.AssemblyId = lineItem.rfqAssemblyID;
                    partPriceModel.consolidateID = (long)result.consolidateID;
                    partPriceModel.PartNumberId = (int)result.PartNoId;
                    if (result.ApiResult != null && result.ApiResult.Parts != null)
                    {
                        foreach (var item in result.ApiResult.Parts)
                        {
                            if (item.StatusCode != null && item.StatusCode.Value == ConstantHelper.INVALID_ARG)
                            {
                                continue;
                            }
                            string manufacturername = string.Empty;
                            string manufacturerPartNumber = string.Empty;
                            try
                            {
                                manufacturername = item.Manufacturer.Value;//manufacturer name
                                manufacturerPartNumber = item.ManufacturerPartNumber.Value.ToUpper();//manufacturer number
                            }
                            catch (Exception e) { continue; }
                            ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(manufacturername, ConstantHelper.MFG);
                            if ((objMfg != null && objMfg.id != lineItem.mfgCodeID)) // Discussion with DP 22/07/2019 1:10 PM,if mfg not match with db then need to skip,if mfg not added in db then need to add in price
                                continue;

                         
                            if (manufacturerPartNumber.ToLower() != lineItem.mfgPN.ToLower())
                                continue;
                            string homePageUrl = ConstantHelper.DigikeyHomePageURL;
                            string PartStatus = item.ProductStatus;
                            DateTime? ltbDate = item.ProductStatus == ConstantHelper.LastTimeBy ? item.DateLastBuyChance : null;
                            string productUrl = item.ProductUrl;
                            if (!string.IsNullOrEmpty(productUrl) &&
                                    !productUrl.Contains(ConstantHelper.DigikeyURL))
                            {
                                productUrl = string.Format("{0}{1}", homePageUrl, productUrl);
                                productUrl = Regex.Replace(productUrl, ConstantHelper.OnlySingleBackSlashRegex, "/");
                            }

                            var octomanufacturer = new AutoPricingManufacturer()
                            {
                                Name = manufacturername,
                                HomePageUrl = homePageUrl,
                                PartNumber = manufacturerPartNumber,
                                PartStatus = PartStatus,
                                LTBDate = ltbDate,
                                supplier = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(),
                                mfgPNDescription = item.ProductDescription,
                            };
                            decimal InStockQuantity = 0;
                            decimal.TryParse(item.QuantityAvailable.ToString(), out InStockQuantity);
                            int? APILeadTime = null;
                            if (item.ManufacturerLeadWeeks != null)
                            {
                                string mfgrLeadTime = Convert.ToString(item.ManufacturerLeadWeeks);
                                int tempLeadTime = 0;

                                if (!string.IsNullOrEmpty(mfgrLeadTime) && (mfgrLeadTime.ToLower().Contains(ConstantHelper.Weeks) || mfgrLeadTime.Contains(ConstantHelper.Week)))
                                {
                                    if (int.TryParse(mfgrLeadTime.ToLower().Replace(ConstantHelper.Weeks, "").Replace(ConstantHelper.Week, "").Trim(), out tempLeadTime))
                                        APILeadTime = tempLeadTime;
                                }
                            }
                            string uom = ConstantHelper.DefaultUom;
                            int? NoOfPosition = null;
                            int? noOfRows = null;
                            int position = -1;
                            int rows = -1;
                            double? tempratureCoefficientValue = null, minOperatingTemp = null, maxOperatingTemp = null;
                            string Features, operatingTemp, sizeDimension, weight, height, mountingType, connectorType, partValue, partPackage, voltage, powerRating, pitch, pitchMating, tempratureCoefficient, color, imageURl, packaging, noOfPositionText, noOfRowsText;
                            Features = operatingTemp = sizeDimension = weight = partValue = height = mountingType = connectorType = partPackage = voltage = powerRating = pitch = pitchMating = tempratureCoefficient = color = imageURl = packaging = noOfPositionText = noOfRowsText = string.Empty;

                            DateTime? eolDate = null;
                            foreach (var param in item.Parameters)
                            {
                                if (param.Parameter == ConstantHelper.NoOfPosition)
                                {
                                    try
                                    {
                                        int.TryParse(param.Value.ToString(), out position);
                                    }
                                    catch (Exception e)
                                    {
                                        position = 0;
                                    }
                                    noOfPositionText = param.Value.ToString();
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKNoOfRows)
                                {
                                    try
                                    {
                                        int.TryParse(param.Value.ToString(), out rows);
                                    }
                                    catch (Exception e)
                                    {
                                        rows = 0;
                                    }
                                    noOfRowsText = param.Value.ToString();
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.Features)
                                {
                                    Features = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKPackaging)
                                {
                                    packaging = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.MountingType)
                                {
                                    mountingType = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.OperatingTemp || param.Parameter == ConstantHelper.OperatingTempJunc)
                                {
                                    if (param.Value.ToString().Length > 1)
                                    {
                                        operatingTemp = param.Value;
                                        //Get data from Operating Temperature Conversion Master
                                        //if found in master then directly taking that valies, no need to convert
                                        OperatingTemperatureConversionModel operatingTemperatureConversion = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetOperatingTemperatureConversion(param.Value.ToString());
                                        if (operatingTemperatureConversion != null)
                                        {
                                            minOperatingTemp = operatingTemperatureConversion.minTemperature;
                                            maxOperatingTemp = operatingTemperatureConversion.maxTemperature;
                                        }
                                        else
                                        {
                                            string[] temp = param.Value.ToString().Split('~');
                                            bool isFahrenheit = false;
                                            try
                                            {
                                                //minOperatingTemp = temp[0].Trim();
                                                //maxOperatingTemp = temp.Length > 1 ? temp[1].Trim() : temp[0].Trim();
                                                var minTemp = temp[0].Trim().Replace(ConstantHelper.TemperaturePlusMinusSign, "-");
                                                if (minTemp.Contains(ConstantHelper.TemperatureFahrenheitSign) ||
                                                (temp.Length > 1 && temp[1].Trim().Contains(ConstantHelper.TemperatureFahrenheitSign)))
                                                {
                                                    isFahrenheit = true;
                                                }
                                                if (minTemp.Contains(ConstantHelper.TemperatureMaxSign))
                                                {
                                                    minOperatingTemp = 0;
                                                    maxOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTemp, isFahrenheit);
                                                }
                                                else
                                                {
                                                    minOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(minTemp, isFahrenheit);
                                                    if (temp.Length > 1)
                                                    {
                                                        var maxTemp = temp[1].Trim().Replace(ConstantHelper.TemperaturePlusMinusSign, "");
                                                        maxOperatingTemp = _ICommonApiPricing.OperatingTemparatureRemoveNonNumericCharacters(maxTemp, isFahrenheit);
                                                    }
                                                    else
                                                    {
                                                        maxOperatingTemp = temp[0].Trim().Contains(ConstantHelper.TemperaturePlusMinusSign) ? (minOperatingTemp * -1) : minOperatingTemp;
                                                    }
                                                }
                                                //set null if any of both value is null, null due to non-numeric values in it
                                                if (minOperatingTemp == null || maxOperatingTemp == null)
                                                {
                                                    maxOperatingTemp = minOperatingTemp = null;
                                                }
                                            }
                                            catch (Exception) { minOperatingTemp = maxOperatingTemp = null; }
                                        }
                                    }
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.Thickness || param.Parameter == ConstantHelper.Height || param.Parameter == ConstantHelper.HeightMax)
                                {
                                    height = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.Weight)
                                {
                                    weight = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.Size)
                                {
                                    sizeDimension = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKTolerence)
                                {
                                    item.tolerance = item.tolerance != null ? item.tolerance.Value : param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKConnectorType || param.Parameter == ConstantHelper.DKContactType)
                                {
                                    if (param.Value != "-")
                                    {
                                        connectorType = param.Value;
                                    }
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKPackage)
                                {
                                    partPackage = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKVoltage)
                                {
                                    voltage = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKCapacitance || param.Parameter == ConstantHelper.DKInductance || param.Parameter == ConstantHelper.DKResistanceOhm || param.Parameter == ConstantHelper.DKResistance)
                                {
                                    partValue = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKPowerPerElement || param.Parameter == ConstantHelper.DKPowerRating)
                                {
                                    powerRating = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKPitch)
                                {
                                    pitch = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.DKPitchMating)
                                {
                                    pitchMating = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.color)
                                {
                                    color = param.Value;
                                    continue;
                                }
                                if (param.Parameter == ConstantHelper.TempratureCoefficient)
                                {
                                    tempratureCoefficient = param.Value;
                                    if (tempratureCoefficient.ToString().ToLower().Contains("ppm"))
                                    {
                                        string tempco = (tempratureCoefficient.ToString().Replace(ConstantHelper.TempratureCoefficientUnit, "").Replace("±", "").Replace("0/ +", "").Replace("0/ -", ""));
                                        try { tempratureCoefficientValue = double.Parse(tempco); } catch (Exception e) { tempratureCoefficientValue = null; }
                                    }
                                    continue;
                                }
                            }
                            List<ComponentImages> Images = new List<ComponentImages>();
                            List<DataSheetURL> Sheets = new List<DataSheetURL>();
                            //if (item.PrimaryPhoto != null)
                            //{
                            //    ComponentImages Image = new ComponentImages();
                            //    Image.imageURL = item.PrimaryPhoto;
                            //    Images.Add(Image);
                            //}
                            //if (item.PrimaryDatasheet != null)
                            //{
                            //    DataSheetURL Sheet = new DataSheetURL();
                            //    Sheet.SheetURL = item.PrimaryDatasheet;
                            //    Sheets.Add(Sheet);
                            //}
                            if (item.MediaLinks != null)
                            {
                                foreach (var param in item.MediaLinks)
                                {
                                    if (param.MediaType.ToString().Trim() == ConstantHelper.ProductPhoto || param.MediaType.ToString().Trim() == ConstantHelper.Catalog)
                                    {
                                        ComponentImages Image = new ComponentImages();
                                        Image.imageURL = param.Url;
                                        Images.Add(Image);
                                        break;
                                    }
                                    if (param.MediaType.ToString().Trim() == ConstantHelper.DataSheets)
                                    {
                                        DataSheetURL Sheet = new DataSheetURL();
                                        Sheet.SheetURL = param.Url;
                                        Sheets.Add(Sheet);
                                        break;
                                    }
                                    if (param.MediaType.ToString().Contains(ConstantHelper.EOL))
                                    {
                                        if (param.Title.ToString().ToLower().Contains("eol"))
                                        {
                                            try { 
                                            string[] date = param.Title.ToString().Split(' ');
                                            string eoldate = date[date.Length - 1].ToString();
                                            eolDate = DateTime.Parse(eoldate);
                                            }catch(Exception ex) { eolDate = null; }
                                            break;
                                        }
                                    }
                                }
                            }
                            imageURl = item.PrimaryPhoto;
                            var seller = new AutoPricingSeller()
                            {
                                InStockQuantity = InStockQuantity,
                                MinimumBuy = 0,
                                ProductUrl = productUrl,
                                SellerName = SourceOfPricing.DigiKeyPricingService.GetEnumStringValue(),
                                SellerUid = "",
                                Sku = item.DigiKeyPartNumber.Value,
                                HomePageUrl = homePageUrl,
                                APILeadTime = APILeadTime,
                                Authorized_Reseller = true,
                                TimeStamp = DateTime.UtcNow,
                                Multiplier = 1,
                                Reeling = CommonStatus.UNKNOWN.GetEnumStringValue(),
                                Uom = uom,
                                NoOfPosition = position > -1 ? position : NoOfPosition,
                                feature = Features,
                                categoryText = (item.LimitedTaxonomy != null) && (item.LimitedTaxonomy.Children != null) ? item.LimitedTaxonomy.Children[0].Value : ConstantHelper.TBD, //item.Category.Text,
                                tolerance = item.tolerance != null ? item.tolerance.Value : string.Empty,
                                minOperatingTemp = minOperatingTemp,
                                maxOperatingTemp = maxOperatingTemp,
                                dataSheetLink = item.PrimaryDatasheet,
                                partValue = partValue,
                                partPackage = partPackage,
                                operatingTemp = operatingTemp,
                                sizeDimension = sizeDimension,
                                volatage = voltage,
                                noOfRows = rows > -1 ? rows : noOfRows,
                                pitch = pitch,
                                pitchMating = pitchMating,
                                powerRating = powerRating,
                                weight = weight,
                                heightText = height,
                                eolDate = eolDate,
                                mountingType = mountingType,
                                connectorTypetext = connectorType,
                                tempratureCoefficient = tempratureCoefficient,
                                tempratureCoefficientValue = tempratureCoefficientValue,
                                color = color,
                                imageURL = imageURl,
                                ComponentImages = Images,
                                DataSheets = Sheets,
                                noOfRowsText = noOfRowsText,
                                noOfPositionText = noOfPositionText,
                                detailDescription = item.DetailedDescription,
                                AdditionalValueFee = item.AdditionalValueFee
                            };
                            seller.RoHS = item.RoHSStatus;
                            seller.NCNR = CommonStatus.UNKNOWN.GetEnumStringValue();

                            if (item.Packaging != null)
                            {
                                seller.Packaging = packaging ?? item.Packaging.Value;
                                if (seller.Packaging.Length > 0)
                                    seller.Reeling = seller.Packaging == ReelingValues.DigiKeyReelText.GetEnumStringValue() ? CommonStatus.YES.GetEnumStringValue() : CommonStatus.NO.GetEnumStringValue();
                            }
                            seller.PricesByReqQty = new Dictionary<int, string>();
                            if (lineItem.IsCustomPrice && (item.MyPricing != null && item.MyPricing.Count > 0)) //as per discuss with DP if custom price selected and there is not custom price then need to get standard price
                            {
                                seller.PricingType = Helper.Helper.PriceStatus.Special.GetEnumStringValue();
                                for (int j = 0; j < item.MyPricing.Count; j++)
                                {
                                    int qtyrange = (int)item.MyPricing[j].BreakQuantity;
                                    string price = item.MyPricing[j].UnitPrice.ToString();
                                    if (!seller.PricesByReqQty.ContainsKey(qtyrange))
                                        seller.PricesByReqQty.Add(qtyrange, price);
                                }
                            }
                            else if (!lineItem.IsCustomPrice || (lineItem.IsCustomPrice && (item.MyPricing == null || item.MyPricing.Count == 0)))
                            {
                                if (item.StandardPricing != null && item.StandardPricing.Count > 0)
                                {
                                    seller.PricingType = Helper.Helper.PriceStatus.Standard.GetEnumStringValue();
                                    for (int j = 0; j < item.StandardPricing.Count; j++)
                                    {
                                        int qtyrange = (int)item.StandardPricing[j].BreakQuantity;
                                        string price = item.StandardPricing[j].UnitPrice.ToString();
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
                        }
                        partPricesList.Add(partPriceModel);
                    }
                }
                int retint = _ICommonApiPricing.PricingDetail(partPricesList, assyQtyList, lineItem, PricingAPINames.DigiKey.GetEnumStringValue(), pricingObject.isPurchaseApi);
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus

                if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                {
                    _IRabbitMQSendMessageRequestHandler.SendRequest(pricingObject, digiKeyServiceQueue);
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
                        supplier = PricingAPINames.DigiKey.GetEnumStringValue(),
                        mfgPN = lineItem.mfgPN
                    };
                    string ErrorMsg = string.Format(ex.Message, ex.InnerException, ex.StackTrace);
                    if (ex.Message.Contains(ConstantHelper.DigiKeyError))
                        ErrorMsg = ex.Message;
                    UpdateAutoPricingStatusForError(lineItem.rfqAssemblyID, lineItem.consolidateID, ErrorMsg, string.Format("{0} <br/> {1} <br/> {2}", ex.Message, ex.InnerException, ex.StackTrace), pricingObject.isPurchaseApi, lineItem.isStockUpdate);
                    _IRabbitMQ.SendRequest(objErrorLog);
                }

                #endregion
            }
            return 1;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : save status for pricing after success
        /// </summary>
        /// <param name="assyID">int</param>
        /// <param name="lineitemID">int</param>
        /// <param name="moreInformation">dynamic</param>
        /// <param name="digiKeyTokenExpiredErrorMessage">string</param>
        private void UpdateAPIStatusWithAPIResponse(int assyID, int consolidateID, dynamic moreInformation, string digiKeyTokenExpiredErrorMessage, bool isPurchaseApi)
        {
            int pricingApiID = (int)PricingSupplierID.DigiKeyV3;
            int status = (int)Status.SendRequest;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID
            && x.rfqAssyID == assyID && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
            ))
            {
                AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                {
                    Status = (int)Status.NotPricing,
                    Message = digiKeyTokenExpiredErrorMessage,
                    ErrorMessage = string.Empty,
                    PricingAPIName = PricingAPINames.DigiKey.ToString(),
                    AssyID = assyID,
                    ConsolidateID = consolidateID,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == assyID
                && x.pricingSupplierID == pricingApiID && x.status == status && x.isPurchaseApi == isPurchaseApi
                ))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, digiKeyTokenExpiredErrorMessage, digiKeyTokenExpiredErrorMessage, assyID, pricingApiID, consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforDigikeyErrorStatus(statusModel);
                }
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : save status for pricing after getting error
        /// </summary>
        /// <param name="assemblyId">long</param>
        /// <param name="lineItemId">long</param>
        /// <param name="responseData">string</param>
        /// <param name="errorData">string</param>
        private void UpdateAutoPricingStatusForError(long assemblyId, long consolidateID, string responseData, string errorData, bool isPurchaseApi, bool isStockUpdate)
        {
            #region log error msg in AutoPricingStatus
            int pricingApiID = (int)PricingSupplierID.DigiKeyV3;
            int status = (int)Status.SendRequest;
            if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == consolidateID && x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID
            && x.status == status && x.isPurchaseApi == isPurchaseApi))
            {
                AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                {
                    Status = (int)Status.NotPricing,
                    Message = responseData,
                    ErrorMessage = errorData,
                    PricingAPIName = PricingAPINames.DigiKey.ToString(),
                    AssyID = (int)assemblyId,
                    ConsolidateID = (int)consolidateID,
                    isPurchaseApi = isPurchaseApi,
                    supplierID = pricingApiID,
                    isStockUpdate = isStockUpdate
                };
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == assemblyId && x.pricingSupplierID == pricingApiID
                && x.status == status && x.isPurchaseApi == isPurchaseApi))
                {
                    int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.NotPricing, responseData, errorData, assemblyId, pricingApiID, consolidateID, status, isPurchaseApi);
                    _ICommonApiPricing.ApiCallforErrorStatus(statusModel);
                }
            }
            #endregion
        }
    }
}
