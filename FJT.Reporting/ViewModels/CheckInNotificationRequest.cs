using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckInNotificationRequest
    {
        public string TransactionID { get; set; }
        public string ReelBarcode { get; set; }
        public string PartNo { get; set; }
        public int? Quantity { get; set; }
        public int? Msd { get; set; }
        public string MsdLevel { get; set; }
        public string Location { get; set; }
        public string TowerID { get; set; }
    }
}