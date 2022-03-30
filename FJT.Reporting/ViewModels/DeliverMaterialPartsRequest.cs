using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DeliverMaterialPartsRequest
    {
        public string Transactionid { get; set; }
        public DateTime Timestamp { get; set; }
        public bool InquiryOnly { get; set; }
        public List<PartNumbers> PartNumbers { get; set; }
    }
}