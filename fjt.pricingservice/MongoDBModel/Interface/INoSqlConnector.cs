namespace fjt.pricingservice.MongoDBModel.Interface
{
    public interface INoSqlConnector<T>
    {
        T connect();
    }
}
