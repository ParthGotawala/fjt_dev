using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.MongoDbModel
{
    public class DynamicMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string messageKey { get; set; }
        public string category { get; set; }
        public string messageType { get; set; }
        public string messageCode { get; set; }
        public string message { get; set; }
        public string createdByName { get; set; }
        public DateTime createdDate { get; set; }
        public string modifiedByName { get; set; }
        public DateTime modifiedDate { get; set; }
        public bool isDeleted { get; set; }
        public int versionNumber { get; set; }
        public string developer { get; set; }

        // can not set as Array because of in some previousVersion uses old Structure, so got mapping issuses.
        public object previousVersion { get; set; }
    }
}
