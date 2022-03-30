using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository;
using FJT.Reporting.ViewModels;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.BusinessLogic
{
    public class CommonBusinessLogic : Repository<SystemConfigrations>, ICommonBusinessLogic
    {
        public CommonBusinessLogic(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public string getDisclaimer()
        {
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();
            return desclaimer;
        }
        public string getDateFormatForPaymentReport()
        {
            var dateFormat = this.Context.SystemConfigrations.Where(a => a.key == "DatePickerPaymentReportDateFormat").Select(a => a.values).FirstOrDefault();
            return dateFormat;
        }
        public string getDateFormat()
        {
            var DateFormatJson = this.Context.SystemConfigrations.Where(a => a.key == "DatePickerDateFormat").Select(a => a.values).FirstOrDefault();
            DateTimeFormatViewModel objDateformat = JsonConvert.DeserializeObject<DateTimeFormatViewModel>(DateFormatJson);
            return objDateformat.ReportDateFormat;
        }
        public string getDateTimeFormat()
        {
            var DateTimeFormatJson = this.Context.SystemConfigrations.Where(a => a.key == "DateTimePickerDateTimeFormat").Select(a => a.values).FirstOrDefault();
            DateTimeFormatViewModel objDateTimeFormat = JsonConvert.DeserializeObject<DateTimeFormatViewModel>(DateTimeFormatJson);
            return objDateTimeFormat.ReportDateTimeFormat;
        }
        public string getTimeFormat()
        {
            var TimeFormatJson = this.Context.SystemConfigrations.Where(a => a.key == "TimePickerTimeFormat").Select(a => a.values).FirstOrDefault();
            DateTimeFormatViewModel objTimeFormat = JsonConvert.DeserializeObject<DateTimeFormatViewModel>(TimeFormatJson);
            return objTimeFormat.ReportTimeFormat;
        }
        public string getTermsandCondition()
        {
            string TermsandCondition = this.Context.SystemConfigrations.Where(a => a.key == "Terms & Condition").Select(a => a.values).FirstOrDefault();
            return TermsandCondition;
        }
        public CommonReportDesignViewModel getReportCommonData()
        {
            var reportCommonDataJson = this.Context.SystemConfigrations.Where(a => a.key == "ReportCommonData").Select(a => a.values).FirstOrDefault();
            CommonReportDesignViewModel objCommonReportDesign = JsonConvert.DeserializeObject<CommonReportDesignViewModel>(reportCommonDataJson);
            objCommonReportDesign.fontFamily = Constant.Constant.fontFamily;
            objCommonReportDesign.fontSize = Constant.Constant.fontSize;
            objCommonReportDesign.tableHeaderFontSize = Constant.Constant.tableHeaderFontSize;
            objCommonReportDesign.headerFontWeight = Constant.Constant.headerFontWeight;
            objCommonReportDesign.RoHSImagesURL = Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL;
            objCommonReportDesign.companyLogoURL = this.Context.SystemConfigrations.Where(a => a.key == "CompanyLogo").Select(a => a.values).FirstOrDefault();
            objCommonReportDesign.ReportDefaultImagesPath = Constant.Constant.FJTApiUrl + Constant.Constant.ReportDefaultImagesPath;
            return objCommonReportDesign;
        }
        public CommonReportNumberFormatViewModel getReportCommonNumberFormat()
        {
            var reportCommonNmberFormatJson = this.Context.SystemConfigrations.Where(a => a.key == "CommonNumberFormat").Select(a => a.values).FirstOrDefault();
            CommonReportNumberFormatViewModel objCommonReportDesign = JsonConvert.DeserializeObject<CommonReportNumberFormatViewModel>(reportCommonNmberFormatJson);
            return objCommonReportDesign;
        }
        public IEnumerable<Company_Detail> GetCompany_Detail()
        {
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCompanyReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();
                var model = ((IObjectContextAdapter)Context)
                           .ObjectContext
                           .Translate<Company_Detail>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}