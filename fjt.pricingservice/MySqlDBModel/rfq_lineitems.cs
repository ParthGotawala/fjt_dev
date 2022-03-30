using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_lineitems")]
   public partial class rfq_lineitems
    {
        public rfq_lineitems()
        {   
            rfq_lineitems_alternatepart = new HashSet<rfq_lineitems_alternatepart>();
        }
        [Key]
        public int id { get; set; }
        public int? rfqAssyBomID { get; set; }
        public int? rfqAssyID { get; set; }
        [StringLength(8)]
        public string lineID { get; set; }
        public int? qpa { get; set; }
        [StringLength(500)]
        public string refDesig { get; set; }
       
        [StringLength(150)]
        public string custPN { get; set; }
        public int? custPNID { get; set; }
        public int? uomID { get; set; }
        [StringLength(500)]
        public string description { get; set; }
        public double? level { get; set; }
        public bool? isInstall { get; set; }
        public bool? isPurchase { get; set; }
        public bool? isNoBidsPN { get; set; }
        public bool? isDraft { get; set; }
        public bool? isActive { get; set; }
        public int? partTypeID { get; set; }
        public int? partclassID { get; set; }
        public decimal? leadQty { get; set; }
        public decimal? attritionRate { get; set; }
        public decimal? totalQty { get; set; }
        public decimal? manualAdj { get; set; }
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
        [StringLength(2)]
        public string customerRev { get; set; }
        [StringLength(2)]
        public string flextronRev { get; set; }
        [StringLength(500)]
        public string customerDescription { get; set; }
        public decimal? numOfPosition { get; set; }
        public decimal? valueAddedCost { get; set; }
        public int? refRFQLineItemID { get; set; }
        public int? dnpQty { get; set; }
        public int? dnpDesig { get; set; }
        [StringLength(8)]
        public string org_lineID { get; set; }
        public int? org_qpa { get; set; }
        [StringLength(500)]
        public string org_refDesig { get; set; }
        [StringLength(150)]
        public string org_custPN { get; set; }
        [StringLength(100)]
        public string org_uomName { get; set; }
        public double? org_level { get; set; }
        public bool? org_isInstall { get; set; }
        public bool? org_isPurchase { get; set; }
        [StringLength(2)]
        public string org_customerRev { get; set; }
        [StringLength(500)]
        public string org_customerDescription { get; set; }
        public decimal? org_numOfPosition { get; set; }
        public string org_refLineID { get; set; }
        public bool? qpaDesignatorStep { get; set; }
        public virtual rfq_assemblies rfq_assemblies { get; set; }
        public virtual rfq_assy_bom rfq_assy_bom { get; set; }
        public virtual ICollection<rfq_lineitems_alternatepart> rfq_lineitems_alternatepart { get; set; }
    }
}
