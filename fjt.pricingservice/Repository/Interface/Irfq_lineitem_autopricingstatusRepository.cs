using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_lineitem_autopricingstatusRepository : IRepository<rfq_lineitem_autopricingstatus>
    {
        int UpdateLineItemwiseAutoPricing(int status, string message, string errorMsg, long assyID, int pricingSupplierID, long consolidateID, int statusPrice, bool isPurchaseApi);
        List<AutoPricingLineItemwiseStatus> UpdatePendingAutoPricingStatus(int status, string message, int statustime);
        bool GetLineItem(string apiName, int rfqAssyID, int consolidateID, bool pisPurchaseApi);
        int UpdateAllLineItemwiseAutoPricing(dynamic message, string errorMsg, string pricingApi, int consolidateID);
        List<RestrictPartModel> GetRestrictedPartsForAssy(int rfqAssyID, bool isPurchaseApi);
    }
}
