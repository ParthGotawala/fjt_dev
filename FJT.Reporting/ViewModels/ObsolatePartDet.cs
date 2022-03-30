using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ObsolatePartDet
    {
        public virtual ICollection<ObsolatePartDetail> obsoletePartDetails { get; set; }
        public virtual ICollection<alternatePartDetForObsoletePartReportModel> alternatePartDetForObsoletePartReportDetail { get; set; }
        public virtual ICollection<rohsPartDetForObsoletePartReportModel> rohsPartDetForObsoletePartReportDetail { get; set; }
        public virtual ICollection<AssemblyManualPartDetailViewModel> assemblyManualPartDetailViewModel { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
        public string additionalNotes { get; set; }
        public virtual ICollection<RohsPartDetailViewModel> RohsPartDetail { get; set; }
    }
}