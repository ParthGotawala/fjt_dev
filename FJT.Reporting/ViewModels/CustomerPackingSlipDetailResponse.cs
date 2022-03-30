using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerPackingSlipDetailResponse
    {
        public int? cpID { get; set; }
        public int? cpDetID { get; set; }
        public int? partId { get; set; }
        public int? PSLine { get; set; }
        public string releaseNumber { get; set; }
        public string POLine { get; set; }
        public string PartNumber { get; set; }
        public string WorkOrderNumber { get; set; }
        public string Descripton { get; set; }
        public int? ShippedQty { get; set; }
        public int? OrderQty { get; set; }
        public int? RemainingQty { get; set; }
        public string UOM { get; set; }
        public string Revision { get; set; }
        public string DateCode { get; set; }
        public string Standards { get; set; }
        public int? partType { get; set; }
        public string ShippingComment { get; set; }
        public string DateCodeFormat { get; set; }
        public string poReleaseNumber { get; set; }
        public string refBlanketPONumber { get; set; }
        public string releaseNotes { get; set; }
    }
}