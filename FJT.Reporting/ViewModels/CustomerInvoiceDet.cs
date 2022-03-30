using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerInvoiceDet
    {

        public int? refDetID { get; set; }
        public int? lineID { get; set; }
        public string mfgName { get; set; }
        public string mfgPN { get; set; }
        public string revision { get; set; }
        public int? qty { get; set; }
        public decimal price { get; set; }
        public decimal extPrice { get; set; }
        public string description { get; set; }
        public string uom { get; set; }
        public string standards { get; set; }
        public string rohsName { get; set; }
        public string unitMaser { get; set; }
        public string releaseNumber { get; set; }
        public string custPOLineID { get; set; }
        public int? partId { get; set; }
        public string lineComment { get; set; }
        public string releaseNotes { get; set; }
    }
}