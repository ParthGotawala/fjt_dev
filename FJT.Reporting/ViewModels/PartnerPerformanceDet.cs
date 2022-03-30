using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PartnerPerformanceDet
    {
        public DateTime ReceiptDate { get; set; }
        public string Supplier { get; set; }
        public string ReceiptMonthYear { get; set; }
        public int? NoOfReceivedLine { get; set; }
        public int? NoOfDisputeLine { get; set; }
        public decimal? LinewiseDisputeRatio { get; set; }
        public decimal? QualityGrade { get; set; }
        public decimal? TotalPartReceived { get; set; }
        public decimal? TotalOnTimePartReceived { get; set; }
        public decimal? PartsOnTimeRatio { get; set; }
        public decimal? DiliveryGrade { get; set; }


    }
}