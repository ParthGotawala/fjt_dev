using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class SupplierRMADet
    {
        public int? prDetID { get; set; }
        public int packingSlipSerialNumber { get; set; }
        public string mfgName { get; set; }
        public string mfgPN { get; set; }
        public string remark { get; set; }
        public string revision { get; set; }
        public int? qty { get; set; }
        public string description { get; set; }
        public string uom { get; set; }
    }
}