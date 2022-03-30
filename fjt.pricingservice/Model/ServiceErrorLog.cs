using System;
namespace fjt.pricingservice.Model
{
    public class ServiceErrorLog
    {   
        public string mfgPN  { get; set; }
        public int? rfqAssyID { get; set; }
        public int? consolidateID { get; set; }
        public string supplier { get; set; }
        public string error { get; set; }
        public string stackTrace { get; set; }
        public string Source { get; set; }
        public DateTime? timeStamp { get; set; }
    }
}
