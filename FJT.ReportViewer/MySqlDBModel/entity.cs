using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    public class entity
    {
        public entity()
        {
            reportmaster = new HashSet<reportmaster>();
        }

        [Key]
        public int entityID { get; set; }

        [StringLength(100)]
        public string entityName { get; set; }

        [StringLength(200)]
        public string remark { get; set; }

        public bool isActive { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime? updatedAt { get; set; }

        public bool isDeleted { get; set; }

        public DateTime? deletedAt { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public bool systemGenerated { get; set; }

        public int? columnView { get; set; }

        public int? entityStatus { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        public virtual ICollection<reportmaster> reportmaster { get; set; }
    }
}
