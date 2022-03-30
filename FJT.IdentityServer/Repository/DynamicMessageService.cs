using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.MongoDbModel;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository
{
    /// <summary>
    /// Configure Dynamic Message Collection of MongoDb.
    /// </summary>
    public class DynamicMessageService : IDynamicMessageService
    {
        private readonly IMongoCollection<DynamicMessage> _dynamicMessages;
        private readonly MongoCollections _mongoCollections;
        private readonly IMongoDBContext _mongoDBContext;

        public DynamicMessageService(IOptions<MongoDBConfig> mongoDBConfig, IMongoDBContext mongoDBContext)
        {
            _mongoDBContext = mongoDBContext;
            _mongoCollections = mongoDBConfig.Value.MongoCollections;

            var dbContext = _mongoDBContext.GetDBContext();
            _dynamicMessages = dbContext.GetCollection<DynamicMessage>(_mongoCollections.DynamicMessageCollectionName);
        }

        public async Task<DynamicMessage> Get(string messageKey) =>
            await _dynamicMessages.Find(x => x.messageKey == messageKey && x.isDeleted == false).FirstOrDefaultAsync() ?? new DynamicMessage { messageType = "Error", message = Constant.MONGODB_CONNECTION_ERROR };
    }
}
