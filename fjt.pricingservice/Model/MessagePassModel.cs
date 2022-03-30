using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class MessagePassModel
    {
        public string SlotName { get; set; }
        public int LEDColor { get; set; }
        public int BlinkDuration { get; set; }
        public int BlinkRate { get; set; }
        public int TypeMessage { get; set; }
        public string Machine { get; set; }
        public string DateCreated { get; set; }


    }
}
