using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
   public class RFQ_Consolidate_MFG_LineItemModel
    {
        public int? rfqAssyID { get; set; }
        public int? uomID { get; set; }
        public double? qpa { get; set; }
        public decimal? numOfPosition { get; set; }
        public int? numOfRows { get; set; }
    }
}
