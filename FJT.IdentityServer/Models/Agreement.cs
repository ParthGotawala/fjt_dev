using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    [Table("agreement")]
    public class Agreement
    {
        public Agreement()
        {
            user_agreement = new HashSet<UserAgreement>();
        }

        [key]
        public int agreementID { get; set; }

        public int agreementTypeID { get; set; }

        public string agreementContent { get; set; }

        public int? version { get; set; }

        public string system_variables { get; set; }

        public bool? isPublished { get; set; }

        public DateTime? publishedDate { get; set; }

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

        [StringLength(250)]
        public string agreementSubject { get; set; }

        [StringLength(250)]
        public string createByRole { get; set; }

        [StringLength(250)]
        public string updateByRole { get; set; }

        [StringLength(250)]
        public string deleteByRole { get; set; }

        [ForeignKey("agreementTypeID")]
        public virtual AgreementType agreement_type { get; set; }

        public virtual ICollection<UserAgreement> user_agreement { get; set; }
    }
}
