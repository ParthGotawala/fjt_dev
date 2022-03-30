using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    public class reportmasterparameter
    {
        [Key]
        public int id { get; set; }

        public int reportId { get; set; }

        public int parmeterMappingid { get; set; }

        public bool isRequired { get; set; }

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

        public int createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        [ForeignKey("reportId")]
        public virtual reportmaster reportmaster { get; set; }

        [ForeignKey("parmeterMappingid")]
        public virtual report_parameter_setting_mapping Report_Parameter_Setting_Mapping { get; set; }
    }
}
