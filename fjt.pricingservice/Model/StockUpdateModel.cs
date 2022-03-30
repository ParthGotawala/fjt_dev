using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class StockUpdateModel
    {
        public decimal? currentStock { get; set; }
        public decimal? supplierStock { get; set; }
        public decimal? grossStock { get; set; }
        public string rfqQtySupplierID { get; set; }
        
    }
}
