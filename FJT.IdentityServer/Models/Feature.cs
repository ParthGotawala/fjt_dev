using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.IdentityServer.Models
{
    [Table("features")]
    public class Feature
    {
        [Key]
        public int Id { get; set; }
        [StringLength(500)]
        public string Name { get; set; }
        [StringLength(50)]
        public string DataType { get;set; }
        [StringLength(50)]
        public string DefaultValue { get; set; }
        [StringLength(50)]
        public string FeatureLevel { get; set; }
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
