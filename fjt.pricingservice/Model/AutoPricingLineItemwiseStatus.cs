namespace fjt.pricingservice.Model
{
    public  class AutoPricingLineItemwiseStatus
    { 
        public int AssyID { get; set; }
        public int ConsolidateID { get; set; }
        public string PricingAPIName { get; set; }
        public int Status { get; set; }
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
        public bool IsCustomPrice { get; set; }
        public int? RequestQty { get; set; }
        public bool IsExact { get; set; }
        public int? supplierID { get; set; }
        public string apiName { get; set; }
        public bool isStockUpdate { get; set; }
        public string type { get; set; }
        public bool isPurchaseApi { get; set; }
        public int? userID { get; set; }
        public int? employeeID { get; set; }
    }
}
