using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PartUsageRequestModel: CommonEmailModel
    {
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public string partID { get; set; }
    }
}