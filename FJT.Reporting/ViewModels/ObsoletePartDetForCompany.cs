using System.Collections.Generic;

namespace FJT.Reporting.ViewModels
{
    public class ObsoletePartDetForCompany
    {
        public virtual ICollection<ObsoletePartDetailForCompany> obsoletePartDetailForCompany { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}