using System.Collections.Generic;

namespace FJT.Reporting.ViewModels
{
    public class ReversalPartDet
    {
        public virtual ICollection<ReversalPartDetail> reversalPartDetail { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}