using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    [Table("user_agreement")]
    public class UserAgreement
    {
        [key]
        public int userAgreementID { get; set; }

        [StringLength(255)]
        public string userID { get; set; }

        public int agreementID { get; set; }

        public DateTime? agreedDate { get; set; }

        public bool isDeleted { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime? updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        [StringLength(255)]
        public string createByRole { get; set; }

        [StringLength(255)]
        public string updateByRole { get; set; }

        [StringLength(255)]
        public string deleteByRole { get; set; }

        public string signaturevalue { get; set; }

        [ForeignKey("agreementID")]
        public virtual Agreement agreement { get; set; }

        [ForeignKey("userID")]
        public virtual ApplicationUser aspnetusers { get; set; }
    }
}
