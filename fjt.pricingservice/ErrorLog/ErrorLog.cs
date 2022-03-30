using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;

namespace fjt.pricingservice.ErrorLog
{
    public class ErrorLog : IErrorLog
    {
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        public ErrorLog(IDigikeyPricingRepository IDigikeyPricingRepository)
        {
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
        }
        public void saveErrorLog(ServiceErrorLog ServiceErrorLog)
        {
            _IDigikeyPricingRepository.SaveErrorLog(ServiceErrorLog);
        }
    }
}
