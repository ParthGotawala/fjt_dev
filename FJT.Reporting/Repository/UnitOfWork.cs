using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;

namespace FJT.Reporting.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public FJTSqlDBContext Context { get; set; }
        public UnitOfWork()
        {
            this.Context = new FJTSqlDBContext();
            this.Context.Database.CommandTimeout = 0;
        }
        public void Dispose()
        {
            if (Context != null)
                Context.Dispose();
        }
    }
}