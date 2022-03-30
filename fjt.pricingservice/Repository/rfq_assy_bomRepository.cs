using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using MySql.Data.MySqlClient;
using System.Data;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class rfq_assy_bomRepository:Repository<rfq_assy_bom>, Irfq_assy_bomRepository
    {
        public rfq_assy_bomRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public RoHSViewModel getRohsInfo(string rohsText)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("prohstext", rohsText)
                 };
           return this.Context.Database.SqlQuery<RoHSViewModel>("call Sproc_GetRohsValid (@prohstext)", parameters).FirstOrDefault();
        }
        public RoHSViewModel getRohsDetail(int ID)
        {
            string query = string.Format("select id,name,rohsIcon from rfq_rohsmst where id={0} and isDeleted=0",ID);
            var rohs = this.Context.Database.SqlQuery<RoHSViewModel>(query).FirstOrDefault();
            return rohs;
        }
    }
}
