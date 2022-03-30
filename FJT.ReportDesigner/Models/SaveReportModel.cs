using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Models
{
    public class SaveReportModel
    {
        public string ReportGUID { get; set; }
        public string ReportName { get; set; }
        public string SaveReportMode { get; set; } 
        public byte[] ReportByteData { get; set; }
        public string PublishVersion { get; set; }
        public string ReportStatus { get; set; }

        public string Error { get; set; }
    }
}
