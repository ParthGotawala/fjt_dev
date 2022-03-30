using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Enums
{
    public enum ReportType
    {
        [Display(Name = "Summary")]
        Summary,

        [Display(Name = "Detail")]
        Detail
    }
}
