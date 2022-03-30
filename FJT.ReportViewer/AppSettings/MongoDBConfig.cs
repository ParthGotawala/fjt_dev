using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.AppSettings
{
    public class MongoDBConfig
    {
        public string MongoDBConnectionString { get; set; }
        public string DBName { get; set; }
        public MongoCollections MongoCollections { get; set; }
    }

    public class MongoCollections
    {
        public string DynamicMessageCollectionName { get; set; }
    }
}
