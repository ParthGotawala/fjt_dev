using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DeliverNotificationRequest
    {
        public string TransactionID { get; set; }
        public string ReelBarcode { get; set; }
        public string PartNumber { get; set; }
        public int Quantity { get; set; }
        public DateTime Timestamp { get; set; }
        public string Towered { get; set; }
        public string JobID { get; set; }
        public int? Msd { get; set; }
        public string MsdLevel { get; set; }
        public string Location { get; set; }
    }
}