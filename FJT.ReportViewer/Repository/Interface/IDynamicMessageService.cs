using FJT.ReportViewer.MongoDbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Repository.Interface
{
    public interface IDynamicMessageService
    {
        public Task<DynamicMessage> Get(string messageKey);
    }
}
