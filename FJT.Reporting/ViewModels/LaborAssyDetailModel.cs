using System;

namespace FJT.Reporting.ViewModels
{
    public class LaborAssyDetailModel
    {
        public decimal? perAssyPrice { get; set; }
        public int rfqAssyQtyID { get; set; }
        public string MountingType { get; set; }
        public string AssyName { get; set; }
        public int requestQty { get; set; }
        public DateTime? quoteInDate { get; set; }
    }
}