using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseLineReleaseDet
    {
        public int? pODetID { get; set; }
        public int? releaseNumber { get; set; }
        public int? qty { get; set; }
        public DateTime? shippingDate { get; set; }
        public DateTime? promisedShipDate { get; set; }
        public string releaseNotes { get; set; }
        public int? openQty { get; set; }
        public int? receivedQty { get; set; }
    }
}