using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assy_quantity_turn_time")]
    public partial class rfq_assy_quantity_turn_time
    {
        [Key]
        public int id { get; set; }
        public int rfqAssyQtyID { get; set; }
        public int turnTime { get; set; }
        [StringLength(1)]
        public string unitOfTime { get; set; }
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
        public virtual rfq_assy_quantity rfq_assy_quantity { get; set; }
    }
}
