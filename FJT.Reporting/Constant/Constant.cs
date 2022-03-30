using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Constant
{
    public class Constant
    {
        public static string FJTApiUrl = Convert.ToString(ConfigurationManager.AppSettings["FJTAPIUrl"]);
        public static string ReportDefaultImagesPath = Convert.ToString(ConfigurationManager.AppSettings["ReportDefaultImagesPath"]);
        public static string RoHSImagesURL = Convert.ToString(ConfigurationManager.AppSettings["RoHSImagesPath"]);
        public static string ScanDocumentConsoleAppPath = Convert.ToString(ConfigurationManager.AppSettings["ScanDocumentConsoleAppPath"]);
        public static string ScanDocumentConsoleAppNotExists = "FCA Internal Scanner Server is down.";
        public static string InovaxeAPIUrl = Convert.ToString(ConfigurationManager.AppSettings["InovaxeAPIUrl"]);
        public static string InovaxeAPIResponseFilePath = Convert.ToString(ConfigurationManager.AppSettings["InovaxeAPIResponseFilePath"]);
        public static string ScanDocuFilePath = Convert.ToString(ConfigurationManager.AppSettings["ScanDocuFilePath"]);
        public static DateTime printDate = DateTime.Now;
        public static string printDateFormate = "hh:mm tt";
        public static string printDateFormateUi = "hh:mm a";
        public static string DateFormat = "MM/dd/yy";

        public static string DateTimeFormat = "MM/dd/yy hh:mm tt";

        // Format to compare with ui passed format and return print format
        public static string UI_DateFormat = "MM/dd/yy";
        public static string UI_TimeFormat = "hh:mm a";
        public static string UI_DateTimeFormat = "MM/dd/yy hh:mm a";
        public static string Report_DateFormat = "MM/dd/yy";
        public static string Report_TimeFormat = "hh:mm tt";
        public static string Report_DateTimeFormat = "MM/dd/yy hh:mm tt";


        public static string Report = "Report";
        public static string ReportVersion = "1.0.0";

        public static string fontFamily = "Arial";
        public static string fontSize = "8pt";
        public static string tableHeaderFontSize = "10pt";
        public static string headerFontWeight = "Bold";

        public enum MessageTemplateType
        {
            DefaultEmail = -1,
            Unknown = 0,
            UserSignUpAgreement = 1,
            ForgotPassword = 2,
            ObsoletePartDetailsReport = 3,
        }
        public enum obsoletepartReportRadioButtonFilter
        {
            IncludeAllAlternatesandRoHSReplacementParts = 1,
            IncludeAlternatesPartsOnly = 2,
            IncludeRoHSReplacementPartsOnly = 3,
            ExcludeAlternateswhenRoHSReplacementPartsisAvailable = 4
        }
        public static string withAlternateParts = "With Alternate Parts";
        public static string MailGunServiceUsed = "Mailgun";
        public static string MailSMTPServiceUsed = "Smtp";

        public const string userNameHtmlTag = "<% UserName %>";
        public const string companyNameHtmlTag = "<% CompanyName %>";
        public const string linkURLHtmlTag = "<% Link %>";
        public const string companyLogoHtmlTag = "<% CompanyLogo %>";
        public const string assemblyNameHtmlTag = "<% AssemblyName %>";
        public const string customerCompanyNameHtmlTag = "<% CustomerCompanyName %>";

        /// <summary>
        /// Convert to this formate (MM/DD/YYYY)
        /// </summary>
        /// <param name="UIDateFormat"></param>
        /// <returns></returns>
        public static string GetDateFormat(string UIDateFormat)
        {
            if (UIDateFormat.ToLower() == UI_DateFormat.ToLower())
            {
                Report_DateFormat = string.Format("{0}{1}:{2}{3}", "{", 0, UIDateFormat, "}"); // {0:MM/DD/YYYY}
                return Report_DateFormat;
            }
            return UIDateFormat;
        }
        /// <summary>
        /// Convert to this formate (hh:mm tt)
        /// </summary>
        /// <param name="UITimeFormat"></param>
        /// <returns></returns>
        public static string GetTimeFormat(string UITimeFormat)
        {
            if (UITimeFormat.ToLower() == UI_TimeFormat.ToLower())
            {
                Report_DateFormat = string.Format("{0}{1}:{2}{3}", "{", 0, UITimeFormat, "}"); // {0:hh:mm tt}
                return Report_TimeFormat;
            }
            return UITimeFormat;
        }
        /// <summary>
        /// Convert to this formate (MM/DD/YYYY hh:mm tt)
        /// </summary>
        /// <param name="UIDateFormat"></param>
        /// <param name="UITimeFormat"></param>
        /// <returns></returns>
        public static string GetDateTimeFormat(string UIDateFormat, string UITimeFormat)
        {
            if (UIDateFormat.ToLower() == UI_DateFormat.ToLower() && UITimeFormat.ToLower() == UI_TimeFormat.ToLower())
            {
                Report_DateTimeFormat = string.Format("{0}{1}:{2}{3}{4}{5}", "{", 0, UI_DateFormat, ' ', Report_TimeFormat, "}");//{0:MM/DD/YYYY hh:mm tt}
                return Report_DateTimeFormat;
            }
            return Report_DateTimeFormat;
        }
    }
}