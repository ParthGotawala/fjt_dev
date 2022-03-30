using System.Collections.Generic;
namespace FJT.Reporting.ViewModels
{
    public class WorkOrderReportDet
    {
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}