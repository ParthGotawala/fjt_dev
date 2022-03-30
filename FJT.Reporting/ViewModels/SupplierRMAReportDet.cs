using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SupplierRMAReportDet
    {
        public virtual ICollection<SupplierRMAMst> SupplierRMAMst { get; set; }
        public virtual ICollection<SupplierRMADet> SupplierRMADet { get; set; }
    }
}