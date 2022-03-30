using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.MySqlDBModel
{
    public class report_parameter_setting_mapping
    {
        [Key]
        public int id { get; set; }

        [StringLength(255)]
        public string reportParamName { get; set; }

        [StringLength(255)]
        public string dbColumnName { get; set; }

        [StringLength(255)]
        public string displayName { get; set; }

        [StringLength(255)]
        public string pageRouteState { get; set; }

        public bool isHiddenParameter { get; set; }

        [StringLength(255)]
        public string type { get; set; }

        public int? dataSourceId { get; set; }

        public string options { get; set; }

        public bool isDeleted { get; set; }

        public bool isDisplay { get; set; }

        public decimal displayOrder { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime? deletedAt { get; set; }

        public DateTime? updatedAt { get; set; }

        [ForeignKey("dataSourceId")]
        public virtual FixedEntityDataelement FixedEntityDataelement { get; set; }
    }
}
