using fjt.pricingservice.Model;

namespace fjt.pricingservice.ErrorLog.Interface
{
    public interface IErrorLog
    {
        void saveErrorLog(ServiceErrorLog ServiceErrorLog);
    }
}
