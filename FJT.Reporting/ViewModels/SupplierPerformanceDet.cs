using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SupplierPerformanceDet
    {
        public DateTime ReceiptDate { get; set; }
        public string Supplier { get; set; }
        public string ReceiptMonthYear { get; set; }
        public int? NoOfReceivedLine { get; set; }
        public int? NoOfDisputeLine { get; set; }
        public int? NoOfLineWaitingForInvoice { get; set; }
        public decimal? LinewiseDisputeRatio { get; set; }
        public decimal? TotalQtyReceived { get; set; }
        public decimal? DisputeLineQty { get; set; }
        public decimal? QtywiseDisputeRatio { get; set; }
    }
}