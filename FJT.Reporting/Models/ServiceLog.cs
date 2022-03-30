using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Models
{
    public class ServiceLog
    {
        public string error { get; set; }
        public string stackTrace { get; set; }
        public string Source { get; set; }
    }
}