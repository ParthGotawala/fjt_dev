using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class RFQ_Assy_Quote_NRE_Details
    {
        public decimal? amount { get; set; }
        public string fieldName { get; set; }
        public int? days { get; set; }
        public int? toolingQty { get; set; }
        public decimal? extendedCost { get; set; }
        public bool isDaysRequire { get; set; }
    }
}