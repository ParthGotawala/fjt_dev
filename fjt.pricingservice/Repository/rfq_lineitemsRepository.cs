using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;

namespace fjt.pricingservice.Repository
{
    public class rfq_lineitemsRepository : Repository<rfq_lineitems>, Irfq_lineitemsRepository
    {
        public rfq_lineitemsRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
    }
}
