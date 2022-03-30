using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class rohsPartDetForObsoletePartReportModel
    {
        public string rohsReplacementPart { get; set; }
        public string rohsReplacementPartMFG { get; set; }
        public string rohsImage { get; set; }
        public decimal? TentativePrice { get; set; }
    }
}