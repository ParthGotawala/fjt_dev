using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class DebitMemoReportDet
    {
        public virtual ICollection<DebitMemoInfo> debitMemoInfo { get; set; }
        public virtual ICollection<DebitMemoDetail> debitMemoDetail { get; set; }
    }
}