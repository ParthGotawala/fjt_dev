using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DeliverMaterialPartsResponse
    {
        public string TransactionID { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public bool InquiryOnly { get; set; }
        public List<PartNumbers> PartsAvailable { get; set; }
        public List<PartNumbers> PartsDelivered { get; set; }
        public List<PartNumbers> PartsNotDelivered { get; set; }
        public List<PartNumbers> PartsNotAvailable { get; set; }
        public DateTime Timestamp { get; set; }
    }
}