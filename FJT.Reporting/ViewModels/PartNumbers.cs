using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class PartNumbers
    {
        public string PartNumber { get; set; }
        public DateTime Quantity { get; set; }
        public int CountPackages { get; set; }
    }
}