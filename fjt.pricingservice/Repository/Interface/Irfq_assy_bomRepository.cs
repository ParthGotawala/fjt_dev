using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_assy_bomRepository : IRepository<rfq_assy_bom>
    {
        RoHSViewModel getRohsInfo(string rohsText);
        RoHSViewModel getRohsDetail(int ID);
    }
}
