using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittancePaymentCMDetails
    {
        public int id { get; set; }
        public string paymentCMNumber { get; set; }
        public DateTime? paymentCMDate { get; set; }
        public decimal? refundedAmountForPaymentCM { get; set; }
        public string commentForPaymentCM { get; set; }
    }
}