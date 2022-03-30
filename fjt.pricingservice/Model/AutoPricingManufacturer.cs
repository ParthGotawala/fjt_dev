using System.Collections.Generic;
using System;

namespace fjt.pricingservice.Model
{
    public class AutoPricingManufacturer
    {
        public AutoPricingManufacturer()
        {
            Sellers = new List<AutoPricingSeller>();
        }
        public string Name { get; set; }
        public string HomePageUrl { get; set; }
        public string PartNumber { get; set; }
        public string PartStatus { get; set; }
        public DateTime? LTBDate { get; set; }
        public List<AutoPricingSeller> Sellers { get; set; }
        public string supplier { get; set; }
        public string mfgPNDescription { get; set; }
    }
}
