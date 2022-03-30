using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PartnerPerformanceRequestViewModel: CommonEmailModel
    {
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public string supplierID { get; set; }
        public string loginUserEmployeeID { get; set; }
    }
}