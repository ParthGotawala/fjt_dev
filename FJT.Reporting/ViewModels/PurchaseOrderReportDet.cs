using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseOrderReportDet
    {
        public virtual ICollection<PurchaseOrderMstDet> PurchaseOrderMstDets { get; set; }
        public virtual ICollection<PurchaseOrderDet> PurchaseOrderDets { get; set; }
        public virtual ICollection<PurchaseLineReleaseDet> PurchaseLineReleaseDets { get; set; }
        public virtual ICollection<PurchaseOrderTotalChargesDet> PurchaseOrderTotalChargesDet { get; set; }
        public virtual ICollection<PurchaseOrderLineRequirementDet> PurchaseOrderLineRequirementDet { get; set; }
    }
}