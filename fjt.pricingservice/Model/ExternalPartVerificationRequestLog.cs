using System;

namespace fjt.pricingservice.Model
{
    public class ExternalPartVerificationRequestLog
    {
        public ExternalPartVerificationRequestLog()
        {
            isAlreadySaved = true;
        }
        public int id { get; set; }
        public string lineID { get; set; }
        public int? partID { get; set; }
        public string partNumber { get; set; }
        public int? partStatus { get; set; }
        public string supplier { get; set; }
        public string type { get; set; }
        public bool status { get; set; } 
        public string errorMsg { get; set; }
        public bool externalIssue { get; set; }
        public DateTime modifiedDate { get; set; }
        public string description { get; set; }
        public string mfgName { get; set; }
        public string cleanType { get; set; }
        public string transactionID { get; set; }
        public bool isPartUpdate { get; set; }
        public bool isAlreadySaved { get; set; }
        public bool isAlreadyFound { get; set; }
        public int? userID { get; set; }
        public int? employeeID { get; set; }
    }
}
