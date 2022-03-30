using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Enums
{
    public enum ReportCreateType
    {
        [Display(Name = "From Template")]
        CloneFromTemplate,      // Default header-footer report

        [Display(Name = "From Report")]
        CloneFromReport         // Copy from exsisting report.
    }
}
