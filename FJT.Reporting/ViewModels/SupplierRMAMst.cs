using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SupplierRMAMst
    {
        public int? id { get; set; }
        public string poNumber { get; set; }
        public DateTime? poDate { get; set; }
        public string packingSlipNumber { get; set; }
        public DateTime? packingSlipDate { get; set; }
        public string rmaShippingAddress { get; set; }
        public string rmaMarkForAddress { get; set; }
        public string shippingMethod { get; set; }
        public string shippingInsurance { get; set; }
        public string status { get; set; }
        public string preparedBy { get; set; }
        public string emailAddress { get; set; }
        public string phExtension { get; set; }
        public string remark { get; set; }
    }
}