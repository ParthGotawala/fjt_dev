using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
   public class PricingAssembly
    {
        public ObjectId _id { get; set; }
        public int RfqAssyQtyId { get; set; }
        public double? OrderQty { get; set; }
        public double TotalDollar { get; set; }
        public string PIDCode { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string SupplierName { get; set; }
        public int? ApiNoOfPosition { get; set; }
        public int APILeadTime { get; set; }
        public string Packaging { get; set; }
        public string SourceOfPrice { get; set; }
        public long? componentID { get; set; }
        public double? pricePerPart { get; set; }
        public double? Min { get; set; }
        public double? Mult { get; set; }
        public double? currentStock { get; set; }
    }
}
