using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    public class ComponentModel
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public int id { get; set; }
        public string imageURL { get; set; }
        public string mfgPN { get; set; }
        public string productionPN { get; set; }
        public int mfgcodeID { get; set; }
        public string mfgPnDescription { get; set; }
        public double? packageQty { get; set; }
        public DateTime? ltbDate { get; set; }
        public int? RoHSStatusID { get; set; }
        public int? leadTime { get; set; }
        public string packaging { get; set; }
        public int? noOfPosition { get; set; }
        public string minimum { get; set; }
        public string mult { get; set; }
        public string uomText { get; set; }
        public string rohsText { get; set; }
        public string dataSheetLink { get; set; }
        public DateTime? eolDate { get; set; }
        public string tolerance { get; set; }
        public double? minOperatingTemp { get; set; }
        public double? maxOperatingTemp { get; set; }
        public string weight { get; set; }
        public string heightText { get; set; }
        public string partStatusText { get; set; }
        public string feature { get; set; }
        public string functionalCategoryText { get; set; }
        public DateTime? updatedAtApi { get; set; }
        public string distPN { get; set; }
        public string mountingType { get; set; }
        public int? mountingTypeID { get; set; }
        public int? partStatusID { get; set; }
        public int? uomID { get; set; }
        public string connectorTypeText { get; set; }
        public int? connectorTypeID { get; set; }
        public string operatingTemp { get; set; }
        public string sizeDimension { get; set; }
        public int? noOfRows { get; set; }
        public string powerRating { get; set; }
        public string pitch { get; set; }
        public string pitchMating { get; set; }
        public string voltage { get; set; }
        public int? functionalCategoryID { get; set; }
        public string value { get; set; }
        public string partPackage { get; set; }
        public int? partPackageID { get; set; }
        public string temperatureCoefficient { get; set; }
        public double? temperatureCoefficientValue { get; set; }
        public string temperatureCoefficientUnit { get; set; }
        public int? componentID { get; set; }
        public int? SupplierID { get; set; }
        public string color { get; set; }

        public int? packagingID { get; set; }
        public List<ComponentImages> ComponentImages { get; set; }
        public string manufacturerName { get; set; }
        public string supplierName { get; set; }
        public double? unit { get; set; }
        public int? category { get; set; }
        public double? UnitPrice { get; set; }
        public string PIDCode { get; set; }
        public int? costCategoryID { get; set; }
        public string searchMfgPn { get; set; }
        public string noOfPositionText { get; set; }
        public string noOfRowsText { get; set; }
        public string uomClassText { get; set; }
        public int? uomClassID { get; set; }
        public string detailDescription { get; set; }
        public List<DataSheetURL> DataSheets { get; set; }
        public DateTime? obsoleteDate { get; set; }
        [BsonIgnore]
        public Dictionary<int, string> PricesByReqQty { get; set; }
        public string savePriceSupplier { get; set; }
        public string productUrl { get; set; }
        public double? lineID { get; set; }
        public bool isEpoxyMount { get; set; }
    }
}
