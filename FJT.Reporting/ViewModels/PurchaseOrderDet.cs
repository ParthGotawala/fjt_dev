using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseOrderDet
    {
        public int? pODetID { get; set; }
        public int? lineID { get; set; }
        public string mfgName { get; set; }
        public string mfgPN { get; set; }
        public string supplierPN { get; set; }
        public string revision { get; set; }
        public string rohsName { get; set; }
        public string supplierQuoteNumber { get; set; }
        public string internalRef { get; set; }
        public string packagingType { get; set; }
        public int? qty { get; set; }
        public string uom { get; set; }
        public decimal price { get; set; }
        public decimal extPrice { get; set; }
        public string description { get; set; }
        public int serialNumber { get; set; }
        public string lineComment { get; set; }
        public int? receivedQty { get; set; }
    }
}