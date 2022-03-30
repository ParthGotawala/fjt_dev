using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CreditMemoRequestModel
    {
        public int id { get; set; }
        public string termsAndCondition { get; set; }
        public string invoiceDisclaimer { get; set; }
    }
}