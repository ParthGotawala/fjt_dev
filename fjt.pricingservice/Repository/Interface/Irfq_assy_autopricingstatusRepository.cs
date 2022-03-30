
using fjt.pricingservice.MySqlDBModel;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_assy_autopricingstatusRepository:IRepository<rfq_assy_autopricingstatus>
    {
        int UpdateAssywiseAutoPricing(int status, string message, string errorMsg, int assyID, string pricingApi);
    }
}
