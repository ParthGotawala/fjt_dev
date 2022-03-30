using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseOrderMstDet
    {
        public int? id { get; set; }
        public string poNumber { get; set; }
        public string poRevision { get; set; }
        public DateTime? poDate { get; set; }
        public string supplierAddress { get; set; }
        public string shippingAddress { get; set; }
        public string shippingMethod { get; set; }
        public string paymentMethod { get; set; }
        public string shippingInsurance { get; set; }
        public string intermediateAddress { get; set; }
        public string freeOnBoard { get; set; }
        public string poComment { get; set; }
        public int status { get; set; }
        public string preparedBy { get; set; }
        public string emailAddress { get; set; }
        public string phExtension { get; set; }
        public string serialNumber { get; set; }
        public string poWorkingStatus { get; set; }
        public string docNumber { get; set; }
    }
}