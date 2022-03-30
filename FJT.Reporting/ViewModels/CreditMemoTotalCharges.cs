using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CreditMemoTotalCharges
    {
        public decimal totalLinePrice { get; set; }
        public decimal? totalRecvAmt { get; set; }
        public decimal? totalCMRefundedAmt { get; set; }
    }
}