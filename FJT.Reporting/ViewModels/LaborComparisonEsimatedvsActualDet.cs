using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class LaborComparisonEsimatedvsActualDet
    {
        public string assembly { get; set; }
        public decimal? perAssyPrice { get; set; }
        public decimal? totalCost { get; set; }
        public string mountingtype { get; set; }
        public int mountingTypeID { get; set; }
        public int partID { get; set; }
        public bool costType { get; set; }
        public int Qty { get; set; }
        public int? sid { get; set; }
    }
}