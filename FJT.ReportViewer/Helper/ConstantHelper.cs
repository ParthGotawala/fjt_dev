using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Helper
{
    public class ConstantHelper
    {
        public enum APIStatusCode
        {
            SUCCESS = 200,
            ERROR = 200,
            BAD_REQUEST = 400,
            UNAUTHORIZED = 401,
            PAGE_NOT_FOUND = 404,
            ACCESS_DENIED = 403, // client authenticated but does not have permission to access requested resource
            INTERNAL_SERVER_ERROR = 500
        }
        public enum APIState
        {
            [Display(Name = "SUCCESS")]
            SUCCESS,
            [Display(Name = "FAILED")]
            FAILED
        }

        //public const string AUTHENTICATION_DEFAULT_SCHEME = "idsrvViewer";
        public const string AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME = "oidcViewer";
        public const string PROJECT_NAME = "Q2C Report Viewer";

        // URL PATH.
        public static string TOKEN_PATH = "/connect/token";
        public static string VALIDATE_CLIENT_USER_MAPPING_URL = "/api/Authentication/ValidateClientUserMapping";
        public static string CHECK_STATUS_OF_REPORT_FILE = "/Utility/CheckStatusOfReportFile/";
        public static string GET_REPORT_BYTE_DATA = "/Utility/GetReportByteData/";

        // Default Report Parameter , Databse name
        public const string REPORT_DATABASE_NAME = "FlextTron";
        public const string PARA_REPORT_TITLE = "Para_ReportTitle";
        public const string PARA_REPORT_VERSION = "Para_Report_Version";
        public const string Para_ROHS_ImageFolderPath = "Para_ROHS_ImageFolderPath";

        // Modeule Names
        public static string REPORT_DETAILS = "Reports details";
        public static string REPORT_ENTITY = "Report";
        public static string REQUESTED = "requested"; // AccessDenied message

        // Response Message Key
        public const string INVALID_PARAMETER = "INVALID_PARAMETER";
        public const string SOMTHING_WRONG = "SOMTHING_WRONG";
        public const string NOT_FOUND = "NOT_FOUND";
        public const string POPUP_ACCESS_DENIED = "POPUP_ACCESS_DENIED";

        // Logout Message
        public const string LOGOUT_CONFIRMATION = "You will be logout from all connected app. Are you sure you want to logout?";

        public const string MONGODB_CONNECTION_ERROR = "Something went wrong in MongoDBConnection. Please contact administrator.";
    }
}
