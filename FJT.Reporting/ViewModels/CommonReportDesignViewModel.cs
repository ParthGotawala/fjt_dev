using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CommonReportDesignViewModel
    {
        public string fontSize { get; set; }
        public string fontFamily { get; set; }
        public string tableHeaderFontSize { get; set; }
        public string headerFontWeight { get; set; }
        public string RoHSImagesURL { get; set; }
        public string companyLogoURL { get; set; }
        public string ReportDefaultImagesPath { get; set; }
        public string HeaderTitleFontSize { get; set; }
        public string HeaderTitleFontFamily { get; set; }
        public string HeaderTitleFontColor { get; set; }
    }
}