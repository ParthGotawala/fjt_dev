using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.Reporting.Models
{
    [Table("rfq_assy_quote_submitted_assydetail")]
    public class RFQ_Assy_Quote_Submitted_Assydetail
    {
        [Key]
        public int id { get; set; }
        public int? refSubmittedQuoteID { get; set; }
        public int? rfqAssyID { get; set; }
        public int? qty { get; set; }
        public int? turnTime { get; set; }
        public string turnType { get; set; }
        public decimal? materialCost { get; set; }
        public decimal? materialLeadTime { get; set; }
        public decimal? laborCost { get; set; }
        public decimal? laborLeadTime { get; set; }
        public decimal? additionalCost { get; set; }
        public decimal? customItemLeadTime { get; set; }
        public decimal? unitPrice { get; set; }
        public decimal? totalLeadTime { get; set; }
        public decimal? extendedCost { get; set; }
        public decimal? excessMaterialCost { get; set; }
        public decimal? additionalCostDetail { get; set; }
        public bool isDeleted { get; set; }
        public string createdBy { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedBy { get; set; }
        public string updatedAt { get; set; }
        public string deletedBy { get; set; }
        public DateTime deletedAt { get; set; }
        public decimal? nreCost { get; set; }
        public decimal? nreDays { get; set; }
        [NotMapped]
        public int? turntimedays { get; set; }
        public string nretoolingdescription { get; set; }
        public string priceGroup { get; set; }
    }
}