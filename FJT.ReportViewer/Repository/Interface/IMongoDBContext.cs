using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Repository.Interface
{
    public interface IMongoDBContext
    {
        public IMongoDatabase GetDBContext();
    }
}
