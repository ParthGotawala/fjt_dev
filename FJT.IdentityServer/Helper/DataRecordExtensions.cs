using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Helper
{
    public static class DataRecordExtensions
    {
        private static readonly ConcurrentDictionary<Type, object> _materializers = new ConcurrentDictionary<Type, object>();

        public static IList<T> Translate<T>(this DbDataReader reader) where T : new()
        {
            var materializer = (Func<IDataRecord, T>)_materializers.GetOrAdd(typeof(T), (Func<IDataRecord, T>)Materializer.Materialize<T>);
            return Translate(reader, materializer, out var hasNextResults);
        }

        public static IList<T> Translate<T>(this DbDataReader reader, Func<IDataRecord, T> objectMaterializer)
        {
            return Translate(reader, objectMaterializer, out var hasNextResults);
        }

        public static IList<T> Translate<T>(this DbDataReader reader, Func<IDataRecord, T> objectMaterializer,
            out bool hasNextResult)
        {
            var results = new List<T>();
            while (reader.Read())
            {
                var record = (IDataRecord)reader;
                var obj = objectMaterializer(record);
                results.Add(obj);
            }

            hasNextResult = reader.NextResult();

            return results;
        }

        public static bool Exists(this IDataRecord record, string propertyName)
        {
            return Enumerable.Range(0, record.FieldCount).Any(x => record.GetName(x) == propertyName);
        }
    }
}
