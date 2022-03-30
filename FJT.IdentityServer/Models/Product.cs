using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.IdentityServer.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [StringLength(100)]
        public string ProductName { get; set; }
        public decimal? Price { get; set; }
        [StringLength(20)]
        public string Category { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime? CreatedAt { get; set; }
        [StringLength(255)]
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }
}
