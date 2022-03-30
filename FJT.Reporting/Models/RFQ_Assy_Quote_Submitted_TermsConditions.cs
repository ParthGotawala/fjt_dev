using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.Reporting.Models
{
    [Table("rfq_assy_quote_submitted_termsconditions")]
    public class RFQ_Assy_Quote_Submitted_TermsConditions
    {
        [Key]
        public int? id { get; set; }
        public int? RefSubmittedQuoteID { get; set; }
        public int? termsconditionCatID { get; set; }
        public int? termsconditionTypeValueID { get; set; }
        public string note { get; set; }
        public bool isDeleted { get; set; }
        public string createdBy { get; set; }
        public DateTime createdAt { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedAt { get; set; }
        public string deletedBy { get; set; }
        public DateTime? deletedAt { get; set; }
    }
}