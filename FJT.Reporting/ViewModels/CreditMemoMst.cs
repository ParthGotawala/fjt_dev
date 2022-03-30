using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CreditMemoMst
    {
        public int? id { get; set; }
        public string invoiceNumber { get; set; }
        public DateTime? invoiceDate { get; set; }
        public string creditMemoNumber { get; set; }
        public DateTime? creditMemoDate { get; set; }
        public string refDebitMemoNumber { get; set; }
        public DateTime? refDebitMemoDate { get; set; }
        public string poNumber { get; set; }
        public DateTime? poDate { get; set; }
        public string customerSystemID { get; set; }
        public string accountRef { get; set; }
        public int? status { get; set; }
        public string billingAddress { get; set; }
        public string shippingAddress { get; set; }
        public string paymentMethod { get; set; }
        public string shippingMethod { get; set; }
        public string legalnumber { get; set; }
        public string preparedBy { get; set; }
        public string emailAddress { get; set; }
        public string phExtension { get; set; }
        public string packingSlipComment { get; set; }
        public string rmaNumber { get; set; }
        public string docNumber { get; set; }
        public string creditMemoVersion { get; set; }
    }
}