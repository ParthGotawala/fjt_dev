using System;

namespace FJT.Reporting.ViewModels
{
    public class ReversalPartDetail
    {
        public string Customer { get; set; }
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
        public bool isReversal { get; set; }
        public DateTime? reversalDate { get; set; }
        public string AlternatePart { get; set; }
        public string alternatePartMFG { get; set; }
        public int mfgPNId { get; set; }
    }
}