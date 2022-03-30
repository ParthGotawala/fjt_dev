using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using MySql.Data.MySqlClient;
using System.Linq;
using System;
namespace fjt.pricingservice.Repository
{
    public class rfq_consolidate_mfgpn_lineitem_quantityRepository : Repository<rfq_consolidate_mfgpn_lineitem_quantity>, Irfq_consolidate_mfgpn_lineitem_quantityRepository
    {
        public rfq_consolidate_mfgpn_lineitem_quantityRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public rfq_consolidate_mfgpn_lineitem_quantity GetRfqConsolidateLineItemQuantity(int ConsolidateID, int QtyID)
        {
            string query = string.Format("select * from rfq_consolidate_mfgpn_lineitem_quantity where consolidateID={0} and qtyID={1} and isDeleted=0", ConsolidateID, QtyID);
            var consolidateQty = this.Context.Database.SqlQuery<rfq_consolidate_mfgpn_lineitem_quantity>(query).FirstOrDefault();
            return consolidateQty;
        }

        public int SaveRfqConsolidateQuantity(decimal? price, string mfgPN, string supplier, string selectionMode, decimal? unitPrice, int? consolidateID, int? qtyID, double? min, double? mult, double? currentStock, string selectedPIDCode, int? leadTime, double? supplierStock, double? grossStock, string pricingSuppliers, int? apiLead, int? componentID, string packaging, string qtySupplierID, double? quoteQty, string message, int? availableInternalStock, DateTime? availableInternalStockTimeStamp)
        {
            double? priceDetail = null;
            if (price != null)
                priceDetail = Math.Round((double)price, 6);
            string query = string.Format("update rfq_consolidate_mfgpn_lineitem_quantity set finalPrice={0},selectedMpn='{1}',supplier='{2}',selectionMode='{3}',unitPrice={4},min={7},mult={8},currentStock={9},selectedPIDCode='{10}',leadTime={11},supplierStock={12},grossStock={13},apiLead={15},pricingSuppliers='{14}',componentID={16},packaging='{17}',rfqQtySupplierID='{18}',quoteQty={19},pricenotselectreason='{20}',availableInternalStock={21},availableInternalStockTimeStamp='{22}' where consolidateID={5} and qtyID={6}  and isDeleted=0", priceDetail, mfgPN, supplier, selectionMode, unitPrice, consolidateID, qtyID, min, mult, currentStock, selectedPIDCode, leadTime, supplierStock, grossStock, pricingSuppliers, apiLead, componentID, packaging, qtySupplierID, quoteQty,
                message, availableInternalStock, availableInternalStockTimeStamp != null ? availableInternalStockTimeStamp.Value.ToString("yyyy-MM-dd HH:mm:ss") : null);

            query = query.Replace("=''", "=NULL");
            query = query.Replace("=,", "=null,");
            return this.Context.Database.ExecuteSqlCommand(query);
        }
        public int UpdateStockForAddedPart(int? consolidateID, int? qtyID, double? supplierStock, double? grossStock, string pricingSuppliers)
        {
            string query = string.Format("update rfq_consolidate_mfgpn_lineitem_quantity set supplierStock={0},grossStock={1},pricingSuppliers='{2}' where consolidateID={3} and qtyID={4}  and isDeleted=0", supplierStock, grossStock, pricingSuppliers, consolidateID, qtyID);
            query = query.Replace("=''", "=NULL");
            query = query.Replace("=,", "=null,");
            return this.Context.Database.ExecuteSqlCommand(query);
        }
        public int? getAvailableStock(int consolidateID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pconsolidateID", consolidateID)
                 };
            return this.Context.Database.SqlQuery<int?>("call Sproc_GetLineItemAvailableStock (@pconsolidateID)", parameters).FirstOrDefault();
            //this.Context.Database.ExecuteSqlCommand("call Sproc_UpdatePendingAutoPricingStatus (@pstatus,@message)", parameters);
        }
    }
}
