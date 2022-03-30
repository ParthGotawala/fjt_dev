using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.MySqlDBModel
{
    public class report_change_logs
    {
        [Key]
        public int id { get; set; }

        public int reportId { get; set; }

        public DateTime startActivityDate { get; set; }

        public DateTime? endActivityDate { get; set; }

        public int activityStartBy { get; set; }

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

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        [ForeignKey("reportId")]
        public virtual reportmaster reportmaster { get; set; }
    }
}
