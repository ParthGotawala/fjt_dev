using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
   public class CommonApiError
    {
        public List<bomStatus> bomStatusList { get; set; }
        public ComponentModel ComponentModel { get; set; }
    }
}
