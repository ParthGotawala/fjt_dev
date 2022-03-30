using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ObsolatePartDetail
    {
        public string Customer { get; set; }
        public int rfqalternatePartID { get; set; }
        public string AssyPN { get; set; }
        public string AssyID { get; set; }
        public string mfgCode { get; set; }
        public string mfgName { get; set; }
        public string mfgPN { get; set; }
        public string AssyRev { get; set; }
        public string CPN { get; set; }
        public string CPNRev { get; set; }
        public string PartStatus { get; set; }
        public decimal? TentativePrice { get; set; }
        public decimal? QPA { get; set; }
        public decimal? LineID { get; set; }
        public DateTime? LTBDate { get; set; }
        public DateTime? EOLDate { get; set; }
        public string AlternatePart { get; set; }
        public string alternatePartMFG { get; set; }
        public string rohsReplacementPart { get; set; }
        public string rohsReplacementPartMFG { get; set; }
        public int mfgPNId { get; set; }
        public int lineitemid { get; set; }
        public int partID { get; set; }
        public string rohsImage { get; set; }
        public int? rohsgroupID { get; set; }
        public decimal? rohsalternateTentativePrice { get; set; }
        public decimal? alternateTentativePrice { get; set; }

    }
}