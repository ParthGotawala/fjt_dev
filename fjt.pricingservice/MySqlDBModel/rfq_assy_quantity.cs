using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assy_quantity")]
    public partial class rfq_assy_quantity
    {
        public rfq_assy_quantity()
        {
            rfq_assy_quantity_turn_time = new HashSet<rfq_assy_quantity_turn_time>();
            rfq_consolidate_mfgpn_lineitem_quantity = new HashSet<rfq_consolidate_mfgpn_lineitem_quantity>();
            rfq_assy_quantity_price_selection_setting= new HashSet<rfq_assy_quantity_price_selection_setting>();
        }
        [Key]
        public int id { get; set; }
        public int rfqAssyID { get; set; }
        public int requestQty { get; set; }
        public decimal? materialTotal { get; set; }
        public decimal? materialHandling { get; set; }
        public decimal? materialScrapPercentage { get; set; }
        public decimal? materialScrap { get; set; }
        public decimal? materialCarryingCostPercentage { get; set; }
        public decimal? materialCarryingCost { get; set; }
        public decimal? excessQtyTotal { get; set; }
        public decimal? excessTotalDollar { get; set; }
        public decimal? leadCostTotal { get; set; }
        public decimal? attritionRateTotal { get; set; }
        public int? copyQtyId { get; set; }
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
        public virtual rfq_assemblies rfq_assemblies { get; set; }
        public virtual ICollection<rfq_assy_quantity_turn_time> rfq_assy_quantity_turn_time { get; set; }
        public virtual ICollection<rfq_consolidate_mfgpn_lineitem_quantity> rfq_consolidate_mfgpn_lineitem_quantity { get; set; }
        public virtual ICollection<rfq_assy_quantity_price_selection_setting> rfq_assy_quantity_price_selection_setting { get; set; }
    }
}
