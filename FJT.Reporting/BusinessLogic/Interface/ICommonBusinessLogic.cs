using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.BusinessLogic.Interface
{
    public interface ICommonBusinessLogic : IRepository<SystemConfigrations>
    {
        string getDisclaimer();
        string getDateFormatForPaymentReport();
        string getDateFormat();
        string getDateTimeFormat();
        string getTimeFormat();
        string getTermsandCondition();
        CommonReportDesignViewModel getReportCommonData();
        CommonReportNumberFormatViewModel getReportCommonNumberFormat();
        IEnumerable<Company_Detail> GetCompany_Detail();
    }
}
