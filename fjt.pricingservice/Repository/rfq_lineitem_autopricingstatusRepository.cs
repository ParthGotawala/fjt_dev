using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Linq;
using MySql.Data.MySqlClient;
using fjt.pricingservice.Model;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository
{
    public class rfq_lineitem_autopricingstatusRepository : Repository<rfq_lineitem_autopricingstatus>, Irfq_lineitem_autopricingstatusRepository
    {
        public rfq_lineitem_autopricingstatusRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public int UpdateLineItemwiseAutoPricing(int status, string message, string errorMsg, long assyID, int pricingSupplierID, long consolidateID, int statusPrice, bool isPurchaseApi)
        {
            string query = string.Format("update rfq_lineitem_autopricingstatus set status={0},msg='{1}',errorMsg='{2}',statusChangeDate=UTC_TIMESTAMP() where consolidateID={3} and rfqAssyID={4} and status={5} and pricingSupplierID={6} and isPurchaseApi={7}", status, message, errorMsg, consolidateID, assyID, statusPrice, pricingSupplierID, isPurchaseApi);
            return this.Context.Database.ExecuteSqlCommand(query);
        }

        public int UpdateAllLineItemwiseAutoPricing(dynamic message, string errorMsg, string pricingApi, int consolidateID)
        {
            string query = string.Format("update rfq_lineitem_autopricingstatus set status=1,msg='{0}',errorMsg='{1}',statusChangeDate=UTC_TIMESTAMP() where status=0 and pricingApiName='{2}'  and consolidateID!={3}", message, errorMsg, pricingApi, consolidateID);
            return this.Context.Database.ExecuteSqlCommand(query);
        }

        public List<AutoPricingLineItemwiseStatus> UpdatePendingAutoPricingStatus(int status, string message, int statustime)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pstatus", status),
                        new MySqlParameter("message", message),
                        new MySqlParameter("statustime", statustime),
                 };
            return this.Context.Database.SqlQuery<AutoPricingLineItemwiseStatus>("call Sproc_UpdatePendingAutoPricingStatus (@pstatus,@message,@statustime)", parameters).ToList();
            //this.Context.Database.ExecuteSqlCommand("call Sproc_UpdatePendingAutoPricingStatus (@pstatus,@message)", parameters);
        }

        public bool GetLineItem(string apiName, int rfqAssyID, int consolidateID, bool pisPurchaseApi)
        {
            string line_query = string.Format("select * from rfq_lineitem_autopricingstatus where status=0 and rfqAssyID={0} and pricingApiName='{1}' and consolidateID={2} and isPurchaseApi={3}", rfqAssyID, apiName, consolidateID, pisPurchaseApi);
            return this.Context.Database.SqlQuery<rfq_lineitem_autopricingstatus>(line_query).Any();
        }

        public List<RestrictPartModel> GetRestrictedPartsForAssy(int rfqAssyID, bool isPurchaseApi)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                {
                        new MySqlParameter("prfqAssyID", rfqAssyID),
                        new MySqlParameter("pisPurchaseApi", isPurchaseApi)
                };
            return this.Context.Database.SqlQuery<RestrictPartModel>("call Sproc_GetRestrictedPartsForBOMNPurchase (@prfqAssyID,@pisPurchaseApi)", parameters).ToList();
        }
    }
}
