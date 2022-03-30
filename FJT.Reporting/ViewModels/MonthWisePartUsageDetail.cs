using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class MonthWisePartUsageDetail
    {
        public string usageMonthYear { get; set; }
        public int partID { get; set; }
        public decimal? WithPackagingUsageQty { get; set; }
        public decimal? UsageQuantity { get; set; }
        public decimal? UsageUnits { get; set; }
        public decimal? WithPackagingUsageUnits { get; set; }
        public string UOM { get; set; }
        public decimal? ScrapedQty { get; set; }
        public decimal? BuyQty { get; set; }
    }
}