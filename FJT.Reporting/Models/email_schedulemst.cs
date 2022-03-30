using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FJT.Reporting.Models
{
    [Table("email_schedulemst")]
    public partial class email_schedulemst
    {
        [Key]
        public int id { get; set; }
        public int? reportID { get; set; }
        public string entity { get; set; }
        public int? customerID { get; set; }
        public int? schedule { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdAt { get; set; }
        public string craetedBy { get; set; }
        public DateTime updatedAt { get; set; }
        public string updatedBy { get; set; }
        public DateTime? deletedAt { get; set; }
        public string deletedBy { get; set; }

    }
}