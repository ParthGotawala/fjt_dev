using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data.Interface
{
    public interface IFJTIdentityManualConnection
    {
        Task<T> ExecuteReaderAsync<T>(Func<DbDataReader, T> mapEntities,string exec, params object[] parameters);
    }
}
