using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class LaborComparisonEsimatedvsActualDetail
    {
        public virtual ICollection<LaborComparisonEsimatedvsActualDet> LaborComparisonEsimatedvsActualDet { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
    }
}