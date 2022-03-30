using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DeliverMaterialRequest
    {
        public string Transactionid { get; set; }
        public DateTime Timestamp { get; set; }
        public string TowerID { get; set; }
        public List<string> ReelBarcodes { get; set; }
    }
}