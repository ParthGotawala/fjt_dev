using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerInvoiceReportDet
    {
        public virtual ICollection<CustomerInvoiceMst> CustomerInvoiceMst { get; set; }
        public virtual ICollection<CustomerInvoiceDet> CustomerInvoiceDet { get; set; }
        public virtual ICollection<CustomerInvoiceTotalChargesDet> CustomerInvoiceOtherChargesDet { get; set; }
        public virtual ICollection<CustomerInvoiceUMIDList> CustomerInvoiceUMIDList { get; set; }
    }
}