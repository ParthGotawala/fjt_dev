using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
    public partial  class SupplierQtyBreak
    {
        [BsonId]
        [DataMember]
        public ObjectId id { get; set; }
        public ObjectId qtySupplierID { get; set; }
        public int Qty { get; set; }
        public double price { get; set; }
        public double extPrice { get; set; }
        public bool isDeleted { get; set; }
    }
}
