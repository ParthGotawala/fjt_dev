using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.MySqlDBModel;
using System.Linq;
using fjt.pricingservice.Model;

namespace fjt.pricingservice.Repository
{
    public class rfq_consolidated_mfgpn_lineitemRepository : Repository<rfq_consolidated_mfgpn_lineitem>, Irfq_consolidated_mfgpn_lineitemRepository
    {
        public rfq_consolidated_mfgpn_lineitemRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public RFQ_Consolidate_MFG_LineItemModel GetRfqConsolidateLineItem(int ConsolidateID,int AssyID,bool isPurchaseApi)
        {
            string query = string.Empty;
            if(!isPurchaseApi)
             query = string.Format("select rfqAssyID,uomID,qpa,numOfPosition,numOfRows from rfq_consolidated_mfgpn_lineitem where id={0} and rfqAssyID={1} and isDeleted=0", ConsolidateID, AssyID);
            else
             query = string.Format("select refSalesOrderDetID as rfqAssyID,uomID,qpa,numOfPosition from kit_allocation_consolidate_line_detail where rfqLineItemsId={0} and refSalesOrderDetID={1} and deletedAt is NULL", ConsolidateID, AssyID);
            var lineitem = this.Context.Database.SqlQuery<RFQ_Consolidate_MFG_LineItemModel>(query).FirstOrDefault();
            return lineitem;
        }
    }
}
