using System.Collections.Generic;
namespace FJT.Reporting.ViewModels
{
    public class SalesOrderReportDet
    {
        public virtual ICollection<SalesOrderMstDet> SalesOrderMstDets { get; set; }
        public virtual ICollection<SalesOrderDet> SalesOrderDets { get; set; }
        public virtual ICollection<SalesShippingMstDet> SalesShippingMstDets { get; set; }
        public virtual ICollection<SalesOrderTotalChargesDet> SalesOrderTotalChargesDet { get; set; }
    }
}