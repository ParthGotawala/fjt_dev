using fjt.pricingservice.MySqlDBModel;
using System;

namespace fjt.pricingservice.Repository
{
    public interface IUnitOfWork:IDisposable
    {
        FJTSqlDBContext Context { get; set; }
    }
}
