using MongoDB.Driver;
using System;
using System.Configuration;
using fjt.pricingservice.MongoDBModel.Interface;

namespace fjt.pricingservice.MongoDBModel
{
    public class MongoDBConnector : INoSqlConnector<IMongoDatabase>
    {
        private MongoClient _mongoClient;
        public IMongoDatabase connect()
        {
            IMongoDatabase db = null;
            _mongoClient = new MongoClient(ConfigurationManager.AppSettings["MongoDBServer"]);
            string database = string.Empty;
            try
            {
                db = _mongoClient.GetDatabase(database);
                return db;
            }
            catch (Exception ex)
            {

            }
            throw new NotImplementedException();
        }
        public IMongoDatabase connect(string connectionstring, string dbName)
        {
            IMongoDatabase db = null;
            _mongoClient = new MongoClient(connectionstring);

            try
            {
                db = _mongoClient.GetDatabase(dbName);
                return db;
            }
            catch (Exception ex)
            {

            }
            return db;
        }
    }
}
