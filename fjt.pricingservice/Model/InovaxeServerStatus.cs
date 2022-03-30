using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
   public partial class InovaxeServerStatus
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public string MessageType { get; set; }
        public string TransactionID { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}
