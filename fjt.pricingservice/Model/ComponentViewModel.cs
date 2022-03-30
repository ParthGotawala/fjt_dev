using System;
namespace fjt.pricingservice.Model
{
    public class ComponentViewModel
    {
        public int id { get; set; }
        public string mfgPN { get; set; }
        public string PIDCode { get; set; }
        public int mfgcodeID { get; set; }
        public int? noOfPosition { get; set; }
        public string supplier { get; set; }
        public int? noOfRows { get; set; }
        public double? packageQty { get; set; }
        public double? umidSPQ { get; set; }
        public int? uom { get; set; }
        public string packaging { get; set; }
        public string mfgPNDescription { get; set; }
        public int? mountingTypeID { get; set; }
        public string partPackage { get; set; }
        public int? partPackageID { get; set; }
        public int? category { get; set; }
        public string value { get; set; }
        public string tolerance { get; set; }
        public double? minOperatingTemp { get; set; }
        public double? maxOperatingTemp { get; set; }
        public int? functionalCategoryID { get; set; }
        public int? mslID { get; set; }
        public int? connecterTypeID { get; set; }
        public int? costCategoryID { get; set; }
        public string operatingTemp { get; set; }
        public int partType { get; set; }
        public int? RoHSStatusID { get; set; }
        public double? unit { get; set; }
        public bool isCloudApiUpdateAttribute { get; set; }
        public int? exteranalAPICallStatus { get; set; }
        public string noOfPositionText { get; set; }
        public string uomClassText { get; set; }
        public string noOfRowsText { get; set; }
        public int? uomClassID { get; set; }
        public int? partStatus { get; set; }
        public bool isReversal { get; set; }
        public DateTime? eolDate { get; set; }
        public DateTime? ltbDate { get; set; }
        public string detailDescription { get; set; }
        public DateTime? obsoleteDate { get; set; }
        public int? packagingID { get; set; }
        public string functionalCategoryText { get; set; }
        public string mountingTypeText { get; set; }
        public string temperatureCoefficient { get; set; }
        public string connectorTypeText { get; set; }
        public string pitch { get; set; }
        public string pitchMating { get; set; }
        public string sizeDimension { get; set; }
        public string heightText { get; set; }
        public string voltage { get; set; }
        public string powerRating { get; set; }
        public string weight { get; set; }
        public string feature { get; set; }
        public string color { get; set; }
        public string minimum { get; set; }
        public int? leadTime { get; set; }
        public int? mult { get; set; }
        public double? temperatureCoefficientValue { get; set; }
        public string temperatureCoefficientUnit { get; set; }
        public double? price { get; set; }
        public string partStatusText { get; set; }
        public string rohsText { get; set; }
        public string mfrNameText { get; set; }
        public string dataSheetLink { get; set; }
        public int? supplierID { get; set; }

        // ----------- Used below field for fetch Detail of Part with their Supplier and MFR Part
        public string mfrName { get; set; }
        public int? refSupplierMfgpnComponentID { get; set; }
        public string supplierName { get; set; }
        public string spn { get; set; }
        public string mfgType { get; set; }
        public string employeeName { get; set; }
        public DateTime createdAt { get; set; }
    }
}
