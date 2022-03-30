using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerInvoiceUMIDList
    {
        public string UId { get; set; }
        public string MfrName { get; set; }
        public string PartNumber { get; set; }
        public string PackagingName { get; set; }
        public string DateCode { get; set; }
        public int? ShippedQty { get; set; }
        public string PartRev { get; set; }
    }
}