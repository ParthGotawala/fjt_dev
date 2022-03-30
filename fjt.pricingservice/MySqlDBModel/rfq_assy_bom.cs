using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assy_bom")]
    public partial class rfq_assy_bom
    {
        public rfq_assy_bom()
        {
            rfq_lineitems = new HashSet<rfq_lineitems>();
        //    rfq_consolidated_mfgpn_lineitem = new HashSet<rfq_consolidated_mfgpn_lineitem>();
        }
        [Key]
        public int id { get; set; }
        public int reqAssyID { get; set; }
        public bool? isActive { get; set; }
        [StringLength(500)]
        public string description { get; set; }
        [StringLength(50)]
        public string bomNumber { get; set; }
        public bool isDeleted { get; set; }
        [StringLength(255)]
        public string createdBy { get; set; }
        public DateTime createdAt { get; set; }
        [StringLength(255)]
        public string updatedBy { get; set; }
        public DateTime updatedAt { get; set; }
        [StringLength(255)]
        public string deletedBy { get; set; }
        public DateTime? deletedAt { get; set; }
        public bool? isBOMVerified { get; set; }
        public virtual ICollection<rfq_lineitems> rfq_lineitems { get; set; }
      //  public virtual ICollection<rfq_consolidated_mfgpn_lineitem> rfq_consolidated_mfgpn_lineitem { get; set; }
    }
}
