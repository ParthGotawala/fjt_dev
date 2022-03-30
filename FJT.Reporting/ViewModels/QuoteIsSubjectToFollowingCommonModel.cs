using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class QuoteIsSubjectToFollowingCommonModel
    {
        public string PIDCode { get; set; }
        public string lineID { get; set; }
        public string refDesg { get; set; }
        public string CPN { get; set; }
        public string CPNRev { get; set; }
        public string mfrCode { get; set; }
        public string mfrPN { get; set; }
        public string BOMIssue { get; set; }
        public bool isCustom { get; set; }
        public string actualStock { get; set; }
        public string approvedBy { get; set; }
    }
}