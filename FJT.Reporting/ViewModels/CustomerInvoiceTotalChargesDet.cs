using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerInvoiceTotalChargesDet
    {
        public decimal totalLinePrice { get; set; }
        public decimal totalLineMiscPrice { get; set; }
        public decimal? totalRecvAmt { get; set; }
    }
}