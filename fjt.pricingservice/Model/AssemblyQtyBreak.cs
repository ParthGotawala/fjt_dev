using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
    public partial  class AssemblyQtyBreak
    {
        [BsonId]
        [DataMember]
        public ObjectId id { get; set; }
        public ObjectId qtySupplierID { get; set; }
        [DataMember]
        public long RfqAssyQtyId { get; set; }
        [DataMember]
        public double? PricePerPart { get; set; }
        [DataMember]
        public double? OrderQty { get; set; }
        [DataMember]
        public double TotalDollar { get; set; }
        public int CurrentQty { get; set; }
        [DataMember]
        public bool SufficientStockQty { get; set; }
        public bool isDeleted { get; set; }
        public long ConsolidateID { get; set; }
        public long RequireQty { get; set; }
        public double ActualQty { get; set; }
        public double? ActualPrice { get; set; }
    }
}
