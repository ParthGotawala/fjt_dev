using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerPackingSlipRequestModel : CommonEmailModel
    {
        public int id { get; set; }
        public string companyName { get; set; }
        public string COFCReportDisclaimer { get; set; }
        public string PACKINGSLIPReportDisclaimer { get; set; }
        public string DECLARATIONOFRoHSCOMPLIANCE { get; set; }
        public string RoHSReportDisclaimer { get; set; }

    }
}