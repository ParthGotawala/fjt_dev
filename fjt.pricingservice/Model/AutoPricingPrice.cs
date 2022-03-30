using System.Collections.Generic;

namespace fjt.pricingservice.Model
{
    public  class AutoPricingPrice
    {
        public AutoPricingPrice()
        {
            Manufacturers = new List<AutoPricingManufacturer>();
        }
        public long AssemblyId { get; set; }
        public long consolidateID { get; set; }
        public long PartNumberId { get; set; }
        public List<AutoPricingManufacturer> Manufacturers { get; set; }
        public string PriceType { get; set; }
        public double? VIPPrice { get; set; }
        
    }
}
