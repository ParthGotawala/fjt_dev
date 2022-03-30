using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PartUsageDetailMain
    {
        public virtual ICollection<PartUsageDet> partUsageDet { get; set; }
        public virtual ICollection<AssyWisePartUsageDetail> assyWisePartUsageDetail { get; set; }
        public virtual ICollection<MonthWisePartUsageDetail> monthWisePartUsageDetail { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}