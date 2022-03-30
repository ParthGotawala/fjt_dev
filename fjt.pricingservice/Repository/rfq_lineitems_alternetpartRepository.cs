using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class rfq_lineitems_alternetpartRepository : Repository<rfq_lineitems_alternatepart>, Irfq_lineitems_alternetpartRepository
    {
        public rfq_lineitems_alternetpartRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
    }
}
