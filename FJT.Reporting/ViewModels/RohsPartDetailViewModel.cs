using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class RohsPartDetailViewModel
    {
        public int customerID { get; set; }
        public int rfqalternatePartID { get; set; }
        public string MFG { get; set; }
        public string mfgPn { get; set; }
        public string PartStatus { get; set; }
        public decimal? rohsalternateTentativePrice { get; set; }
        public string rohsalternatePart { get; set; }
        public string rohsalternateMFG { get; set; }
        public int mfgPNId { get; set; }
        public int lineitemid { get; set; }
    }
}