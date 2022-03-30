using FJT.ReportDesigner.MongoDbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Repository.Interface
{
    public interface IDynamicMessageService
    {
       public Task<DynamicMessage> Get(string messageKey);
    }
}
