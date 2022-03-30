using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class RFQ_Price_Group_Detail
    {
        public int? priceGroupID { get; set; }
        public string priceGroup { get; set; }
        public int? qty { get; set; }
        public int rfqAssyID { get; set; }
        public string mfgPN { get; set; }
        public string PIDCode { get; set; }
        public string rohsName { get; set; }
        public string rohsIcon { get; set; }
    }
}