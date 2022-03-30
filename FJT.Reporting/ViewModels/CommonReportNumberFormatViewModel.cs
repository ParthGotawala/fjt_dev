using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CommonReportNumberFormatViewModel
    {
        public CommonNumberFormatViewModel UnitPrice { get; set; }
        public CommonNumberFormatViewModel Unit { get; set; }
        public CommonNumberFormatViewModel Amount { get; set; }
        public class CommonNumberFormatViewModel
        {
            public string Decimal { get; set; }
            public string Step { get; set; }
            public string Report { get; set; }
        }
    }
}