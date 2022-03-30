namespace fjt.pricingservice.Model
{
    public  class PricingViewModel
    {
        public int consolidateID { get; set; }
        public int rfqAssemblyID { get; set; }
        public int? mfgPNID { get; set; }
        public string mfgPN { get; set; }
        public double? qpa { get; set; }
        public string PIDCode { get; set; }
        public bool IsCustomPrice { get; set; }
        public int? RequestQty { get; set; }
        public int? NoOfPositions { get; set; }
        public int? ApiNoOfPosition { get; set; }
        public decimal? maxPriceLimit { get; set; }
        public bool isPackaging { get; set; }
        public bool isExact { get; set; }
        public int? mfgCodeID { get; set; }
        public int? SupplierID { get; set; }
        public int? NoOfRows { get; set; }
        public int? ApiNoOfRows { get; set; }
        public int? BOMUnitID { get; set; }
        public int? ComponentUnitID { get; set; }
        public double? PackageQty { get; set; }
        public int? mountingtypeID { get; set; }
        public int? functionalCategoryID { get; set; }
        public bool isStockUpdate { get; set; }
        public string partPackage { get; set; }
        public string mfgName { get; set; }
        public int? rohsStatusID { get; set; }
        public double? packageSpqQty { get; set; }
        public int? connectorTypeID { get; set; }
        public bool? approvedMountingType { get; set; }
        public bool? mismatchMountingTypeStep { get; set; }
        public bool? mismatchFunctionalCategoryStep { get; set; }
    }
}
