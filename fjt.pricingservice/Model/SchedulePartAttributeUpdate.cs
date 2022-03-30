using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    [DataContract]
    [BsonIgnoreExtraElements]
    public partial class SchedulePartAttributeUpdate
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public string pidCode { get; set; }
        public string attributeName { get; set; }
        public string oldValue { get; set; }
        public string newValue { get; set; }
        public DateTime updatedOn { get; set; }
        public bool isMfr { get; set; }
        public int componentID { get; set; }
        public string supplier { get; set; }

    }
}
