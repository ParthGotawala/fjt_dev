using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
    public partial class FJTMongoQtySupplier
    {
        public FJTMongoQtySupplier()
        {
            Region = "Unknown";
            PriceType = "Standard";
        }

        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        [DataMember]
        public long ConsolidateID { get; set; }
        
        public double? MinimumBuy { get; set; }
        
        [DataMember]
        public bool Active { get; set; }

        [DataMember]
        public long? PartNumberId { get; set; }
        
        [DataMember]
        public string ProductUrl { get; set; }
        [DataMember]
        public string SupplierPN { get; set; }

        [DataMember]
        public string SourceOfPrice { get; set; }

        [DataMember]
        public string Packaging { get; set; }
        [DataMember]
        public bool? Authorized_Reseller { get; set; }
        [DataMember]
        public DateTime? TimeStamp { get; set; }
        [DataMember]

        private string manufacturerPartNumber;
        public string ManufacturerPartNumber
        {
            get { return manufacturerPartNumber; }
            set { manufacturerPartNumber = value?.Trim(); }
        }
        
        [DataMember]
        public int? APILeadTime { get; set; }
        
        
        [DataMember]
        public double? Multiplier { get; set; }
        [DataMember]
        public string ManufacturerName { get; set; }
        [DataMember]
        public bool? IsSelected { get; set; }
        [DataMember]
        public string SupplierName { get; set; }
        
       
        public string PurchaseUom { get; set; }
        
        public long? PurchaseUomId { get; set; }
        [DataMember]
        public double? OrgInStock { get; set; }
        [DataMember]
        public string NCNR { get; set; }
        [DataMember]
        public string RoHS { get; set; }
        
        [DataMember]
        public string Region { get; set; }

        [DataMember]
        public string Reeling { get; set; }
        [DataMember]
        public string CurrencyName { get; set; }
        public string PartStatus { get; set; }
        public DateTime? LTBDate { get; set; }
        public bool IsDeleted { get; set; }
        public string PIDCode { get; set; }
        public string PriceType { get; set; }
        public int rfqAssyID { get; set; }
        public int? ApiNoOfPosition { get; set; }
        public int? NoOfPosition { get; set; }
        public string feature { get; set; }
        public DateTime? eolDate { get; set; }
        public bool isPackaging { get; set; }
        public string partPackage { get; set; }
        public string value { get; set; }
        public int? noOfRows { get; set; }
        public string mfgPNDescription { get; set; }
        public string UpdatedTimeStamp { get; set; }
        public int? mfgCodeID { get; set; }
        public int? packageID { get; set; }
        public int? SupplierID { get; set; }
        public double? OtherStock { get; set; }
        public string PartAbbrivation { get; set; }
        public string BOMAbbrivation { get; set; }
        public double? packageQty { get; set; }
        public ObjectId? copyFromID { get; set; }
        public string rohsIcon { get; set; }
        public string rohsName { get; set; }
        public int? MountingTypeID { get; set; }
        public int? FunctionalTypeID { get; set; }
        public string MountingType { get; set; }
        public string FunctionalType { get; set; }
        public double? PackageSPQQty { get; set; }
        public int? bomUnitID { get; set; }
        public int? componentUnitID { get; set; }
        public double? qpa { get; set; }
        public int? connectorTypeID { get; set; }
        public int AuthorizeSupplier { get; set; }
        public bool? isPurchaseApi { get; set; }
        public double? AdditionalValueFee { get;set; }
        public bool? approvedMountingType { get; set; }
        public bool? mismatchMountingTypeStep { get; set; }
        public bool? mismatchFunctionalCategoryStep { get; set; }
    }
}
