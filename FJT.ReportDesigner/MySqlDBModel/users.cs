using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.MySqlDBModel
{
    public class users
    {
        [Key]
        public int id { get; set; }

        [StringLength(255)]
        public string username { get; set; }

        [StringLength(255)]
        public string passwordDigest { get; set; }

        [StringLength(50)]
        public string emailAddress { get; set; }

        [StringLength(50)]
        public string firstName { get; set; }

        [StringLength(50)]
        public string lastName { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public bool? isDeleted { get; set; }

        [StringLength(1)]
        public string onlineStatus { get; set; }

        public int? employeeID { get; set; }

        public Guid? forGotPasswordToken { get; set; }

        public DateTime? tokenGenerationDateTime { get; set; }

        public int? printerID { get; set; }

        public int? defaultLoginRoleID { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        [StringLength(255)]
        public string IdentityUserId { get; set; }
    }
}
