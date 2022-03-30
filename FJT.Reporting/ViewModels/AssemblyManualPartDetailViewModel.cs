using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class AssemblyManualPartDetailViewModel
    {
        public string mfgPN { get; set; }
        public string PIDCode { get; set; }
        public string rohsIcon { get; set; }
        public string partStatus { get; set; }
        public string CPN { get; set; }
        public string CPNRev { get; set; }
        public string MFR { get; set; }
        public decimal lineID { get; set; }

    }
}