using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class QuoteSummaryModel
    {
        public int RFQAssyID { get; set; }
        public int AssyQuoteSubmittedID { get; set; }
        public bool ShowAvailableStock { get; set; }
        public string CompanyCode { get; set; }
        public bool isCustomPartDetShowInReport { get; set; }
        public int format { get; set; }
    }
}