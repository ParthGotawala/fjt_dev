using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Collections.Generic;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class rfq_assy_quantityRepository : Repository<rfq_assy_quantity>, Irfq_assy_quantityRepository
    {
        public rfq_assy_quantityRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public List<RFQAssyQuantityModel> GetRfqAssyQuantity(int AssyID,bool isPurchaseApi)
        {
            string query = string.Empty;
            if(!isPurchaseApi)
            query = string.Format("SELECT id,rfqAssyID,requestQty, rfqpricegroupID, 0 consolidateID, 1 isQtyDetail FROM rfq_assy_quantity WHERE rfqAssyID={0} AND isDeleted=0 UNION ALL SELECT qty.qtyID AS `id`, rq.rfqAssyID, IFNULL(cqty.consolidatedQty, 0) AS requestQty, qty.rfqPriceGroupID, qty.consolidateID, 0 isQtyDetail FROM rfq_consolidate_mfgpn_lineitem_quantity qty LEFT JOIN rfq_consolidate_price_group_mfgpn_lineitem_quantity cqty ON cqty.refConsolidateLineitemQtyId = qty.id LEFT JOIN rfq_assy_quantity rq ON rq.id = qty.qtyID WHERE rq.rfqAssyID = {1} AND rq.isDeleted = 0", AssyID, AssyID);
            else
              query = string.Format("select id,id as rfqAssyID,mrpQty as requestQty, 1 isQtyDetail from salesorderdet where id={0} and isDeleted=0", AssyID);
            var quantity = this.Context.Database.SqlQuery<RFQAssyQuantityModel>(query).ToList();
            return quantity;
        }
    }
}
