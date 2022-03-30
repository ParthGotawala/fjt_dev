using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittancePaymentDetails
    {
        public int id { get; set; }
        public string accountReference { get; set; }
        public string payToName { get; set; }
        public DateTime? paymentDate { get; set; }
        public string paymentNumber { get; set; }
        public decimal paymentAmount { get; set; }
        public string paymentAmountInWords { get; set; }
        public string payToAddress { get; set; }
        public string supplierName { get; set; }
        public string supplierAddress { get; set; }
        public string supplierEmail { get; set; }
        public string supplierFaxNumber { get; set; }
        public string bankAccountNo { get; set; }
        public string paymentType { get; set; }
        public string customerName { get; set; }
        public string customerAddress { get; set; }
        public string customerEmail { get; set; }
        public string customerFaxNumber { get; set; }
        public string refGencTransModeID { get; set; }
        public string remark { get; set; }
    }
}