using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Helper
{
    public class Constant
    {
        public static string USER_SIGNUP_AGREEMENT_TYPE_NAME = "UserSignUpAgreement";

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

        public static string AGREEMENT_ENTITY = "Agreement Template";
        public static string USER_ENTITY = "User";
        public static string USER_NAME = "User name";
        public static string EMAIL = "Email";
        public static string REQUESTED = "requested"; // AccessDenied message

        public static string COMPANY_NAME = "Flextron";
        public static string COMPANY_LOGO_KEY = "CompanyLogo";
        public static string ASSEMBLY_NAME = "";
        public static string CUSTOMER_COMPANY_NAME = "";

        public static string AESSecretKey = "fl!23net@%$$2!@#";
        public static string CLIENT_ID = "Q2C UI";

        public static string FORGOT_PASSWORD_MAIL_USERNAME_FORMAT = "{0} ({1})";
        public static string FORGOT_PASSWORD_CALLBACK_LINK = "{0}/Account/ResetUserPassword/?userName={1}&token={2}";

        public static string SYSTEM_VARIABLE_USERNAME_HTMLTAG = "<% UserName %>";
        public static string SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG = "<% CompanyName %>";
        public static string SYSTEM_VARIABLE_LINKURL_HTMLTAG = "<% Link %>";
        public static string SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG = "<% CompanyLogo %>";
        public static string SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG = "<% AssemblyName %>";
        public static string SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG = "<% CustomerCompanyName %>";

        public const string ERROR_MSG = "Error";
        public const string REQUIRED_INPUT_MSG = "Required!";
        public const string PASSWORD_VALIDATION_INPUT_MSG = "Password must be 8 characters long and must contain at least one uppercase, lowercase, number & special character.";
        public const string PASSWORD_MISMATCH_INPUT_MSG = "Mismatched!";

        // Response Message Key
        public const string INVALID_PARAMETER = "INVALID_PARAMETER";
        public const string SOMTHING_WRONG = "SOMTHING_WRONG";
        public const string NOT_FOUND = "NOT_FOUND";
        public const string CREATED = "CREATED";
        public const string UPDATED = "UPDATED";
        public const string DELETED = "DELETED";
        public const string SAVED = "SAVED";
        public const string ALREADY_EXISTS = "ALREADY_EXISTS";
        public const string POPUP_ACCESS_DENIED = "POPUP_ACCESS_DENIED";
        public const string USER_USERNAME_PASSWORD_INCORRECT = "USER_USERNAME_PASSWORD_INCORRECT";
        public const string EMPLOYEE_CREDENTIAL_UPDATED = "EMPLOYEE_CREDENTIAL_UPDATED";
        public const string FILE_FOLDER_RESTORE = "FILE_FOLDER_RESTORE";
        public const string LOGIN_AGRREMENT_SIGN = "LOGIN_AGRREMENT_SIGN";
        public const string PASSWORD_RESET_LINK_EXPIRED = "PASSWORD_RESET_LINK_EXPIRED";
        public const string WITHOUT_SAVING_ALERT_BODY_MESSAGE = "WITHOUT_SAVING_ALERT_BODY_MESSAGE";
        public const string PROVIDE_SIGNATURE = "PROVIDE_SIGNATURE";
        public const string DELETE_CONFIRM_MESSAGE = "DELETE_CONFIRM_MESSAGE";

        // Response Messages.
        public static string INVALID_RETURN_URL = "invalid return URL";
        public static string INVALID_USERNAME_OR_EMAILID = "Invalid UserName Or Email.";
        public static string PASSWORD_DOSENOT_MATCH = "Mismatched! New password and Confirm new password.";
        public static string MONGODB_CONNECTION_ERROR = "Something went wrong in MongoDBConnection. Please contact administrator.";
    }
}
