using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.Reporting.Models
{
    [Table("rfq_assemblies_quotation_submitted")]
    public class RFQ_Assemblies_Quotation_Submitted
    {
        [Key]
        public int id { get; set; }
        public int? rfqAssyID { get; set; }
        [StringLength(50)]
        public string quoteNumber { get; set; }
        public DateTime? quoteInDate { get; set; }
        public DateTime? quoteDueDate { get; set; }
        public DateTime? quoteSubmitDate { get; set; }
        [StringLength(25)]
        public string bomInternalVersion { get; set; }
        public string BOMIssues { get; set; }
        public string OtherNotes { get; set; }
        public string promotions { get; set; }
        public int? custShippingAddressID { get; set; }
        public int? custBillingAddressID { get; set; }
        public int? custTermsID { get; set; }
        [StringLength(25)]
        public string bomLastVersion { get; set; }
    }
}