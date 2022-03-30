using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.Reporting.Models
{
    [Table("systemconfigrations")]
    public class SystemConfigrations
    {
        [Key]
        public int id { get; set; }
        [StringLength(100)]
        public string key { get; set; }
        [StringLength(500)]
        public string values { get; set; }
        [StringLength(50)]
        public string clusterName { get; set; }
        public bool? isEncrypted { get; set; }
        public bool? isActive { get; set; }
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
    }
}