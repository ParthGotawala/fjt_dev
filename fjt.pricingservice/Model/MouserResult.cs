using fjt.pricingservice.com.mouser.www;

namespace fjt.pricingservice.Model
{
    public class MouserResult
    {
        public ResultParts resultParts { get; set; }
        public long assemblyId { get; set; }
        public long partNoId { get; set; }
        public long consolidateID { get; set; }
        public bool isResponseSend { get; set; }
    }
}
