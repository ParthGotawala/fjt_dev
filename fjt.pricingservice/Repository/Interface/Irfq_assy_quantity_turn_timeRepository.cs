using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_assy_quantity_turn_timeRepository : IRepository<rfq_assy_quantity_turn_time>
    {
        List<rfq_assy_quantity_turn_time> GetRfqAssyQuantityTurnTime(int AssyQtyID);
    }
}
