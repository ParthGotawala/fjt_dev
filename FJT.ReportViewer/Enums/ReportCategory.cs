using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Enums
{
    public enum ReportCategory
    {
        [Display(Name = "SaticReport")]
        SaticReport = 1,

        [Display(Name = "EndUserReport")]
        EndUserReport = 2,

        [Display(Name = "TemplateReport")]
        TemplateReport = 3,

        [Display(Name = "SystemGeneratedReport")]
        SystemGeneratedReport = 4
    }
}
