using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class ManufacturerViewModel
    {
        public int id { get; set; }
        public string mfgCode { get; set; }
        public string mfgName { get; set; }
        public string supplierName { get; set; }
        public string supplierQueueName { get; set; }
    }
}
