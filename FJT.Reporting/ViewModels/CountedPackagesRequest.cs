using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CountedPackagesRequest
    {
        public string TransactionID { get; set; }
        public List<CountedPackages> CountedPackages { get; set; }
    }
}