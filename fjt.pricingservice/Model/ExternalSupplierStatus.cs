using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
  public  class ExternalSupplierStatus
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public string supplier { get; set; }
        public bool status { get; set; }
        public int? partID { get; set; }
        public string transactionID { get; set; }
        public string type { get; set; }
        public string cleanType { get; set; }
        public string partNumber { get; set; }
    }
}
