using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ReelRequestResponse
    {
        public string TransactionID { get; set; }
        public int ErrorCode { get; set; }
        public string ReelBarcode { get; set; }
        public string PartNo { get; set; }
        public int? Quantity { get; set; }
        public int? Msd { get; set; }
        public string MsdLevel { get; set; }
        public string Location { get; set; }
    }
}