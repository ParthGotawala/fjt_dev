using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerInvoiceMst
    {
        public int? id { get; set; }
        public string invoiceNumber { get; set; }
        public DateTime? invoiceDate { get; set; }
        public string packingSlipNumber { get; set; }
        public DateTime? packingSlipDate { get; set; }
        public string poNumber { get; set; }
        public DateTime? poDate { get; set; }
        public string billingAddress { get; set; }
        public string shippingAddress { get; set; }
        public string salesPerson { get; set; }
        public string shippingMethod { get; set; }
        public string paymentMethod { get; set; }
        public string freeOnBoard { get; set; }
        public string legalnumber { get; set; }
        public int? status { get; set; }
        public string preparedBy { get; set; }
        public string emailAddress { get; set; }
        public string phExtension { get; set; }
        public DateTime? dueDate { get; set; }
        public string trackingNumber { get; set; }
        public string intermediateAddress { get; set; }
        public string customerSystemID { get; set; }
        public string accountRef { get; set; }
        public string packingSlipComment { get; set; }
        public string invoiceVersion { get; set; }
        public string docNumber { get; set; }
        public int? subStatus { get; set; }
    }
}