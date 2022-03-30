using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_consolidated_mfgpn_lineitem_alternate")]
    public class rfq_consolidated_mfgpn_lineitem_alternate
    {
        [Key]
        public int id { get; set; }
        [StringLength(50)]
        public string mfgPN { get; set; }
        public int consolidateID { get; set; }
        public int? mfgPNID { get; set; }
        public int? mfgCodeID { get; set; }
        [StringLength(30)]
        public string PIDCode { get; set; }

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
        public string customerApproval { get; set; }
        public virtual rfq_consolidated_mfgpn_lineitem rfq_consolidated_mfgpn_lineitem { get; set; }
    }
}
