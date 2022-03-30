using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
    public partial class PriceBreakComponent
    {
        public PriceBreakComponent()
        {
            Type = "Auto";
        }
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        [DataMember]
        public int componentID { get; set; }
        [DataMember]
        public string mfgPN { get; set; }
        [DataMember]
        public string supplier { get; set; }
        [DataMember]
        public string supplierPN { get; set; }
        [DataMember]
        public decimal price { get; set; }
        [DataMember]
        public int qty { get; set; }
        [DataMember]
        public string Packaging { get; set; }
        [DataMember]
        public DateTime timeStamp { get; set; }
        public string UpdatedTimeStamp { get; set; }
        public bool isCustomPrice { get; set; }
        public string Type { get; set; }
        public ObjectId? qtySupplierID { get; set; }
        public int? leadTime { get; set; }
        public int? packagingID { get; set; }
        public int? supplierID { get; set; }
        public int? supplierPartID { get; set; }


    }
}
