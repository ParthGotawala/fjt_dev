using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("genericfiles")]
  public class genericfiles
    {
        [Key]
        public int gencFileID { get; set; }
        public string gencFileName { get; set; }
        public string gencOriginalName { get; set; }
        public string gencFileDescription { get; set; }
        public string gencFileExtension { get; set; }
        public string gencFileType { get; set; }
        public string tags { get; set; }
        public bool isDefault { get; set; }
        public int refTransID { get; set; }
        public string gencFileOwnerType { get; set; }
        public string gencFilePath { get; set; }
        [Required]
        public bool isDeleted { get; set; }
        public bool isActive { get; set; }
        [StringLength(255)]
        public string createdBy { get; set; }
        public DateTime createdAt { get; set; }
        [StringLength(255)]
        public string updatedBy { get; set; }
        public DateTime? updatedAt { get; set; }
        [StringLength(255)]
        public string deletedBy { get; set; }
        public DateTime? deletedAt { get; set; }
        public bool isShared { get; set; }
        public string fileGroupBy { get; set; }
        public int refParentId { get; set; }
        public long fileSize { get; set; }
        public bool isDisable { get; set; }
        [StringLength(255)]
        public string disableBy{ get; set; }
        public DateTime? disableOn { get; set; }
        public string disableReason { get; set; }
        public int refCopyTransID { get; set; }
         public string refCopyGencFileOwnerType { get; set; }
        public int createByRoleId { get; set; }
        public int updateByRoleId { get; set; }
        public int deleteByRoleId { get; set; }








    }
}
