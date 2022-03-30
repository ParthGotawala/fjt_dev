using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_consolidated_mfgpn_lineitem")]
    public class rfq_consolidated_mfgpn_lineitem
    {
        public rfq_consolidated_mfgpn_lineitem()
        {
            rfq_consolidate_mfgpn_lineitem_quantity = new HashSet<rfq_consolidate_mfgpn_lineitem_quantity>();
            rfq_consolidated_mfgpn_lineitem_alternate = new HashSet<rfq_consolidated_mfgpn_lineitem_alternate>();
            //rfq_lineitem_autopricingstatus = new HashSet<rfq_lineitem_autopricingstatus>();
        }
        [Key]
        public int id { get; set; }
     //   public int rfqAssyBomID { get; set; }
        [StringLength(8)]
        public string lineID { get; set; }
        public bool? isInstall { get; set; }
        public bool? isPurchase { get; set; }
        //public decimal? qty { get; set; }
        public int? rfqAssyID { get; set; }
        public int? partTypeID { get; set; }
        public int? partClassID { get; set; }
        public decimal? leadQty { get; set; }
        public decimal? attritionRate { get; set; }
        public bool? isActive { get; set; }
        public int? rfqLineItemID { get; set; }
        public int? uomID { get; set; }
        public bool? isNoBidsPN { get; set; }
        public bool? isDraft { get; set; }
        public decimal? leads { get; set; }
        public decimal? totalQty { get; set; }
        public decimal? requestQty { get; set; }
        public decimal? originalTotalQty { get; set; }
        public double? qpa { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public DateTime? deletedAt { get; set; }
        public string createdBy { get; set; }
        public string updatedBy { get; set; }
        public string deletedBy { get; set; }
        public bool? isDeleted { get; set; }
        public bool isMultiple { get; set; }
        public decimal? valueAddedCost { get; set; }
        public decimal? numOfPosition { get; set; }
        public int? numOfRows { get; set; }
   //     public virtual rfq_assy_bom rfq_assy_bom { get; set; }
        public virtual rfq_assemblies rfq_assemblies { get; set; }
        public virtual ICollection<rfq_consolidate_mfgpn_lineitem_quantity> rfq_consolidate_mfgpn_lineitem_quantity { get; set; }
        public virtual ICollection<rfq_consolidated_mfgpn_lineitem_alternate> rfq_consolidated_mfgpn_lineitem_alternate { get; set; }
        //public virtual ICollection<rfq_lineitem_autopricingstatus> rfq_lineitem_autopricingstatus { get; set; }
    }
}
