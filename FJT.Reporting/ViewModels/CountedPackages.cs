using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CountedPackages
    {
        public string UniquePackageID { get; set; }
        public int CountedQuantity { get; set; }
        public int CountedStatus { get; set; }
    }
}