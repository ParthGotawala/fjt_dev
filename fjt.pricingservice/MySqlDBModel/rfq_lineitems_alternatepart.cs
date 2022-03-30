using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_lineitems_alternatepart")]
    public partial class rfq_lineitems_alternatepart
    {
        [Key]
        public int id { get; set; }
        public int? rfqLineItemsID { get; set; }
        [StringLength(250)]
        public string distributor { get; set; }
        public int? distMfgCodeID { get; set; }
        [StringLength(150)]
        public string distPN { get; set; }
        public int? distMfgPNID { get; set; }
        [StringLength(500)]
        public string mfgCode { get; set; }
        public int? mfgCodeID { get; set; }
        [StringLength(150)]
        public string mfgPN { get; set; }
        public int? mfgPNID { get; set; }
        [StringLength(500)]
        public string description { get; set; }
        public bool? isActive { get; set; }
        public bool? isApproved { get; set; }
        public bool? isNoBidsPN { get; set; }
        public bool? isDraft { get; set; }
        public int? RoHSStatusID { get; set; }
        public int? copyAlternetPartID { get; set; }
        public bool isDeleted { get; set; }
        [StringLength(255)]
        public string createdBy { get; set; }
        public DateTime createdAt { get; set; }
        [StringLength(255)]
        public string updatedBy { get; set; }
        public DateTime? updatedAt { get; set; }
        [StringLength(255)]
        public string deletedBy { get; set; }
        public DateTime? deletedAt { get; set; }
        public int? rfqAssyBomID { get; set; }

        public bool? mfgVerificationStep { get; set; }
        public bool? mfgDistMappingStep { get; set; }
        public bool? mfgCodeStep { get; set; }
        public bool? distVerificationStep { get; set; }
        public bool? distCodeStep { get; set; }
        public bool? getMFGPNStep { get; set; }

        public virtual rfq_lineitems rfq_lineitems { get; set; }
    }
}
