using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assemblies")]
   public partial class rfq_assemblies
    {
        public rfq_assemblies()
        {
            rfq_assy_quantity = new HashSet<rfq_assy_quantity>();
            rfq_lineitems = new HashSet<rfq_lineitems>();
            rfq_consolidated_mfgpn_lineitem = new HashSet<rfq_consolidated_mfgpn_lineitem>();
        }
        [Key]
        public int id { get; set; }
        public int rfqrefID { get; set; }
        public int? assyRevID { get; set; }
        public string assyNote { get; set; }
        public bool active { get; set; }
        public string quoteNote { get; set; }
        [StringLength(50)]
        public string assyCloseNote { get; set; }
        public int? assyClosedReasonID { get; set; }
        public DateTime? assyClosedDate { get; set; }
        public bool IsRepeated { get; set; }
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
        public virtual ICollection<rfq_assy_quantity> rfq_assy_quantity { get; set; }
        public virtual ICollection<rfq_lineitems> rfq_lineitems { get; set; }
        public virtual ICollection<rfq_consolidated_mfgpn_lineitem> rfq_consolidated_mfgpn_lineitem { get; set; }
    }
}
