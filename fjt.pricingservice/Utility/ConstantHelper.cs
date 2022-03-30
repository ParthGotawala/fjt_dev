

using RabbitMQ.Client;

namespace fjt.pricingservice.Helper
{
    public class ConstantHelper
    {
        public const string HeilindAPI = "https://estore.heilindasia.com/search.asp?p={0}";
        public const string NoLimit = "No Limit";
        public const string defaultMailTime = "23.45";
        public const int defaultSleep = 400;
        public const int DefaultDaysToRemove=-15;
        public const int TTIErrorCode = 409;
        public const int DefaultMFRUpdateDay = 7;
        public const int DefaultObsoleteDays = 31;
        public const string ReportName = "MFR Creation Report";
        public const string ObsoletePartForCompanyReportName = "Obsolete Part Details for Company";
        public const string ObsoletePartDetailsPerAssemblyReportName = "Obsolete Part Details Per Assembly";
        public const string DefaultMFRUpdateTimeDaysKey = "DefaultMFRUpdateTime";
        public const string DefaultObsoletePartReportDaysForCompanyKey = "ObsoletePartReportDaysForCompany";
        public const string PIDCodeLengthKey = "PIDCodeLength";
        public static IConnection connection = null;
        public const string BCCEmail = "BCC Email Report";
        public const string Description = "-";
        public const int HeaderBreakAway = -2;
        public const int None_Status = -1;
        public const int PackageingID = -1;
        public const int DkSupplierID = -1;
        public const string Reel = "Reel";
        public const int pinUOM = -2;
        public const int None_uom_Status = 0;
        public const int Non_RoHS=-2;
        public const int Discontinue_Status = -2;
        public const int Obsolete_Status = 2;
        public const int Component_Category = 2;
        public const string DateFormat = "MM/dd/yy";
        public const string DateTimeFormatForDB = "yyyy-MM-dd HH:mm:ss";
        public const string Monday = "Monday";
        public const string CustomerApproved = "A";
        public const string PricingServiceStatus = "PricingServiceStatus";
        public const string ApiErrorStatus = "consolidatepartapi/updatePricingStatusForError";
        public const string ExternalBOMStatus = "consolidatepartapi/externalPartBOMUpdate";
        public const string sendExceedLimitNotification = "notificationmstapi/sendExceedLimitNotification";
        public const string ExternalPartUpdate = "consolidatepartapi/ExternalPartUpdate";
        public const string DigikeyApiErrorStatus = "consolidatepartapi/updatePricingStatusDigiKeyError";
        public const string BomApiProgressStatus = "consolidatepartapi/externalPartBOMUpdateProgressbar";
        public const string PartMasterApiProgressStatus = "consolidatepartapi/externalPartMasterUpdateProgressbar";
        public const string ApiSuccesStatus = "consolidatepartapi/updatePricingStatusForSuccess";
        public const string UpdateComponentDetails = "componentapi/getPricingAndUpdateComponentDetails";
        public const string SendRequestToupdateCartStatus = "inovaxeAPI/SendRequestToupdateCartStatus";
        public const string UpdateDataSheetLinks = "consolidatepartapi/getAvailableUpdateDatasheetLinkList";
        public const string generateObsoletePartReport = "Part/generateObsoletePartReport";
        public const string PartFileStatus = "partapi/getFileUploadStatus";
        public const string PendingDataInElastic = "utility/updatePendingDataInElastic";
        public const string LineItemNotFound = "Line item not found";
        public const string CustomPart = "No price for Custom part";
        public const string RohsNotApproved = "Non-RoHS part is not approved.";
        public const string BadComponent = "No price for bad/TBD part.";
        public const string RestrictedPart = "No price for restricted part.";
        public const string TBDPart = "No price for TBD part.";
        public const string AutoUpdateMessage = "Pricing status reset by system due to timed-out!";
        public const string Auto = "Auto";
        public const string SupplierPN = "SKU";
        public const string TBD = "TBD";
        public const string Active = "Active";
        public const string unitMeaserField = "unitName";
        public const string partTypeField = "partTypeName";
        public const string mountingField = "`name`";
        public const string packagingField = "`name`";
        public const string connectorField = "`name`";
        public const string rohsField = "`name`";
        public const string partStatusField = "`name`";
        public const string PackagingType = "Packaging Type";
        public const string ConnecterType = "Connector Type";
        public const string FunctionalType= "Functional Type";
        public const string Manufacturer = "Manufacturer";
        public const string PartStatus = "Part Status";
        public const string Supplier = "Supplier";
        public const int RohsStatus = 1;
        public const string RoHS = "RoHS";
        public const string UOM = "Unit";
        public const string GENERICFILE = "genericfiles";
        public const string PICTURESTATION = "pictureStation";
        public const string BASEPATH = "/uploads/genericfiles/";
        public const string UOMClass = "Measurement Type";
        public const string AllAPI = "All";
        public const string MFG = "MFG";
        public const string DIST = "DIST";
        public const string PIDCodeLength = "PIDCodeLength";
        public const string PIDCODE_VALID = "{0} PIDCode is too long.";
        public const string PIDCodeInvalid = "PIDCodeInvalid";
        public const string PIDCODE_HYPHENS_INVALID = "{0} PIDCode contains invalid characters.";
        public const string PIDCODE_INVALID_CHARACTER = "--";
        public const string MfgNameFormat = "({0}) {1}";
        public const string MFGType = "MFG";
        public const string DISTType = "DIST";
        public const string NOT_ADDED = "<b>{1}</b> \"{0}\" does not exist. Please add.";
        public const string DISABLED = "<b>{1}</b> \"{0}\" is disabled. Please enable.";
        public const string ContactAdmin = "Something went wrong. Please contact to administrator";
        public const int Authorize = 1;
        public const int CorrectPart = 1;
        public const int IncorrectPart = 2;
        public const int UnknownPart = 3;
        public const int DefaultImportPart= -1000;
        public const int DefaultPartEntityID = -9;
        /*used to remove bellow values from min and max operating temperature*/
        public static string[] OperatingTemperatureNonNumericValues = 
            new string[] { 
                "(WITH DERATING)",
                "(MAX)",
                "(TA)",
                "(TJ)",
                "(TC)",
                "NAN",
                "NULL",
                "°C",
                "C",
                "°F",
                "F",
                "(",
                ")",
                "[",
                "]",
                "{",
                "}"
            };
        public const string TemperaturePlusMinusSign = "±";
        public const string TemperatureFahrenheitSign = "°F";
        public const string TemperatureMaxSign = "(MAX)";

        #region Common Queue
        public const string FJTBOMCleanPart = "FJT-CleanBOM";
        public const string FJTV3CleanBOM = "FJTV3-CleanBOM";
        public const string FJTSchedulePartUpdate = "FJT-ScheduleForPartUpdate";
        public const string FJTSchedulePartUpdateV3 = "FJTV3-ScheduleForPartUpdate";
        public const string FJT = "FJT";
        public const string FJTV3 = "FJT-V3";
        #endregion
        #region Digikey
        public const string DKVersion = "DKVersion";
        public const string CutTape = "Cut Tape (CT)";
        public const string DigiReel = "Digi-Reel®";
        public const string TapeReel= "Tape & Reel (TR)";
        public const int DigikeyTimeoutMiliSeconds = 1000;
        public const string OnlySingleBackSlashRegex = "(?<!:)//";
        public const string DigiKeyRateLimitExceeded = "Digikey rate limit exceeded";
        public const string TOOMANYREQUESTS = "429";
        public const int TOOMANYREQUEST = 429;
        public const string INVALIDPART = "Invalid part number.";
        public const string INVALIDPART_NEW = "<b>Part</b> \"{0}\" not found in supplier APIs {1}. Investigate and add part manually in part master.";
        public const string UNAUTHORIZED = "401";
        public const int INVALID_ARG = 503;
        public const int INVALID_RETURN = 500;
        public const string DigiKeyError = "An error has occurred with DigiKey’s API";
        public const string DigikeyURL = "www.digikey.com";
        public const string DigikeyHomePageURL = "http://www.digikey.com/";
        public const string Weeks = "weeks";
        public const string Week = "Week";
        public const string RohsComplient = "RoHS compliant";
        public const string RohsNonComplient = "RoHS non-compliant";
        public const string Dollar = "$";
        public const string CacheControl = "cache-control";
        public const string NoCache = "no-cache";
        public const string Content = "Content-Type";
        public const string DigiKeyURI = "code={0}&client_id={1}&client_secret={2}&redirect_uri={3}&grant_type={4}";
        public const string UpdatedBy = "1";
        public const string DigiKeyRefreshTokenUri = "grant_type={0}&refresh_token={1}&client_id={2}&client_secret={3}";
        public const string RequestType = "application/x-www-form-urlencoded; charset=utf-8";
        public const string RefreshToken = "refresh_token";
        public const string ApplicationJson = "application/json";
        public const string Auth = "authorization";
        public const string ClientKey = "x-ibm-client-id";
        public const string ClientKeyV3 = "X-DIGIKEY-Client-Id";
        public const string CustomerID = "X-DIGIKEY-Customer-Id";
        public const string Part = "Part";
        public const string RecordCount = "RecordCount";
        public const string StartPosition = "RecordStartPosition";
        public const string Keyword = "Keywords";
        public const string TokenExpires = "Token Expires";
        public const string LastTimeBy = "Last Time Buy";
        public const string Length = "Length";
        public const string Weight = "Weight";
        public const string DefaultUom="Each";
        public const string LengthUom = "Foot";
        public const string NoOfPosition = "Number of Positions";
        public const string Features = "Features";
        public const string DKPackaging = "Packaging";
        public const string StdpackageQty = "Standard Pack Qty";
        public const string OperatingTemp = "Operating Temperature";
        public const string AvnetOperatingTemp = "Max Processing Temp";
        public const string OperatingTempJunc = "Operating Temperature - Junction";
        public const string Width = "Width";
        public const string Thickness= "Thickness - Overall";
        public const string Height= "Height";
        public const string HeightMax= "Height - Seated (Max)";
        public const string EOL = "/ EOL";
        public const string MountingType = "Mounting Type";
        public const string Size = "Size / Dimension";
        public const string DKTolerence = "Tolerance";
        public const string DKConnectorType = "Connector Type";
        public const string DKContactType = "Connector/Contact Type";
        public const string DKPackage = "Package / Case";
        public const string DKVoltage = "Voltage - Rated";
        public const string DKCapacitance = "Capacitance";
        public const string DKInductance = "Inductance";
        public const string DKResistanceOhm = "Resistance (Ohms)";
        public const string DKResistance = "Resistance";
        public const string DKPowerPerElement = "Power Per Element";
        public const string DKPowerRating = "Power (Watts)";
        public const string DKNoOfRows = "Number of Rows";
        public const string DKPitch = "Pitch";
        public const string DKPitchMating = "Pitch - Mating";
        public const string TempratureCoefficient = "Temperature Coefficient";
        public const string TempratureCoefficientUnit = "ppm/°C";
        public const string color = "Color";
        public const string ProductPhoto = "Product Photos";
        public const string DataSheets = "Datasheets";
        public const string Catalog = "Catalog Drawings";
        public const string ElasticSearch = "Enteprise Search";
        #endregion
        #region Mouser
        public const int MouserDelay = 2500;
        public const string MouserEndPoint = "https://api.mouser.com/api/v1/search/partnumber?apiKey={0}";
       // public const string MouserApiKey = "c30aac7a-061f-4a07-8a2f-72b32f637e0c"; //"47fc131d-62e8-41de-9f20-f3eb09821ca6";//"c76b85fd-d4bd-4b12-b59d-7c7cb2b1b2da";
        public const string MouserError= "An error has occurred with Mouser’s API";
        public const string MouserHomepageUrl = "http://www.mouser.com/";
        public const string MouserException= "<b> An error has occurred with Mouser’s API. </b><br/>Contact Mouser API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> {0}";
        public const string MouserInstock = "In Stock";
        public const string MouserCardentialNotFound = "Mouser Credential Not Found";
        public const string Days = "Days";
        public const string Day = "Day";
        public const string Dias = "Días";
        public const string Dia = "Día";
        public const string Diias = "Dias";
        public const string Diia = "Dia";
        public const string FootMouser = "PER FT";
        public const string MouserJSONAPI = "MouserJSONAPI";
        public const string MouserSOAPAPI = "MouserSOAPAPI";
        public const string MouserPackaging = "packaging";
        public const string Invalidkey = "Server was unable to process request. ---> Invalid unique identifier";
        public const string InvalidkeyMessage = "Mouser api key is not valid. Please contact to administrator";
        #endregion
        #region Newark
        // public const string NewarkApiKey = "f463bdbggmtrv4d779q556fr";
        public const string NewarkBaseURI = "https://api.element14.com/";
        public const string NewarkSleepingTime = "500";
        public const string NewarkPackaging = " packaging";
        public const string NewarkPackagings = "packaging";
        public const string NewarkApiError = "http://partner.element14.com/docs/Product_Search_API_REST__Description#apierrors";
        public const string NewarkError = "Error Code: <b> {0} </b> <br/> Error Description: <b> {1} </b><br/>For further detail on exceptions <a href='{2}' target='_blank'>click here</a>";
        public const string ApiException = "{0}<br/>For further detail on exceptions <a href='{1}' target='_blank'>click here</a>";
        public const string LineItemException = "<b> An error has occurred with Newark’s API. </b><br/>Contact Newark API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> {0}";
        public const string NewarkHomePageUrl = "http://www.newark.com/";
        public const string NewarkErrors = "An error has occurred with Newark’s API";
        public const string Newarkurl = "www.newark.com";
        public const string OctopartUrlEndpoint= "/catalog/products";
        public const string ApiKeyParam = "callInfo.apiKey";
        public const string StoreId = "storeInfo.id";
        public const string ResponseFormat = "callInfo.responseDataFormat";
        public const string ResponseGroup = "resultsSettings.responseGroup";
        public const string ResponsegroupSize = "large";
        public const string ResponseJsonFormat = "JSON";
        public const string Term = "term";
        public const string NewarkCardentialNotFound = "Newark Credential Not Found";
        public const string Foot = "FT";
        public const string Each = "EA";
        public const string NoOfContact = " No. of Contacts";
        public const string NoOfContacts = "No. of Contacts";
        public const string NoOfPin = " No. of Pins";
        public const string NoOfPins = "No. of Pins";
        public const string Tolerance = " Resistance Tolerance";
        public const string Tolerances = "Resistance Tolerance";
        public const string CapaTolerance = " Capacitance Tolerance";
        public const string CapaTolerances = "Capacitance Tolerance";
        public const string OperatingMin = " Operating Temperature Min";
        public const string OperatingMins = "Operating Temperature Min";
        public const string OperatingMax = " Operating Temperature Max";
        public const string OperatingMaxs = "Operating Temperature Max";
        public const string Epoxy = "epoxy";
        public const string ConductiveEpoxy ="Conductive Epoxy";
        public const string NewarkLength = " Length";
        public const string NewarkLengths = "Length";
        public const string NewarkWidth = " Width";
        public const string NewarkWidths = "Width";
        public const string NewarkHeight = " Depth";
        public const string NewarkHeights = "Depth";
        public const string NewarkHeightMax = " Height";
        public const string NewarkHeightMaxs = "Height";
        public const string NewarakPowerRating = " Power Rating";
        public const string NewarakPowerRatings = "Power Rating";
        public const string NewarakSizeDimension = " Diameter";
        public const string NewarakSizeDimensions = "Diameter";
        public const string NewarkCapacitance = " Capacitance";
        public const string NewarkCapacitances = "Capacitance";
        public const string NewarkInductance = " Inductance";
        public const string NewarkInductances = "Inductance";
        public const string NewarkResistance = " Resistance";
        public const string NewarkResistances = "Resistance";
        public const string NewarkVoltageRating = " Voltage Rating";
        public const string NewarkVoltageRatings = "Voltage Rating";
        public const string NewarkVoltageIsolation = " Isolation Voltage";
        public const string NewarkVoltageIsolations = "Isolation Voltage";
        public const string NewarkPackage = " Resistor Case Style";
        public const string NewarkPackages = "Resistor Case Style";
        public const string NewarkNoOfRows = " No. of Rows";
        public const string NewarkNoOfRow = "No. of Rows";
        public const string LedColors = " LED Color";
        public const string LedColor = "LED Color";
        public const string NwMounting = "Transistor Mounting";
        public const string NwFunctional = "Connector Systems";
        public const string NwPitchMating = "Pitch Spacing";
        public const string NewarkLimit = "<h1>Developer Over Rate</h1>";
        #endregion

        #region Arrow
        public const string ArrowIssue = "Something wrong in Arrow API key";
        public const string ArrowBaseURI= "http://api.arrow.com/";
        public const string arrowpartUrlEndpoint = "/itemservice/v3/en/search/token";
        public const string LoginKey = "login";
        public const string ArrowApiKey = "apikey";
        public const string SearchToken = "search_token";
        public const string Rows = "rows";
        public const string Rohs = "eurohs";
        public const string RohsArrowComplient = "Compliant";
        public const string NA = "n/a";
        public const string PriceOrigin = "ACNA";
        public const string ArrowCardentialNotFound = "Arrow Credential Not Found";
        public const string ArrowLengthException = "search token too short, use at least 3 letters or numbers";
        public const string ArrowHomepageUrl = "https://www.arrow.com/";
        public const string ArrowLineItemException = "<b> An error has occurred with Arrow’s API. </b><br/>Contact Arrow API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> { 0}";
        #endregion

        #region Avnet
        public const int AvnetTimeoutMiliSeconds = 1000;
        public const string AvnetBaseURI = "https://apigw.avnet.com";
        public const string AvnetHomePageURL = "https://www.avnet.com/";
        public const string avnetpartUrlEndpoint = "/ws/getDEXFetchProductsVS/wcs?STORE_ID={0}&searchTerm={1}&searchType=MFPARTNUMBER&infoLevel=COMPLETE";
        public const string AvnetAccept = "Accept";
        public const string AvnetAuthToken = "Authorization";
        public const string AvnetSubscriptionKey = "Ocp-Apim-Subscription-Key";
        public const string AvnetWCToken = "WCToken";
        public const string AvnetWCTrustedToken = "WCTrustedToken";
        public const string AvnetHeaderAccept = "application/json";
        public const string AvnetError = "Error";
        public const string AvnetLineItemException = "<b> An error has occurred with Avnet’s API. </b><br/>Contact Avnet API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> { 0}";
        public const string CableLength = "Cable Length";
        public const string Mounting = "Mounting";
        public const string ProductDimension = "Product Dimensions";
        public const string PinCount = "Pin Count";
        public const string AvnetCapacitance = "Capacitance Value";
        public const string AvnetPower = "Maximum Power Dissipation";
        public const string AvnetVolatage = "Voltage(DC)";
        public const string AvnetPackage = "Case Size";
        public const string AvnetPackageSupplier = "Supplier Package";
        public const string AvnetHeightText = "Product Height";
        public const string AvnetCurrent = "Output Current";
        public const string AvnetFeature = "productFeatures";

        #endregion

        #region TTI
        public const string TTINOTFound= "TTI Credential Not Found";
        public const string TTIPricingApi = "https://www.ttiinc.com/service/part/search/customer/json?searchTerms={0}&accessToken={1}&utm=APIILF034&channel=api&source=flextroncircuitassembly&campaigns=tti-api";
        public const string TTINoResponse = "No Response from TTI Api";
        public const string UserAgent = "user-agent";
        public const string TTILineItemException = "<b> An error has occurred with TTI’s API. </b><br/>Contact TTI API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> { 0}";
        public const string TTIHomePageURL = "https://www.ttiinc.com";
        public const string RohsCompilentTTI = "Compliant";

        #endregion
        #region Heilind
        public const string heilindEndPoint= "https://ebizapi.dac-group.com/parts?partner={0}&partstring={1}";
        public const string heilindAuth = "Authorization";
        public const string HeilindCardentialNotFound = "Heilind Credential Not Found";
        public const string HeilindLineItemException = "<b> An error has occurred with Heilind’s API. </b><br/>Contact Arrow API tech support for further assistance.Please reference the following detailed error message in your communication. <br/> { 0}";
        #endregion
        #region Message for Not selected
        public const string StockNotMatch = "Failed to meet available stock,Price is available,Modify pricing criteria or add price manually to continue.";
        public const string PackagingMatch = "Failed to meet packaging requirement {0},Price is available,Modify pricing criteria or add price manually to continue.";
        public const string StockOverrunNotMatch = "Failed to meet overrun criteria,Price is available,Modify pricing criteria or add price manually to continue.";
        #endregion

        public const string Pricing = "Pricing";
        public const string MouserMaximumCall = "Maximum calls per minute exceeded.";
        public const string MouserMaximumCallPerDay = "Maximum calls per day exceeded.";
        public const string PartBOMVerification = "PartBOMVerification";
        public const string PartStatusUpdate = "PartStatusUpdate";
        public const string ErrorException = "Deadlock found when trying to get lock; try restarting transaction";
        public const string DuplicateSerial = "duplicate Serial Number";
        public static string MailGunServiceUsed = "Mailgun";
        public static string DuplicateEntry = "duplicate entry";
        public static string RabbitMQDisconnectedMessage = "None of the specified endpoints were reachable";

        #region OctoPart Detail
        public const string OctoPartURI = "https://octopart.com/api/v4/rest/parts/match?apikey={0}&queries=%5B%7B%22mpn%22%3A%22{1}%22%7D%5D&pretty_print=true&include%5B%5D=specs&include%5B%5D=imagesets&include%5B%5D=category_uids&include%5B%5D=descriptions&include%5B%5D=compliance_documents&include%5B%5D=datasheets&include%5B%5D=external_links";
        #endregion
    }
}
