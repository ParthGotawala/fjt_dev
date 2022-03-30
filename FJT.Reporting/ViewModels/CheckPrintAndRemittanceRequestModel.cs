using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CheckPrintAndRemittanceRequestModel
    {
        public int paymentId { get; set; }
        public bool isRemittanceReport { get; set; }
    }
}