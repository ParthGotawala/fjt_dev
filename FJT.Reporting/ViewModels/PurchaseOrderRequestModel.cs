using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PurchaseOrderRequestModel
    {
        public int id { get; set; }
        public string companyName { get; set; }
        public string termsAndCondition { get; set; }
    }
}