using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
   public class ExternalAPIConfigurationSettingsViewModel
    {
        public int id { get; set; }
        public int? supplierID { get; set; }
        public string clientID { get; set; }
        public string secretID { get; set; }
        public string refreshToken { get; set; }
        public string accessToken { get; set; }
        public string specialPriceCustomerID { get; set; }
        public int? perCallRecordCount { get; set; }
        public string appID { get; set; }
        public bool defaultAccess { get; set; }
        public int dkCallLimit { get; set; }
    }
}
