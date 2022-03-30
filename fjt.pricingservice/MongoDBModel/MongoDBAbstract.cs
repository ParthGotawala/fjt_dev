using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Bson;
using fjt.pricingservice.MongoDBModel.Interface;

namespace fjt.pricingservice.MongoDBModel
{
    public abstract  class MongoDBAbstract : IDBContext
    {
        MongoDBConnector mongoDBConnector = new MongoDBConnector();
        protected IMongoDatabase _db;
        public MongoDBAbstract(string connectionString, string dataBaseName)
        {
            _db = mongoDBConnector.connect(connectionString, dataBaseName);
        }
        public virtual List<T> Find<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression) where T : class, new()
        {
            IFindFluent<T, T> results = _db.GetCollection<T>(typeof(T).Name).Find(expression == null ? (x => 1 == 1) : expression);
            return results.ToListAsync<T>().Result;
        }

        public virtual T FindOne<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression) where T : class, new()
        {
            IFindFluent<T, T> results = _db.GetCollection<T>(typeof(T).Name).Find(expression == null ? (x => 1 == 1) : expression);
            return results.ToListAsync<T>().Result.FirstOrDefault();
        }

        public virtual List<T> Find<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression, int page, int pageSize) where T : class, new()
        {
            IFindFluent<T, T> results = _db.GetCollection<T>(typeof(T).Name).Find(expression == null ? (x => 1 == 1) : expression);
            results.Options.Skip = (pageSize * (page - 1));
            results.Options.Limit = pageSize;
            return results.ToListAsync<T>().Result;
        }
        public virtual void Delete<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression) where T : class, new()
        {
            _db.GetCollection<T>(typeof(T).Name).DeleteManyAsync(expression == null ? (x => 1 == 1) : expression);
        }

        public virtual void Add<T>(T item) where T : class, new()
        {
            CreateCollectionIfNotExist(typeof(T));
            _db.GetCollection<T>(typeof(T).Name).InsertOneAsync(item);
        }

        public virtual void AddMany<T>(IEnumerable<T> items) where T : class, new()
        {
            CreateCollectionIfNotExist(typeof(T));
            _db.GetCollection<T>(typeof(T).Name).InsertManyAsync(items);
        }
        public virtual void Update<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression, T item) where T : class, new()
        {
            FilterDefinition<T> filters = Builders<T>.Filter.Where(expression == null ? (x => 1 == 1) : expression);
            BsonDocument bsonDoc = item.ToBsonDocument();
            var bsonUpdateDoc = new BsonDocument { { "$set", bsonDoc } };
            _db.GetCollection<T>(typeof(T).Name).UpdateOneAsync(filters, bsonUpdateDoc);
        }
        public virtual void UpdateMany<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression, BsonDocument bsonUpdateDoc) where T : class, new()
        {
            FilterDefinition<T> filters = Builders<T>.Filter.Where(expression == null ? (x => 1 == 1) : expression);
            _db.GetCollection<T>(typeof(T).Name).UpdateManyAsync(filters, bsonUpdateDoc);
        }

        private void CreateCollectionIfNotExist(Type T)
        {
            int count = _db.ListCollectionsAsync().Result.ToListAsync().Result.Where(x => x["name"] == T.Name).Count();
            if (count == 0) _db.CreateCollectionAsync(T.Name);
        }

        public virtual List<T> All<T>() where T : class, new()
        {
            IFindFluent<T, T> results = _db.GetCollection<T>(typeof(T).Name).Find(null);
            return results.ToListAsync<T>().Result;
        }

        public virtual long Count<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression) where T : class, new()
        {
            IFindFluent<T, T> results = _db.GetCollection<T>(typeof(T).Name).Find(expression == null ? (x => 1 == 1) : expression);
            return results.CountAsync().Result;
        }
    }
}
