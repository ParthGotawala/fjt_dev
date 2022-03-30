using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    [Table("company_info")]
    public class CompanyInfo
    {
        [Key]
        public int id { get; set; }

        [StringLength(255)]
        public string name { get; set; }

        [StringLength(255)]
        public string personName { get; set; }

        [StringLength(255)]
        public string registeredEmail { get; set; }

        [StringLength(5)]
        public string contactCountryCode { get; set; }

        [StringLength(20)]
        public string contactNumber { get; set; }

        [StringLength(5)]
        public string faxCountryCode { get; set; }

        [StringLength(20)]
        public string faxNumber { get; set; }

        [StringLength(8)]
        public string phoneExt { get; set; }

        [StringLength(255)]
        public string street1 { get; set; }

        [StringLength(255)]
        public string street2 { get; set; }

        [StringLength(255)]
        public string street3 { get; set; }

        [StringLength(255)]
        public string city { get; set; }

        [StringLength(255)]
        public string state { get; set; }

        [StringLength(255)]
        public string postalCode { get; set; }

        [StringLength(255)]
        public string companyLogo { get; set; }

        [StringLength(100)]
        public string ein { get; set; }

        public string remittanceAddress { get; set; }

        public int mfgCodeId { get; set; } // foreign key

        public int countryID { get; set; } // foreign key

        public bool? isDeleted { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        [ForeignKey("mfgCodeId")]
        public virtual Mfgcodemst Mfgcodemst { get; set; }
    }
}
