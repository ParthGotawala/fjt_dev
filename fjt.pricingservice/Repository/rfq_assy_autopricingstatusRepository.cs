using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using MySql.Data.MySqlClient;

namespace fjt.pricingservice.Repository
{
    public class rfq_assy_autopricingstatusRepository : Repository<rfq_assy_autopricingstatus>, Irfq_assy_autopricingstatusRepository
    {
        public rfq_assy_autopricingstatusRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public int UpdateAssywiseAutoPricing(int status, string message, string errorMsg, int assyID, string pricingApi)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pstatus", status),
                        new MySqlParameter("message", message),
                        new MySqlParameter("errormsg", errorMsg),
                        new MySqlParameter("assyID", assyID),
                        new MySqlParameter("pricingApi", pricingApi),
                 };
            return Context.Database.ExecuteSqlCommand("call Sproc_UpdateAssywiseAutoPricing (@pstatus,@message,@errormsg,@assyID,@pricingApi)", parameters);
        }
    }
}
