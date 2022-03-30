using System;
using System.IO;
using System.Threading.Tasks;

namespace FJT.Replication
{
    class Program
    {
        static void Main(string[] args)
        {
            #region MongoBackup
            var runMongoDBReplication = System.Threading.Tasks.Task.Factory.StartNew(() => RunMongoDBReplicationAsync());
            #endregion
        }
        public static async Task RunMongoDBReplicationAsync()
        {
        }
        public static void SaveErrorLog(Exception ex)
        {
        }

    }
}
