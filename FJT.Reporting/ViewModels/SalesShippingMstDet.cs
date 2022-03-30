using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SalesShippingMstDet
    {
        public int? sDetID { get; set; }
        public int?  qty { get; set; }
        public DateTime? shippingDate { get; set; }
        public string shippingMethod { get; set; }
        public string description { get; set; }
        public string releaseNotes { get; set; }
        public int? releaseNum { get; set; }
        public string shippingAddress { get; set; }
        public string pDefaultDateFormat { get; set; }
        public DateTime? promisedShipDate { get; set; }
        public string strShippingDate { get; set; }
        public string strPromisedShipDate { get; set; }
        public string uom { get; set; }
        public DateTime? requestedDockDate { get; set; }
        public string strRequestedDockDate { get; set; }
        public string customerReleaseLine { get; set; }
        public string poReleaseNumber { get; set; }
    }
}