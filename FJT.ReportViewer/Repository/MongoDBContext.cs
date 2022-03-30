using FJT.ReportViewer.AppSettings;
using FJT.ReportViewer.Repository.Interface;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Repository
{
    /// <summary>
    /// Configure Common Mongo Database for All Collections.
    /// </summary>
    public class MongoDBContext : IMongoDBContext
    {
        private readonly MongoDBConfig _mongoDBConfig;
        public MongoDBContext(IOptions<MongoDBConfig> mongoDBConfig)
        {
            _mongoDBConfig = mongoDBConfig.Value;
        }

        public IMongoDatabase GetDBContext()
        {
            var client = new MongoClient(_mongoDBConfig.MongoDBConnectionString);
            return client.GetDatabase(_mongoDBConfig.DBName);
        }
    }
}
