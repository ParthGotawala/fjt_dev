using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SalesOrderMstDet
    {
        public int? sDetID { get; set; }
        public int? status { get; set; }
        public string salesOrderNumber { get; set; }
        public string revision { get; set;}
        public string poNumber { get; set; }
        public DateTime? poDate { get; set; }
        public DateTime? soDate { get; set; }
        public string customer { get; set; }
        public string shippingMethod { get; set; }
        public string paymentMethod { get; set; }
        public string shippingAddress { get; set; }
        public string billingAddress { get; set;}
        public string strpoDate { get; set;}
        public string strsoDate { get; set;}
        public string printDate { get; set; }
        public string termsAndCondition { get; set; }
        public string fob { get; set; }
        public string salesCommissionPerson { get; set; }
        public string intermediateShippingAddress { get; set; }
        public string shippingComment { get; set; }
        public string packingSlipComment { get; set; }
        public string docNumber { get; set; }
        public string serialNumber { get; set; }
        public string blanketPOText { get; set; }
        public int? blanketPOOption { get; set; }
        public bool isBlanketPO { get; set; }
    }
}