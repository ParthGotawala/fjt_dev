/* eslint-disable no-unused-vars */
var _fixedHeightGrid = 60;
var APIProjectURL = "https://192.168.0.130:2003";
//var APIProjectURL = "https://localhost:4439/"; //For local publish
var _configRootUrl = APIProjectURL + "/api/v1/";
var _configWebUrl = APIProjectURL + "/";
var SOCKET_PATH = APIProjectURL;
var WebsiteBaseUrl = "https://192.168.0.130:3000";
var CompanyLogoImage = "/assets/images/logos/FJT-logo.png";
var _configPermanentDelete = true;
// var _configReportUrl = 'https://localhost:3143/api/';
var _configReportUrl = "https://192.168.0.130/FJT.Reporting/api/";
var _configEnterpriseSearchUrl = "https://192.168.0.130/FJT.SearchEngine/api/";
//var ReportDesigneUrl = 'https://localhost:44361/';  // use Local system Designer.
var ReportDesigneUrl = "https://192.168.0.130/FJT.ReportDesigner/"; // use Local IIS Designer.
var _configReportDesigneUrl = ReportDesigneUrl;
//var ReportViewerUrl = 'https://localhost:44391/'; // use Local system Designer.
var ReportViewerUrl = "https://192.168.0.130/FJT.ReportViewer/"; // use Local IIS Designer.
var _configReportViewerUrl = ReportViewerUrl;
//var _identityURL = 'https://localhost:44372/';  // use Local IdentityServer.
var _identityURL = "https://192.168.0.130/identityserver/"; // use Local IIS IdentityServer.

const _IdentityUserManagerconfig = {
  authority: _identityURL,
  client_id: "Q2C UI",
  redirect_uri: `${WebsiteBaseUrl}/#!/loginresponse`,
  response_type: "code",
  scope:
    "openid profile IdentityServerAPI Q2CFrontEnd Q2CReportDesigner Q2CReportViewer",
  post_logout_redirect_uri: `${WebsiteBaseUrl}/`,
  silent_redirect_uri: `${WebsiteBaseUrl}/silentrefresh.html`,
  automaticSilentRenew: true,
  revokeAccessTokenOnSignout: true,
  includeIdTokenInSilentRenew: true,
  //userStore: new WebStorageStateStore({ store: window.localStorage })
};

var _configDocumentSize = ""; //in terms of bytes (16 Mb)
var ScanDocumentStorageURL =
  "https://localhost:3143/Resources/BrotherPrinterScanDoc/";

var _configUTCTimeZone = "UTC";
var _dateRevisionDisplayFormat = "MMddyy";
var _chunkSizeInMB = 10;
//var _dateDisplayFormat = 'MM/dd/yy';
//var _configUIMask = {
//    date: {
//        mask: '99/99/99',
//        placeholder: 'MM/DD/YY'
//    },
//    time: {
//        mask: '99:99 AA',
//        placeholder: 'HH:MM AM'
//    },
//    datetime: {
//        mask: '99/99/99 99:99 AA',
//        placeholder: 'MM/DD/YY HH:MM AM'
//    }
//};
//var _timeDisplayFormat = 'hh:mm:ss a';
//var _timeWithoutSecondDisplayFormat = 'hh:mm a';
//var _dateTimeDisplayFormat = _dateDisplayFormat + ' ' + _timeWithoutSecondDisplayFormat;
//var _dateTimeFullTimeDisplayFormat = _dateDisplayFormat + ' ' + _timeDisplayFormat;

var _configCameraStatusTime = 60000; // time is in seconds
var _dateDisplayFormat = "";
var _configUIMask = {
  date: {
    mask: "",
    placeholder: "",
  },
  time: {
    mask: "",
    placeholder: "",
  },
  datetime: {
    mask: "",
    placeholder: "",
  },
};
var _timeDisplayFormat = "hh:mm:ss a";
var _timeWithoutSecondDisplayFormat = "";
var _dateTimeDisplayFormat = "";
var _dateTimeFullTimeDisplayFormat = "";
var _accountingYear = "";
var _accountingYearStartingMonth = "";
var _timeZoneOffset = "";
var _DkVersion = "";
var _configMaxTimeout = 2147483647; // in ms
var _dataLimit = 10; // record count
var showEditorSettings = false;
var _configBreadCrumbTimeout = 1005; // in ms
var _configTimeout = 1000; // in ms
var _configSelectListTimeout = 1000; // in ms
var _configWOTimeout = 2000; // in ms
var _configSecondTimeout = 1000; // in ms
var _textEditorMaxLength = 20000; // editor length
var _configPageSize = 50; // record count
var _configScrollRowsFromEnd = 20; // record count
var _configUIGridRowHeight = 28; // record count
var _exactSearchForTree = false;
var _isAllowedToExecuteDBScript = true;
var _configIdleTime = 1800; // in seconds
var _configTimeOutCountdown = 1; // in seconds
var _companyLogo = "";
var _configPageTitleTimeout = 1500;
var _transferStockConfirmationRequired = true;
var _numberFilterDecimal = 0;
var _isSaveIdentityLogInTextFile = true;

//Unit price default decimal point 5
//var _unitPriceFilterDecimal = 5;
//var _unitPriceInputStep = 0.00001;
var _unitPriceFilterDecimal = "";
var _unitPriceInputStep = "";

//Unit price default decimal point 6
//var _sixDigitUnitFilterDecimal = 6;
//var _sixDigitUnitInputStep = 0.000001;
var _sixDigitUnitFilterDecimal = "";
var _sixDigitUnitInputStep = "";

//Receiving material Units/Count default decimal 6
//var _unitFilterDecimal = 5;
//var _unitInputStep = 0.00001;
var _unitFilterDecimal = "";
var _unitInputStep = "";

//Amount default decimal point 2.
//var _amountFilterDecimal = 2;
//var _amountInputStep = 0.01;
var _amountFilterDecimal = "";
var _amountInputStep = "";

var _configOpenInNewTab = true;
var _configGetFeaturesRetryCount = 5;
var _configAdditionalTimeout = 5;

var _textAngularKeyCode = "";

var _FeederAccessRole = "";
var _AdditionalAuditSearchTime = 20;
var _showLightPerSlot = 40;
var _ForceToBuyPriceDifferenceXTimeLess = "";
var _DefaultTheme = "";
var _DemoTheme = "";
var _mfgCodeNameFormat = 4;
var _contactPersonDisplayNameFormat = "";
var _personnelNameFormat = "";
var _maxUMID = 50;

var _globalSettingAllKeys = [
  "DatePickerDateFormat",
  "TimePickerTimeFormat",
  "DateTimePickerDateTimeFormat",
  "CommonNumberFormat",
  "FeederStatusAccess",
  "AccountingYear",
  "TimeZone",
  "DKVersion",
  "ForceToBuyPriceDifferenceXTimeLess",
  "textAngularKeyCode",
  "UploadDocumentSize",
  "GroupConcatSeparator",
  "productionPNLength",
  "CustomerReceiptInvoiceAutoSelect",
  "CustomerAllowPaymentDays",
  "DefaultTheme",
  "DemoTheme",
  "AuthenticateCheckNumberDuplication",
  "MfgCodeNameFormat",
  "ShowDigikeyAccessTokenPopupOnLogin",
  "ContactPersonDisplayNameFormat",
  "PersonnelNameFormat",
  "MaxUMID",
];
var _configIsDisablePageDetails = true;
var _groupConcatSeparatorValue = "";
var _productionPNLength = 0;
var _maxRecordsForSupplierInvoice = 25;
var _maxLengthForDescription = 1000;
var _customerReceiptInvoiceAutoSelect = "";
var _customerAllowPaymentDays = "";
var _configCheckOfflineURL = "https://www.google.com/favicon.ico";
var _Q2CUI = "fjt.ui";
var _Q2CAPI = "fjt.api";
var _Q2CSearchengine = "fjt.searchengine";
var _Q2CReport = "FJT.Reporting";
var _Q2CIdentityServer = "FJT.IdentityServer";
var _Q2CReportViewer = "FJT.ReportViewer";
var _Q2CReportDesigner = "FJT.ReportDesigner";
var _authenticateCheckNumberDuplication = "";
var _configShowDigikeyAccessTokenPopupOnLogin = false;
