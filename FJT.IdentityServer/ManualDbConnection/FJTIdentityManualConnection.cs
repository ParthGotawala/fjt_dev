using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.Data.Interface;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.ManualDbConnection
{
    public class FJTIdentityManualConnection : IFJTIdentityManualConnection
    {
        private readonly ConnectionStrings _connectionStrings;
        public FJTIdentityManualConnection(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
        }

        /// <summary>
        /// Common method For Call StoreProcedure 
        /// </summary>
        /// <typeparam name="T">SP Results</typeparam>
        /// <param name="mapEntities"> map Data to SP ResultSet</param>
        /// <param name="exec"> SP Name</param>
        /// <param name="parameters">SP Parameter</param>
        /// <returns></returns>
        public async Task<T> ExecuteReaderAsync<T>(Func<DbDataReader, T> mapEntities,
                string exec, params object[] parameters)
        {
            using (var conn = new MySqlConnection(_connectionStrings.DefaultConnection))
            {
                using (var command = new MySqlCommand(exec, conn))
                {
                    conn.Open();
                    command.Parameters.AddRange(parameters);
                    command.CommandType = CommandType.StoredProcedure;
                    try
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            T data = mapEntities(reader);
                            return data;
                        }
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
        }
    }
}
