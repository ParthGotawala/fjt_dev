using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class MpnMappDet
    {
        [BsonId]
        [DataMember]
        public ObjectId _id { get; set; }
        public string mfrName { get; set; }
        public string importMfrName { get; set; }
        public int? mfgcodeId { get; set; }
        public int? componentId { get; set; }
        public string mfgPN { get; set; }
        public string importMfgPN { get; set; }
        public string supplierName { get; set; }
        public int? supplierId { get; set; }
        public string spn { get; set; }
        public int? refSupplierMfgpnComponentID { get; set; }
        public string mfgType { get; set; }
        public string createdBy { get; set; }
        public DateTime? createdAt { get; set; }
        [DataMember]
        public string transactionID { get; set; }
        public bool isVerified { get; set; }
        public int userID { get; set; }
        public string userName { get; set; }
    }
}
