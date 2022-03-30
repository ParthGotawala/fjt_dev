using fjt.pricingservice.MySqlDBModel;


namespace fjt.pricingservice.Repository
{
    public class UnitOfWork: IUnitOfWork
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
