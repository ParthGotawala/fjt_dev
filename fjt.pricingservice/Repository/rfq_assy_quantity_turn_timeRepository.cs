using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Collections.Generic;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class rfq_assy_quantity_turn_timeRepository : Repository<rfq_assy_quantity_turn_time>,Irfq_assy_quantity_turn_timeRepository
    {
        public rfq_assy_quantity_turn_timeRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public List<rfq_assy_quantity_turn_time>  GetRfqAssyQuantityTurnTime(int AssyQtyID)
        {
            string query = string.Format("select * from rfq_assy_quantity_turn_time where rfqAssyQtyID={0} and isDeleted=0", AssyQtyID);
            var assyQty = this.Context.Database.SqlQuery<rfq_assy_quantity_turn_time>(query).ToList();
            return assyQty;
        }
    }
}
