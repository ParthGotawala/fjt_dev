using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DebitMemoDetail
    {
        public string partNumber { get; set; }
        public string description { get; set; }
        public decimal? quantity { get; set; }
        public decimal? invoicePrice { get; set; }
        public decimal? extendedPrice { get; set; }
        public string approveNote { get; set; }
    }
}