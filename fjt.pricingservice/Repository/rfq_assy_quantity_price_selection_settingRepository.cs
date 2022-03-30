using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class rfq_assy_quantity_price_selection_settingRepository : Repository<rfq_assy_quantity_price_selection_setting>, Irfq_assy_quantity_price_selection_settingRepository
    {
        public rfq_assy_quantity_price_selection_settingRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public rfq_assy_quantity_price_selection_setting GetPriceSelectionSetting(int QtyID)
        {
            string query = string.Format("SELECT rs.*,cp.name AS packaging  FROM rfq_assy_quantity_price_selection_setting rs LEFT JOIN component_packagingmst cp ON cp.id=rs.packagingID  WHERE rs.qtyID={0} AND rs.isDeleted=0", QtyID);
            var priceSetting = this.Context.Database.SqlQuery<rfq_assy_quantity_price_selection_setting>(query).FirstOrDefault();
            return priceSetting;
        }
    }
}
