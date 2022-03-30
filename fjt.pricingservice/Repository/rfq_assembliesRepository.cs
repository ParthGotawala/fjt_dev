using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;

namespace fjt.pricingservice.Repository
{
    public class rfq_assembliesRepository:Repository<rfq_assemblies>, Irfq_assembliesRepository
    {
        public rfq_assembliesRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
    }
}
