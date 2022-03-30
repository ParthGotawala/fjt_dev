using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;

namespace fjt.pricingservice.Model
{
    public class SupplierExternalCallLimit
    {
        [BsonId]
        [DataMember]
        public ObjectId id { get; set; }
        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string appName { get; set; }
        public DateTime currentDate { get; set; }
        public int totalCall { get; set; }
        public bool isLimitExceed { get; set; }
        public int exceedCallNumber { get; set; }
        public string clientID { get; set; }
        public string limitExceedText { get; set; }
        public string callLimit { get; set; }
    }
}
