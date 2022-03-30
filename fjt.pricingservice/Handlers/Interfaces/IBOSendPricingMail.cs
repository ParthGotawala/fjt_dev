using fjt.pricingservice.Model;

namespace fjt.pricingservice.Handlers.Interfaces
{
    public interface IBOSendPricingMail
    {
        void sendEmail(EmailModel EmailModel);
        void commonSendEmailDetail(ServiceErrorLog ServiceErrorLog);
    }
}
