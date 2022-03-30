using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DeliverMaterialResponse
    {
        public string TransactionID { get; set; }
        public int ErrorCode { get; set; }
        public string JobID { get; set; }
        public string TowerID { get; set; }
        public List<string> ReelBarcodesDelevired { get; set; }
        public List<string> ReelBarcodesNotDelivered { get; set; }
    }
}