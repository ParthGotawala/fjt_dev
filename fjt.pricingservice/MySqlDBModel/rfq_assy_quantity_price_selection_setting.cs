using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assy_quantity_price_selection_setting")]
   public class rfq_assy_quantity_price_selection_setting
    {   
        [Key]
        public int id { get; set; }
        public int? qtyID { get; set; }
        public int? stock { get; set; }
        public int? price { get; set; }
        public bool? isCheckRequiredQty { get; set; }
        public bool? isLeadTime { get; set; }
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
        public string remark { get; set; }
        public virtual rfq_assy_quantity rfq_assy_quantity { get; set; }
        public decimal? stockPercentage { get; set; }
        public int? packagingID { get; set; }
        public string packaging { get; set; }
    }
}
