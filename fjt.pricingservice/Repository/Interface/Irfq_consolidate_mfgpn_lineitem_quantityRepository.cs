using fjt.pricingservice.MySqlDBModel;
using System;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_consolidate_mfgpn_lineitem_quantityRepository : IRepository<rfq_consolidate_mfgpn_lineitem_quantity>
    {
        rfq_consolidate_mfgpn_lineitem_quantity GetRfqConsolidateLineItemQuantity(int ConsolidateID, int QtyID);
        int SaveRfqConsolidateQuantity(decimal? price, string mfgPN, string supplier, string selectionMode, decimal? unitPrice, int? consolidateID, int? qtyID, double? min, double? mult, double? currentStock, string selectedPIDCode, int? leadTime, double? supplierStock, double? grossStock, string pricingSuppliers, int? apiLead, int? componentID,string packaging,string qtySupplierID, double? quoteQty,string message,int? availableInternalStock,DateTime? availableInternalStockTimeStamp);
        int? getAvailableStock(int consolidateID);
        int UpdateStockForAddedPart(int? consolidateID, int? qtyID, double? supplierStock, double? grossStock, string pricingSuppliers);
    }
}
