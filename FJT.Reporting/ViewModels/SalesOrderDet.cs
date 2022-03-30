using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SalesOrderDet
    {
        public int? sDetID { get; set; }
        public string PIDCode { get; set; }
        public string mfgPN { get; set;}
        public string description { get; set; }
        public int? qty { get; set; }
        public decimal price { get; set; }
        public decimal extPrice { get; set; }
        public DateTime? materialTentitiveDocDate { get; set; }
        public int? shippingQty { get; set; }
        public String rohsIcon { get; set; }
        public string submittedBy { get; set; }
        public string emailAddress { get; set; }
        public string rohsStatus { get; set;}
        public string strmaterialTentitiveDocDate { get; set; }
        public int? lineID { get; set; }
        public string custPOLineNumber { get; set; }
        public int serialNumber { get; set; }
        public string remark { get; set; }
        public string phExtension { get; set; }
        public string revision { get; set; }
        public string quoteNumber { get; set; }
        public string unitMeaser { get; set; }
        public string lineComment { get; set; }
        public string blanketPONumber { get; set; }
    }
}