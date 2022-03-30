using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_consolidate_mfgpn_lineitem_quantity")]
  public  class rfq_consolidate_mfgpn_lineitem_quantity
    {
        [Key]
        public int id { get; set; }
        public int qtyID { get; set; }
        public decimal? finalPrice { get; set; }
        public int? consolidateID { get; set; }
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
      
        [StringLength(100)]
        public string selectionMode { get; set; }
        [StringLength(100)]
        public string selectedMpn { get; set; }
        [StringLength(255)]
        public string supplier { get; set; }
        public decimal? unitPrice { get; set; }
        public int? min { get; set; }
        public int? mult { get; set; }
        public int? currentStock { get; set; }
        public int? leadTime { get; set; }
        public int? supplierStock { get; set; }
        public int? grossStock { get; set; }
        public string pricingSuppliers { get; set; }
        [StringLength(40)]
        public string selectedPIDCode { get; set; }
        public int? apiLead { get; set; }
        public int? componentID { get; set; }
        public string packaging { get; set; }
        public int? availableInternalStock { get; set; }
        public DateTime? availableInternalStockTimeStamp { get; set; }
        public virtual rfq_consolidated_mfgpn_lineitem rfq_consolidated_mfgpn_lineitem { get; set; }
        public virtual rfq_assy_quantity rfq_assy_quantity { get; set; }
    }
}
