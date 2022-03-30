using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittanceReportDetail
    {
        public virtual ICollection<CheckPrintAndRemittancePaymentDetails> PaymentDetails { get; set; }
        public virtual ICollection<CheckPrintAndRemittanceInvoiceDetails> InvoiceDetails { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}