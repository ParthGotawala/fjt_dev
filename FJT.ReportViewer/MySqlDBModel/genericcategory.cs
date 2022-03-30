using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    public class genericcategory
    {
        public genericcategory()
        {
            reportmaster = new HashSet<reportmaster>();
        }
        [Key]
        public int gencCategoryID { get; set; }

        [StringLength(100)]
        public string gencCategoryName { get; set; }
        [StringLength(50)]
        public string gencCategoryCode { get; set; }
        [StringLength(250)]
        public string categoryType { get; set; }
        public decimal displayOrder { get; set; }
        public bool isDeleted { get; set; }
        public int? parentGencCategoryID { get; set; }
        public bool isActive { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public DateTime? deletedAt { get; set; }
        [StringLength(255)]
        public string createdBy { get; set; }
        [StringLength(255)]
        public string updatedBy { get; set; }
        [StringLength(255)]
        public string deletedBy { get; set; }
        public bool systemGenerated { get; set; }
        [StringLength(255)]
        public string colorCode { get; set; }
        public int? termsDays { get; set; }
        public int? createByRoleId { get; set; }
        public int? updateByRoleId { get; set; }
        public int? deleteByRoleId { get; set; }
        public int? carrierID { get; set; }
        public string description { get; set; }
        public bool? isEOM { get; set; }
        public virtual ICollection<reportmaster> reportmaster { get; set; }
    }
}
