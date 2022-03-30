using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace fjt.pricingservice.Model
{
    public  class bomStatus
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public string lineID { get; set; }
        public int? partID { get; set; }
        /// <summary>
        /// used for open master popup in edit mode from cloud API error popup
        /// </summary>
        public int? attributeId { get; set; }
        public string partNumber { get; set; }
        public string errorMsg { get; set; }
        public string errorType { get; set; }
        public string MFGCode { get; set; }
        public string MFGName { get; set; }
        public string PIDCode { get; set; }
        public string ClientID { get; set; }
        public string ActualPart { get; set; }
        public string DataField { get; set; }
        public string partType { get; set; }
        public string Source { get; set; }
        public string appID { get; set; }
        public string Type { get; set; }
        public string description { get; set; }
        public string SourceSupplierName { get; set; }
        public string bomMFG { get; set; }
        public string apiPartdesc { get; set; }
        public string transactionID { get; set; }
        public int? userID { get; set; }
        public int? employeeID { get; set; }
        public string productUrl { get; set; }
        public string supplierAPI { get; set; }

    }
}
