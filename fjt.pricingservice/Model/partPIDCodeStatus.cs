using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    public class partPIDCodeStatus
    {
        [BsonId]
        [DataMember]
        public ObjectId id { get; set; }
        [DataMember]
        public string PartNumber { get; set; }
        [DataMember]
        public string MFGCode { get; set; }
        [DataMember]
        public string ValidPIDCode { get; set; }
        [DataMember]
        public string PIDCode { get; set; }
        [DataMember]
        public DateTime timestamp { get; set; }
        [DataMember]
        public string transactionID { get; set; }
        [DataMember]
        public int? PartID { get; set; }
    }
}
