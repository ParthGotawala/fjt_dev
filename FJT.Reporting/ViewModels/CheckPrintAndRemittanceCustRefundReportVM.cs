using System.Collections.Generic;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittanceCustRefundReportVM
    {
        public virtual ICollection<CheckPrintAndRemittancePaymentDetails> PaymentDetails { get; set; }
        public virtual ICollection<CheckPrintAndRemittancePaymentCMDetails> RefundedPaymentCMDetails { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}