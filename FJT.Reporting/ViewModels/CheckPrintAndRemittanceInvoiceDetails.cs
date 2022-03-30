using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittanceInvoiceDetails
    {
        public int id { get; set; }
        public string invoiceNumber { get; set; }
        public string refInvoiceNumber { get; set; }
        public string poNumber { get; set; }
        public DateTime? invoiceDate { get; set; }
        public string description { get; set; }
        public decimal extendedPrice { get; set; }
        public decimal discount { get; set; }
        public string receiptMemoType { get; set; }
    }
}