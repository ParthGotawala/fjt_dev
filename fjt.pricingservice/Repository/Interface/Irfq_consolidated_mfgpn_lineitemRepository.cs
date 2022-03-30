using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_consolidated_mfgpn_lineitemRepository:IRepository<rfq_consolidated_mfgpn_lineitem>
    {
        RFQ_Consolidate_MFG_LineItemModel GetRfqConsolidateLineItem(int ConsolidateID, int AssyID, bool isPurchaseApi);
    }
}
