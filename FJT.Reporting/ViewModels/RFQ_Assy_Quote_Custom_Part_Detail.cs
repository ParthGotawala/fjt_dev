using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class RFQ_Assy_Quote_Custom_Part_Detail
    {
        public string CustomPart { get; set; }
        public int requestedQty { get; set; }
        public int turnTime { get; set; }
        public decimal? amount { get; set; }
        public decimal? extendedCost { get; set; }
        public string fieldName { get; set; }
        public int? days { get; set; }
        public bool isDaysRequire { get; set; }
    }
}