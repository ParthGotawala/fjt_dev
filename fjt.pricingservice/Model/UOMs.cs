using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
   public class UOMs
    {
        public int id { get; set; }
        public int? perUnit { get; set; }
        public int? baseUnitID { get; set; }
        public decimal? baseUnitConvertValue { get; set; }
        public string abbreviation { get; set; }
    }
}
