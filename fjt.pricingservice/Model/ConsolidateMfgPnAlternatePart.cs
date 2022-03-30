using System.ComponentModel.DataAnnotations;

namespace fjt.pricingservice.Model
{
    public class ConsolidateMfgPnAlternatePart
    {
        public string mfgPN { get; set; }
        public int? mfgPNID { get; set; }
        public int? mfgCodeID { get; set; }
        [StringLength(30)]
        public string PIDCode { get; set; }
        public int? packaginggroupID { get; set; }
        public bool isPackaging { get; set; }
        public int? RoHSStatusID { get; set; }
        public string customerApproval { get; set; }
        public string mfgCode { get; set; }
        public string mfgName { get; set; }
        public int isGoodPart { get; set; }
        public bool? restrictUseWithPermissionStep { get; set; }
        public bool? restrictUsePermanentlyStep { get; set; }
        public bool? restrictUseInBOMStep { get; set; }
        public bool restrictPackagingUsePermanently { get; set; }
        public bool restrictPackagingUseWithpermission { get; set; }
        public bool? restrictUseInBOMExcludingAliasStep { get; set; }
        public bool? restrictUseInBOMExcludingAliasWithPermissionStep { get; set; }
        public bool? approvedMountingType { get; set; }
        public bool? mismatchMountingTypeStep { get; set; }
        public bool? mismatchFunctionalCategoryStep { get; set; }
    }
}
