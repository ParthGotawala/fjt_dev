using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    [Table("agreement_type")]
    public class AgreementType
    {
        public AgreementType()
        {
            agreements = new HashSet<Agreement>();
        }

        [key]
        public int agreementTypeID { get; set; }

        [StringLength(255)]
        public string agreementType { get; set; }

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

        [StringLength(100)]
        public string templateType { get; set; }

        [StringLength(255)]
        public string createByRole { get; set; }

        [StringLength(255)]
        public string updateByRole { get; set; }

        [StringLength(255)]
        public string deleteByRole { get; set; }

        [StringLength(1000)]
        public string purpose { get; set; }

        [StringLength(1000)]
        public string where_used { get; set; }

        [StringLength(250)]
        public string displayName { get; set; }

        public virtual ICollection<Agreement> agreements { get; set; }
    }
}
