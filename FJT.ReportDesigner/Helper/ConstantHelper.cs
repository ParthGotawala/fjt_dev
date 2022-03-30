using FJT.ReportDesigner.AppSettings;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Helper
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

        //public const string AUTHENTICATION_DEFAULT_SCHEME = "idsrvDesigner";
        public const string AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME = "oidcDesigner";
        public const string PROJECT_NAME = "Q2C Report Designer";
        public const string REPORT_EXTENSION = ".mrt";

        public static string TOKEN_PATH = "/connect/token";
        public static string VALIDATE_CLIENT_USER_MAPPING_URL = "/api/Authentication/ValidateClientUserMapping";

        public static string REPORT_DETAILS = "Reports details";
        public static string REPORT_NAME = "Report name";
        public static string REPORT_ENTITY = "Report";
        public static string TEMPLATE = "Selected Template";
        public static string TEMPLATE_DETAILS = "Template details";
        public static string COPY_FROM = "Copy from report";
        public static string COPY_FROM_DETAILS = "Copy from report details";
        public static string START_ACTIVITY_DETAILS = "Start Activity Record for this Report"; 
        public static string REQUESTED_PAGE = "The page you requested";  // NotFound message
        public static string REQUESTED = "requested"; // AccessDenied message

        // Save report Mode
        public const string DRAFT_MODE = "draft";
        public const string PUBLISH_MODE = "publish";
        public const string SAVE_AS_DRAFT = "Save as Draft";
        public const string SAVE_AND_PUBLISH = "Save & Publish";

        // Default Report Parameter , Databse name
        public const string REPORT_DATABASE_NAME = "FlextTron";
        public const string PARA_REPORT_TITLE = "Para_ReportTitle";
        public const string PARA_REPORT_VERSION = "Para_Report_Version";
        public const string Para_ImageFolderPathFor_ROHS = "Para_ImageFolderPathFor_ROHS";

        // Response Message Key
        public const string INVALID_PARAMETER = "INVALID_PARAMETER";
        public const string SOMTHING_WRONG = "SOMTHING_WRONG";
        public const string NOT_FOUND = "NOT_FOUND";
        public const string MUST_UNIQUE_GLOBAL = "MUST_UNIQUE_GLOBAL";
        public const string ACTIVITY_ALREADY_STARTED = "ACTIVITY_ALREADY_STARTED";
        public const string CREATED = "CREATED";
        public const string UPDATED = "UPDATED";
        public const string ALREADY_EXISTS = "ALREADY_EXISTS";
        public const string POPUP_ACCESS_DENIED = "POPUP_ACCESS_DENIED";
        public const string DISCARD_DRAFT_CHANGES = "DISCARD_DRAFT_CHANGES";
        public const string CONFIRM_STOP_ACTIVITY = "CONFIRM_STOP_ACTIVITY";
        public const string CONFIRM_REPORT_VERSION = "CONFIRM_REPORT_VERSION";
        public const string SUCCESSFULLY_DISCARD_CHANGES = "SUCCESSFULLY_DISCARD_CHANGES";
        public const string STOP_ACTIVITY_SUCCESS = "STOP_ACTIVITY_SUCCESS";
        public const string SUCCESSFULLY_PUBLISHED = "SUCCESSFULLY_PUBLISHED";
        public const string SUCCESSFULLY_SAVE_AS_DRAFT = "SUCCESSFULLY_SAVE_AS_DRAFT";

        // Response Message
        public static string LOGOUT_CONFIRMATION = "You will be logout from all connected app. Are you sure you want to logout?";  // CHANGE_PERMISSION_LOGOUT  // Need Discussion how can i use From MongoDB.
        public const string MAY_YOUR_SESSION_ISEXPIRED = "May Your Session is Expired.";
        public const string MONGODB_CONNECTION_ERROR = "Something went wrong in MongoDBConnection. Please contact administrator.";

    }
}
