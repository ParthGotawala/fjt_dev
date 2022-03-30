using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseOrderTotalChargesDet
    {
        public decimal totalLinePrice { get; set; }
        public decimal totalLineMiscPrice { get; set; }
        public decimal totalPOMiscPrice { get; set; }
    }
}