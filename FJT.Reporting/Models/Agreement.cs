using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FJT.Reporting.Models
{
    [Table("agreement")]
    public class Agreement
    {
        [Key]
        public int agreementID { get; set; }
        public int agreementTypeID { get; set; }
        public string agreementContent { get; set; }
        public int version { get; set; }
        public string system_variables { get; set; }
        public string agreementSubject { get; set; }
        public bool? isPublished { get; set; }
        public DateTime publishedDate { get; set; }
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