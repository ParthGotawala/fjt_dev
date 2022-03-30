using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public  interface Irfq_assy_quantityRepository:IRepository<rfq_assy_quantity>
    {
        List<RFQAssyQuantityModel> GetRfqAssyQuantity(int AssyID, bool isPurchaseApi);
    }
}
