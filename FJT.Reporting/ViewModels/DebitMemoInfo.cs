using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DebitMemoInfo
    {
        public int id { get; set; }
        public string billingAddress { get; set; }
        public string debitMemoNumber { get; set; }
        public string debitMemoDate { get; set; }
        public string supplier { get; set; }
        public string poNumber { get; set; }
        public string refInvoiceNumber { get; set; }
        public string refInvoiceDate { get; set; }


    }
}