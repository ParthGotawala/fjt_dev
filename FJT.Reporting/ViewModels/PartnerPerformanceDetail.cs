using System.Collections.Generic;

namespace FJT.Reporting.ViewModels
{
    public class PartnerPerformanceDetail
    {
        public virtual ICollection<PartnerPerformanceDet> PartnerPerformanceDet { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}