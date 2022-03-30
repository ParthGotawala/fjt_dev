using fjt.pricingservice.Model;

namespace fjt.pricingservice.ErrorLog.Interface
{
    public interface IRabbitMQ
    {
        void SendRequest(ServiceErrorLog Model);
    }
}
