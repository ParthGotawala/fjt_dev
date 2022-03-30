using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Enums
{
    public enum ReportStatus
    {
        [Display(Name = "D")]
        Draft,

        [Display(Name = "P")]
        Published
    }
}
