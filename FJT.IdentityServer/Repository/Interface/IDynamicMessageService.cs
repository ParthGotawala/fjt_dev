using FJT.IdentityServer.MongoDbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository.Interface
{
    public interface IDynamicMessageService
    {
        public Task<DynamicMessage> Get(string messageKey);
    }
}
