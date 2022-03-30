using FJT.Reporting.Models;
using System;

namespace FJT.Reporting.Repository.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        FJTSqlDBContext Context { get; set; }
    }
}
