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
using System.Text.RegularExpressions;

namespace fjt.pricingservice.BOPartUpdate.DigikeyV3
{
    public class DigikeyV3PartUpdateHandler : IDigikeyV3PartUpdateHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        private readonly IRabbitMQ _IRabbitMQ;
        string DigikeyV3QueueName = ConfigurationManager.AppSettings["BOMCleanDKV3Queue"].ToString();
        string DigikeyV3ScheduleQueueName = ConfigurationManager.AppSettings["PartCleanDKV3Queue"].ToString();
        // string nextAPIQueueName = string.Empty;
        // string nextAPIName = string.Empty;
        bool isIssue = false;
        List<ManufacturerViewModel> mfgList = new List<ManufacturerViewModel>();
        List<ComponentModel> compList = new List<ComponentModel>();
        public DigikeyV3PartUpdateHandler(ICommonApiPricing ICommonApiPricing,
            IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
            IDigikeyPricingRepository IDigikeyPricingRepository,
            IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler,
            IRabbitMQ IRabbitMQ)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
            _IRabbitMQ = IRabbitMQ;
        }
        public int UpdateInsertPart(ExternalPartVerificationRequestLog Item)
        {
            isIssue = false;
            bool partStatus = false;
            Item.supplier = UpdateComponentSupplier.DigiKey.GetEnumStringValue();
            if (Item.cleanType == CleanType.Part.ToString())
            {
                partStatus = true;
                if (!string.IsNullOrEmpty(Item.transactionID) && Item.type == ConstantHelper.FJTSchedulePartUpdateV3)
                {
                    partStatus = _IsystemconfigrationsRepository.getStatus(Item.partID.Value, Item.transactionID, Item.supplier);
                }
            }
            else
                partStatus = _IsystemconfigrationsRepository.getStatus(Item.partID.Value, Item.transactionID, Item.supplier);
            if (partStatus)
            {
                checkNextSupplierDetail(Item);
                var digiKeyConfiguration = _IsystemconfigrationsRepository.GetExternalApiConfig(ConstantHelper.DkSupplierID, Item.cleanType == CleanType.Part.ToString() ? ConstantHelper.FJTSchedulePartUpdateV3 : ConstantHelper.FJTV3CleanBOM);
                var componentList = _IDigikeyPricingRepository.getComponentList(Item.partNumber.ToUpper(), UpdateComponentSupplier.DigiKey.GetEnumStringValue());
                try
                {
                    if (componentList.Count() > 0)
                        return SavePartFromMongoDB(componentList, Item);
                    else
                        return SavePartDetail(Item.partNumber, digiKeyConfiguration.accessToken, digiKeyConfiguration.clientID, Item, digiKeyConfiguration.perCallRecordCount, digiKeyConfiguration.dkCallLimit);
                }
                catch (Exception ex)
                {
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Item.cleanType,
                        supplier = PricingAPINames.DigiKeyV3.GetEnumStringValue(),
                        mfgPN = Item.partNumber,
                        timeStamp = DateTime.UtcNow
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);
                    Item.errorMsg = ex.Message;
                    SaveException(Item);
                }
            }
            return 1;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save into database
        /// </summary>
        /// <param name="objLineItem">rfq_lineitems</param>
        /// <param name="AccessToken">string</param>
        /// <param name="ClientID">string</param>
        public int SavePartDetail(string mfgPN, string AccessToken, string ClientID, ExternalPartVerificationRequestLog objExtVerification, int? recordCount, int? dkCallLimit)
        {
            try
            {
                if (objExtVerification.type == ConstantHelper.FJTSchedulePartUpdateV3)
                {
                    checkNextSupplierDetail(objExtVerification);
                }
                List<bomStatus> bomStatusList = new List<bomStatus>();
                var response = CallApiGetResponse(mfgPN, AccessToken, ClientID, recordCount, objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3, dkCallLimit);
                if (response.IsTokenExpired == true && (objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID)))
                {
                    var newAccessToken = string.Empty;
                    _ICommonApiPricing.RegenerateExternalAccessTokenV3(objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3, AccessToken, out newAccessToken);

                    /* If failed for first time then try it one more time */
                    if (AccessToken == newAccessToken)
                        _ICommonApiPricing.RegenerateExternalAccessTokenV3(objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3, AccessToken, out newAccessToken);
                    if (AccessToken == newAccessToken)
                    {
                        var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(objExtVerification.supplier, "DIST");
                        bomStatus objbomStatus = new bomStatus()
                        {
                            appID = objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3,
                            partID = objExtVerification.partID,
                            errorType = ErrorType.AUTHFAILED.ToString(),
                            errorMsg = response.ApiResult.ErrorMessage,
                            Source = objExtVerification.supplier,
                            ClientID = ClientID,
                            SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                            transactionID = objExtVerification.transactionID
                        };
                        bomStatusList.Add(objbomStatus);
                        int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
                        if (objExtVerification.cleanType == CleanType.Part.ToString())
                        {
                            if (objExtVerification.type == ConstantHelper.FJTSchedulePartUpdateV3 && !string.IsNullOrEmpty(objExtVerification.transactionID))
                            {
                                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateAllComponentsParts(objExtVerification.transactionID, Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue());
                                _ICommonApiPricing.ApiCallforExternalPartUpdate(objExtVerification);
                                return 1;
                            }
                            objExtVerification.isAlreadySaved = false;
                            objExtVerification.isAlreadyFound = true;
                            var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(objExtVerification.transactionID, 1, objExtVerification.supplier, objbomStatus.errorMsg, objExtVerification.partNumber, objExtVerification.type);
                            if (remainApi.apiStatus)
                            {
                                objExtVerification.externalIssue = remainApi.bomStatus;
                                /*Changes done for hot fix to check first DK tocken if expired then no need to call other APIs discussed with DP on 27-03-2020
                                 chnages done by ashish directed by champak*/
                                _ICommonApiPricing.ApiCallforExternalPartUpdate(objExtVerification);
                                return 1;
                            }
                        }
                        else
                        {
                            var objStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateAllBOMParts(objExtVerification.partID, objExtVerification.supplier, objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3);
                            if (objStatus.apiStatus)
                            {
                                objExtVerification.status = false;
                                _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(objExtVerification);
                                /*Changes done for hot fix to check first DK tocken if expired then no need to call other APIs discussed with DP on 27-03-2020
                                 chnages done by ashish directed by champak*/
                                return 1;
                            }
                        }
                        //add new entry as table that token expire and all mfg pn
                        //int updateLineItem = _Irfq_lineitem_autopricingstatusRepository.UpdateAllLineItemwiseAutoPricing(apiErrorMoreInfo, ConstantHelper.TokenExpires, UpdateComponentSupplier.DigiKey.ToString(), lineItem.userID, lineItem.consolidateID);
                        //UpdateAPIStatusWithAPIResponse(lineItem.rfqAssemblyID, lineItem.consolidateID, apiErrorMoreInfo, ConstantHelper.TokenExpires, lineItem.userID);
                    }
                    else
                    {
                        AccessToken = newAccessToken;
                        response = CallApiGetResponse(mfgPN, AccessToken, ClientID, recordCount, objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3, dkCallLimit);
                    }
                }
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.DigiKeyV3,
                    supplierName = PricingAPINames.DigiKey.ToString(),
                    appName = objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = response.IsRateLimitExceeded,
                    clientID = ClientID,
                    limitExceedText = response.IsRateLimitExceeded ? "Yes" : "No",
                    callLimit = dkCallLimit == null ? "" : dkCallLimit.ToString()
                };
                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
                /* Check if Rate Limit Exceeded */
                if (response.IsRateLimitExceeded == true && (objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID)))
                {
                    //rate limit exceed so update managed external part table and send entry to next API
                    //give error message limit exceed
                    var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(objExtVerification.supplier, "DIST");
                    var apiErrorMoreInfo = response.ApiResult.ErrorMessage;
                    bomStatus objbomStatus = new bomStatus()
                    {
                        appID = objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3,
                        partID = objExtVerification.partID,
                        errorType = ErrorType.UNKNOWN.ToString(),
                        errorMsg = response.ApiResult.ErrorMessage,
                        Source = objExtVerification.supplier,
                        ClientID = ClientID,
                        SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                        transactionID = objExtVerification.transactionID,
                        userID = objExtVerification.userID,
                        employeeID = objExtVerification.employeeID
                    };
                    bomStatusList.Add(objbomStatus);
                    int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
                    _ICommonApiPricing.sendExceedLimitNotification(objbomStatus);
                    if (objExtVerification.cleanType == CleanType.Part.ToString())
                    {
                        objExtVerification.isAlreadySaved = false;
                        objExtVerification.isAlreadyFound = true;
                        var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(objExtVerification.transactionID, 1, objExtVerification.supplier, objbomStatus.errorMsg, objExtVerification.partNumber, objExtVerification.type);
                        if (remainApi.apiStatus)
                        {
                            objExtVerification.externalIssue = remainApi.bomStatus;
                            //_ICommonApiPricing.ApiCallforExternalPartUpdate(objExtVerification);
                        }
                        return callToNextApi(objExtVerification, new List<ComponentModel>(), false, true);
                    }
                    else
                    {
                        var objStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateAllBOMParts(objExtVerification.partID, objExtVerification.supplier, objExtVerification.type != null ? objExtVerification.type : ConstantHelper.FJTSchedulePartUpdateV3);
                        if (objStatus.apiStatus)
                        {
                            objExtVerification.status = false;
                            _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(objExtVerification);
                        }
                    }
                }
                bool isDiscontinue = false;
                List<ComponentModel> componentList = new List<ComponentModel>();
                if (response.ApiResult != null && response.ApiResult.Parts != null)
                {
                    foreach (var item in response.ApiResult.Parts)
                    {
                        if (item.StatusCode != null && item.StatusCode.Value == ConstantHelper.INVALID_ARG)
                        {
                            continue;
                        }
                        ComponentModel objComponentModel = new ComponentModel();
                        try
                        {
                            objComponentModel.manufacturerName = item.Manufacturer.Value;//manufacturer name
                            objComponentModel.mfgPN = item.ManufacturerPartNumber.Value.ToUpper();//manufacturer number
                        }
                        catch (Exception e) { continue; }
                        objComponentModel.partStatusText = item.ProductStatus; //part status
                        if (string.IsNullOrEmpty(objComponentModel.partStatusText))
                            objComponentModel.partStatusText = ConstantHelper.Active;
                        objComponentModel.ltbDate = item.ProductStatus == ConstantHelper.LastTimeBy ? item.DateLastBuyChance : null; //last time buy data
                        objComponentModel.mfgPnDescription = item.ProductDescription; // part number description
                        objComponentModel.detailDescription = item.DetailedDescription; // part number detail description
                        objComponentModel.supplierName = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(); //supplier name from which details get
                        objComponentModel.distPN = item.DigiKeyPartNumber; // distributor part number
                        if (objComponentModel.mfgPN.ToUpper() != mfgPN.ToUpper() && objComponentModel.distPN.ToUpper() != mfgPN.ToUpper())
                            continue;
                        objComponentModel.uomText = ConstantHelper.DefaultUom;//default uom each
                        string homePageUrl = ConstantHelper.DigikeyHomePageURL;
                        string productUrl = item.ProductUrl;
                        if (!string.IsNullOrEmpty(productUrl) &&
                                !productUrl.Contains(ConstantHelper.DigikeyURL))
                        {
                            productUrl = string.Format("{0}{1}", homePageUrl, productUrl);
                            productUrl = Regex.Replace(productUrl, ConstantHelper.OnlySingleBackSlashRegex, "/");
                        }
                        objComponentModel.productUrl = productUrl;

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

                        int? NoOfPosition = null;
                        int position = -1;
                        int? noOfRows = null;
                        int rows = -1;
                        double? tempratureCoefficientValue = null, minOperatingTemp = null, maxOperatingTemp = null;
                        string packaging, tempCoefficientunit, Features, operatingTemp, sizeDimension, weight, height, mountingType, connectorType, partValue, partPackage, voltage, powerRating, pitch, pitchMating, tempratureCoefficient, color, imageURl, noOfPositionText, noOfRowsText;
                        packaging = tempCoefficientunit = Features = operatingTemp = sizeDimension = weight = partValue = height = mountingType = connectorType = partPackage = voltage = powerRating = pitch = pitchMating = tempratureCoefficient = color = imageURl = noOfPositionText = noOfRowsText = string.Empty;

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
                            if (param.Parameter == ConstantHelper.DKPackaging)
                            {
                                packaging = param.Value;
                                continue;
                            }
                            if (param.Parameter == ConstantHelper.Features)
                            {
                                Features = param.Value;
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

                                            if (minTemp.ToUpper().Contains(ConstantHelper.TemperatureMaxSign))
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
                                    tempCoefficientunit = "ppm/°C";
                                    string tempco = (tempratureCoefficient.ToString().Replace(ConstantHelper.TempratureCoefficientUnit, "").Replace("±", "").Replace("0/ +", "").Replace("0/ -", ""));
                                    try { tempratureCoefficientValue = double.Parse(tempco); } catch (Exception e) { tempratureCoefficientValue = null; }
                                }
                                continue;
                            }
                        }
                        if (position > -1)
                            NoOfPosition = position;
                        if (rows > -1)
                            noOfRows = rows;
                        List<ComponentImages> Images = new List<ComponentImages>();
                        List<DataSheetURL> Sheets = new List<DataSheetURL>();

                        if (item.PrimaryPhoto != null)
                        {
                            ComponentImages Image = new ComponentImages();
                            Image.imageURL = item.PrimaryPhoto;
                            Images.Add(Image);
                        }
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
                                    if (!Images.Any(a => a.imageURL == Image.imageURL))
                                    {
                                        Images.Add(Image);
                                    }
                                    continue;
                                }
                                if (param.MediaType.ToString().Trim() == ConstantHelper.DataSheets)
                                {
                                    DataSheetURL Sheet = new DataSheetURL();
                                    Sheet.SheetURL = param.Url;
                                    Sheets.Add(Sheet);
                                    continue;
                                }
                                if (param.MediaType.ToString().Contains(ConstantHelper.EOL))
                                {
                                    if (param.Title.ToString().ToLower().Contains("eol"))
                                    {
                                        try
                                        {
                                            string[] date = param.Title.ToString().Split(' ');
                                            string eoldate = date[date.Length - 1].ToString();
                                            eolDate = DateTime.Parse(eoldate);
                                            continue;
                                        }
                                        catch (Exception ex)
                                        {
                                            eolDate = null;
                                        }
                                    }
                                }
                            }
                        }

                        objComponentModel.minOperatingTemp = minOperatingTemp; // minimum temp
                        objComponentModel.maxOperatingTemp = maxOperatingTemp; // maximum temp
                        objComponentModel.tolerance = item.tolerance != null ? item.tolerance.Value : string.Empty; //tolerance
                        objComponentModel.feature = Features; //features
                        objComponentModel.functionalCategoryText = (item.LimitedTaxonomy != null) && (item.LimitedTaxonomy.Children != null) ? item.LimitedTaxonomy.Children[0].Value : ConstantHelper.TBD; //functional category
                        objComponentModel.dataSheetLink = item.PrimaryDatasheet; // data-sheet link 
                        objComponentModel.noOfPosition = NoOfPosition; // no of position
                        objComponentModel.noOfRows = noOfRows; // no of rows
                        objComponentModel.operatingTemp = operatingTemp; //full temp string
                        objComponentModel.color = color; // color
                        objComponentModel.partPackage = partPackage; // package of part 
                        objComponentModel.packaging = packaging != string.Empty ? packaging : item.Packaging.Value; //packaging type need to set as in controller pricing
                        objComponentModel.connectorTypeText = connectorType; // connector type
                        objComponentModel.mountingType = mountingType == string.Empty ? ConstantHelper.TBD : mountingType; // mounting type text
                        objComponentModel.eolDate = eolDate; //end of life date
                        objComponentModel.weight = weight;
                        objComponentModel.heightText = height;
                        objComponentModel.pitch = pitch;
                        objComponentModel.pitchMating = pitchMating;
                        objComponentModel.powerRating = powerRating;
                        objComponentModel.sizeDimension = sizeDimension;
                        objComponentModel.voltage = voltage;
                        objComponentModel.temperatureCoefficient = tempratureCoefficient;
                        objComponentModel.temperatureCoefficientValue = tempratureCoefficientValue;
                        objComponentModel.temperatureCoefficientUnit = tempCoefficientunit;
                        objComponentModel.unit = 1;
                        objComponentModel.ComponentImages = Images;
                        objComponentModel.DataSheets = Sheets;
                        objComponentModel.value = partValue;
                        objComponentModel.imageURL = item.PrimaryPhoto; //primary image of part
                        objComponentModel.rohsText = item.RoHSStatus;
                        objComponentModel.packageQty = item.MinimumOrderQuantity;
                        objComponentModel.minimum = item.MinimumOrderQuantity;
                        objComponentModel.mult = item.MinimumOrderQuantity;
                        objComponentModel.leadTime = APILeadTime;
                        objComponentModel.category = ConstantHelper.Component_Category;
                        objComponentModel.UnitPrice = item.UnitPrice;
                        objComponentModel.noOfPositionText = noOfPositionText;
                        objComponentModel.noOfRowsText = noOfRowsText;
                        objComponentModel.savePriceSupplier = PricingAPINames.DigiKey.GetEnumStringValue();

                        Dictionary<int, string> PricesByReqQty = new Dictionary<int, string>();
                        if (item.StandardPricing != null && item.StandardPricing.Count > 0)
                        {
                            for (int j = 0; j < item.StandardPricing.Count; j++)
                            {
                                int qtyrange = (int)item.StandardPricing[j].BreakQuantity;
                                string price = item.StandardPricing[j].UnitPrice.ToString();
                                if (!PricesByReqQty.ContainsKey(qtyrange))
                                    PricesByReqQty.Add(qtyrange, price);
                                else if (PricesByReqQty.ContainsKey(qtyrange))
                                {
                                    PricesByReqQty[qtyrange] = price;
                                }
                            }
                        }
                        objComponentModel.PricesByReqQty = PricesByReqQty;

                        var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(objComponentModel, objComponentModel.mfgPN.ToUpper(), objExtVerification);
                        objComponentModel = objVerification.ComponentModel;
                        componentList.Add(objComponentModel);
                        if ((objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID)) && !objExtVerification.isPartUpdate)
                        {
                            if (objVerification.bomStatusList.Count() > 0)
                            {
                                isIssue = true;
                                _IDigikeyPricingRepository.saveComponent(objComponentModel);
                                int result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
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
                                    //    _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.DigiKey.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
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
                                _ICommonApiPricing.savePriceBreak(objComponentModel.PricesByReqQty, objPricingModel, PricingAPINames.DigiKey.GetEnumStringValue(), objComponentModel.packaging, objComponentModel.distPN, false, objComponentModel.leadTime, objComponentModel.packagingID);
                            }
                        }
                    }
                }
                if ((objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID)) && (componentList.Count() > 0 && !isDiscontinue))
                {
                    objExtVerification.isAlreadySaved = isIssue ? false : true;
                    objExtVerification.isAlreadyFound = true;
                    //if (!string.IsNullOrEmpty(nextAPIName))
                    //{
                    //    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(objExtVerification.partID, nextAPIName, objExtVerification.type, objExtVerification.partNumber, objExtVerification.transactionID);
                    //}
                    if (objExtVerification.cleanType == CleanType.Part.ToString())
                    {
                        var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(objExtVerification.transactionID, isIssue ? 1 : 2, objExtVerification.supplier, null, objExtVerification.partNumber, objExtVerification.type);
                        if (remainApi.apiStatus)
                        {
                            objExtVerification.externalIssue = objExtVerification.isPartUpdate ? false : remainApi.bomStatus;
                            // return callToNextApi(objExtVerification, componentList);
                            // _ICommonApiPricing.ApiCallforExternalPartUpdate(objExtVerification);
                        }
                    }
                    else
                    {
                        var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(mfgPN, isIssue ? 1 : 2, objExtVerification.supplier, objExtVerification.type, objExtVerification.partID.Value, null);
                        if (remainApi.apiStatus)
                        {
                            objExtVerification.externalIssue = remainApi.extStatusApi;
                            objExtVerification.status = remainApi.bomStatus;
                            // _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(objExtVerification);
                            //call for web socket
                        }
                        // _ICommonApiPricing.ApiCallforBomProgressStatus(objExtVerification); // added for bom progress status
                    }
                    return callToNextApi(objExtVerification, new List<ComponentModel>(), false, false);

                }
                if ((objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID)) && (componentList.Count() == 0 || (componentList.Count() > 0 && isDiscontinue)))
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalLog(objExtVerification);
                    return callToNextApi(objExtVerification, componentList, true, true);
                }
            }
            catch (Exception ex)
            {
                #region log error msg in AutoPricingStatus
                if (objExtVerification.type != ConstantHelper.FJTSchedulePartUpdateV3 || !string.IsNullOrEmpty(objExtVerification.transactionID))
                {
                    if (ex.Message == ConstantHelper.ErrorException || ex.Message == ConstantHelper.DuplicateSerial || ex.Message.ToLower().Contains(ConstantHelper.DuplicateEntry))
                    {
                        _IRabbitMQSendMessageRequestHandler.SendRequest(objExtVerification, objExtVerification.cleanType == CleanType.Part.ToString() ? DigikeyV3ScheduleQueueName : DigikeyV3QueueName);
                    }
                    else
                    {
                        objExtVerification.errorMsg = ex.Message;
                        SaveException(objExtVerification);
                        ServiceErrorLog objErrorLog = new ServiceErrorLog()
                        {
                            error = ex.Message,
                            stackTrace = ex.StackTrace,
                            Source = objExtVerification.cleanType,
                            supplier = PricingAPINames.DigiKeyV3.GetEnumStringValue(),
                            mfgPN = mfgPN,
                            timeStamp = DateTime.UtcNow
                        };
                        _IRabbitMQ.SendRequest(objErrorLog);

                    }
                }
                #endregion
            }
            return 1;
        }

        private DigiKeyResult CallApiGetResponse(string mfgPN, string DigikeyAccessToken, string DigiKeyClientId, int? recordCount, string appName, int? callLimit)
        {

            var data = _ICommonApiPricing.KeywordSearchV3(KeywordSearchApiV3, DigikeyAccessToken, DigiKeyClientId, mfgPN, recordCount.Value, null);
            DigiKeyResult digiKeyResult = new DigiKeyResult();
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

                        data = _ICommonApiPricing.KeywordSearchV3(KeywordSearchApiV3, DigikeyAccessToken, DigiKeyClientId, mfgPN, recordCount.Value, null);
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

                    if (!isTokenExpired && !isRateLimitExceeded)
                    {

                        response = _ICommonApiPricing.GetCspPricingsV3(Helper.Helper.KeywordPartSearchV3, DigikeyAccessToken, DigiKeyClientId, response, null, 4);
                    }

                    digiKeyResult.ApiResult = response;
                    digiKeyResult.IsTokenExpired = isTokenExpired;
                    digiKeyResult.IsRateLimitExceeded = isRateLimitExceeded;
                }

            }
            catch (Exception ex)
            {
                SupplierExternalCallLimit objSupplierLimit = new SupplierExternalCallLimit()
                {
                    supplierID = (int)PricingSupplierID.DigiKeyV3,
                    supplierName = PricingAPINames.DigiKey.ToString(),
                    appName = appName,
                    currentDate = DateTime.UtcNow.Date,
                    isLimitExceed = false,
                    clientID = DigiKeyClientId,
                    limitExceedText = "No",
                    callLimit = callLimit == null ? "" : callLimit.ToString()
                };
                _IDigikeyPricingRepository.CheckPendingApiCalls(objSupplierLimit);
            }
            return digiKeyResult;
        }
        public int SavePartFromMongoDB(List<ComponentModel> componentModel, ExternalPartVerificationRequestLog objExtVerification)
        {
            List<ComponentModel> ComponentList = new List<ComponentModel>();
            bool isIssue = false;
            foreach (ComponentModel component in componentModel)
            {
                var objVerification = _ICommonApiPricing.getBOMVerificationIssueList(component, objExtVerification.partNumber, objExtVerification);
                component.uomID = objVerification.ComponentModel.uomID;
                component.partStatusID = objVerification.ComponentModel.partStatusID;
                component.packagingID = objVerification.ComponentModel.packagingID;
                component.RoHSStatusID = objVerification.ComponentModel.RoHSStatusID;
                component.mountingTypeID = objVerification.ComponentModel.mountingTypeID;
                component.costCategoryID = objVerification.ComponentModel.costCategoryID;
                component.functionalCategoryID = objVerification.ComponentModel.functionalCategoryID;
                component.connectorTypeID = objVerification.ComponentModel.connectorTypeID;
                component.PIDCode = objVerification.ComponentModel.PIDCode;
                component.mfgcodeID = objVerification.ComponentModel.mfgcodeID;
                if (objVerification.bomStatusList.Count() > 0)
                {
                    isIssue = true;
                    int result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                }
                else
                {
                    // Bug 42508: [Main branch] : Deadlock error found when trying to get lock
                    //int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(component);
                    //if (detailResponse > 0)
                    //{
                    //    PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = component.mfgPN };
                    //    _ICommonApiPricing.savePriceBreak(component.PricesByReqQty, objPricingModel, PricingAPINames.DigiKey.GetEnumStringValue(), component.packaging, component.distPN, false, component.leadTime, component.packagingID);
                    //}
                }
            }
            objExtVerification.isAlreadySaved = isIssue ? false : true;
            objExtVerification.isAlreadyFound = true;
            //if (!string.IsNullOrEmpty(nextAPIName))
            //{
            //    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(objExtVerification.partID, nextAPIName, objExtVerification.type, objExtVerification.partNumber, objExtVerification.transactionID);
            //}
            if (objExtVerification.cleanType == CleanType.Part.ToString())
            {
                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(objExtVerification.transactionID, isIssue ? 1 : 2, objExtVerification.supplier, null, objExtVerification.partNumber.ToUpper(), objExtVerification.type);
                if (remainApi.apiStatus)
                {
                    objExtVerification.externalIssue = objExtVerification.isPartUpdate ? false : remainApi.bomStatus;
                    // _ICommonApiPricing.ApiCallforExternalPartUpdate(objExtVerification);
                }
            }
            else
            {
                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(objExtVerification.partNumber.ToUpper(), isIssue ? 1 : 2, objExtVerification.supplier, objExtVerification.type, objExtVerification.partID.Value, null);
                if (remainApi.apiStatus)
                {
                    objExtVerification.externalIssue = remainApi.extStatusApi;
                    objExtVerification.status = remainApi.bomStatus;
                    //  _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(objExtVerification);
                    //call for web socket
                }
                //_ICommonApiPricing.ApiCallforBomProgressStatus(objExtVerification); // added for bom progress status
            }
            return callToNextApi(objExtVerification, componentModel, false, false);
            //return 1;
        }

        public void SaveException(ExternalPartVerificationRequestLog lineItem)
        {
            List<bomStatus> bomStatusList = new List<bomStatus>();
            var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(lineItem.supplier, "DIST");
            bomStatus objbomStatus = new bomStatus()
            {
                partID = lineItem.partID,
                lineID = lineItem.lineID,
                errorType = ErrorType.CONTACTADMIN.ToString(),
                errorMsg = ConstantHelper.ContactAdmin,
                Source = lineItem.supplier,
                partNumber = lineItem.partNumber.ToUpper(),
                SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                transactionID = lineItem.transactionID
            };
            bomStatusList.Add(objbomStatus);
            int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
            lineItem.isAlreadySaved = lineItem.isAlreadyFound ? lineItem.isAlreadySaved : false;
            lineItem.isAlreadyFound = true;
            if (lineItem.cleanType == CleanType.Part.ToString())
            {
                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(lineItem.transactionID, 1, lineItem.supplier, lineItem.errorMsg, lineItem.partNumber.ToUpper(), lineItem.type);
                if (remainApi.apiStatus)
                {
                    lineItem.externalIssue = lineItem.isPartUpdate ? false : remainApi.bomStatus;
                    //_ICommonApiPricing.ApiCallforExternalPartUpdate(lineItem);
                }
            }
            else
            {
                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), 1, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                if (remainApi.apiStatus)
                {
                    lineItem.status = remainApi.bomStatus;
                    lineItem.externalIssue = remainApi.extStatusApi;
                    // _ICommonApiPricing.ApiCallforExternalPartBOMUpdate(lineItem);
                    //call for web socket
                }
                //_ICommonApiPricing.ApiCallforBomProgressStatus(lineItem); // added for bom progress status
            }
            callToNextApi(lineItem, new List<ComponentModel>(), false, true);
        }
        public int callToNextApi(ExternalPartVerificationRequestLog objExtVerification, List<ComponentModel> componentList, bool isUpdate, bool isInsert)
        {
            return _ICommonApiPricing.callToNextApi(objExtVerification, mfgList);
        }

        public void checkNextSupplierDetail(ExternalPartVerificationRequestLog Item)
        {
            mfgList = _ICommonApiPricing.checkNextSupplierDetail(Item, Convert.ToInt32(PricingSupplierID.DigiKeyV3));
            //mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            //var newMfgList = mfgList.FindAll(a => a.id != Convert.ToInt32(PricingSupplierID.DigiKeyV3));
            //foreach (ManufacturerViewModel supplierObject in newMfgList)
            //{
            //    if (supplierObject != null && supplierObject.id != 0)
            //    {
            //        ManufacturerViewModel suppObject = _ICommonApiPricing.setNextSupplierDetail(supplierObject, Item.cleanType);
            //        // nextAPIQueueName = suppObject.supplierQueueName;
            //        // nextAPIName = suppObject.supplierName;
            //        if (!string.IsNullOrEmpty(suppObject.supplierQueueName) && !string.IsNullOrEmpty(suppObject.supplierName))
            //        {
            //            ExternalSupplierStatus objExternalSupplierStatus = new ExternalSupplierStatus()
            //            {
            //                supplier = Item.supplier,
            //                type = Item.type,
            //                transactionID = Item.transactionID,
            //                partID = Item.partID,
            //                status = false,
            //                cleanType = Item.cleanType,
            //                partNumber = Item.partNumber
            //            };
            //            _IDigikeyPricingRepository.saveExternalAPIStatus(objExternalSupplierStatus);
            //            _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(Item.partID, suppObject.supplierName, Item.type, Item.partNumber, Item.transactionID);
            //            _ICommonApiPricing.callToNextExternalAPI(Item, compList, false, false, suppObject.supplierQueueName, suppObject.supplierName);
            //        }
            //    }
            //}
            // older logic for sequential execution of details
            //nextAPIQueueName = string.Empty;
            //nextAPIName = string.Empty;
            //mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            //int index = mfgList.FindIndex(a => a.id == Convert.ToInt32(PricingSupplierID.DigiKeyV3));
            //ManufacturerViewModel supplierObject = mfgList.Skip(index + 1).FirstOrDefault();
            //if (supplierObject != null && supplierObject.id != 0)
            //{
            //    supplierObject = _ICommonApiPricing.setNextSupplierDetail(supplierObject, Item.cleanType);
            //    nextAPIQueueName = supplierObject.supplierQueueName;
            //    nextAPIName = supplierObject.supplierName;
            //}
        }
    }
}
