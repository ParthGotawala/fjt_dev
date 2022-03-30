using fjt.pricingservice.Model;
using MongoDB.Bson;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface IDigikeyPricingRepository
    {
        void SavePrice(FJTMongoQtySupplier qtySuppliers);
        FJTMongoQtySupplier FindPricing(int consolidateID, string mfgpartNumber, string PriceType, int? SupplierID, int? mfgCodeID, int? packageID, string supplierPN, bool isPurchaseApi);
        void UpdatePrice(FJTMongoQtySupplier qtySuppliers);
        List<FJTMongoQtySupplier> FindPricingByConsolidateID(int QtyID, int consolidateID);
        List<PriceBreakComponent> FindPriceBreakComponent(int componentID, string supplier, string supplierPN);
        void SavePriceBreakComponent(List<PriceBreakComponent> PriceBreaks);
        AssemblyQtyBreak FindAssyPrice(int consolidateID, ObjectId qtySupplierID, int assyQtyID);
        void UpdateAssyPrice(AssemblyQtyBreak objAssemblyQtyBreak);
        void SaveAssyPrice(AssemblyQtyBreak objAssemblyQtyBreak);
        void saveComponent(ComponentModel objComponent);
        int saveBOMIssues(List<bomStatus> bomStatusList);
        List<ComponentModel> getComponentList(string mfgPN, string supplierName);
        void SaveErrorLog(ServiceErrorLog ServiceErrorLog);
        void removeMongoStatus();
        List<PriceBreakComponent> FindAllPriceBreakComponent();
        void updatePriceBreak(PriceBreakComponent item);
        void SavePartAttribute(List<SchedulePartAttributeUpdate> attributeUpdate);
        List<SchedulePartAttributeUpdate> getPartAttribute();
        void removeOldPartAttribute();
        partPIDCodeStatus FindPartUpdatedPIDCode(string TransactionID, int? PartID, string MFGCode, string PartNumber);
        void RemovePartUpdatedPIDCode(string TransactionID, int? PartID);
        long CheckPendingErrorCount(string TransactionID, int? PartID);
        void CheckPendingApiCalls(SupplierExternalCallLimit objSupplierLimitCall);
        void saveExternalAPIStatus(ExternalSupplierStatus externalSupplierStatus);
        List<ExternalSupplierStatus> updateExternalAPIStatus(ExternalSupplierStatus externalSupplierStatus);
        List<ComponentModel> getAllComponentList(string mfgPN);
        List<MpnMappDet> GetMpnMappDet(string mfgPN);
        void updateMPNMappDet(MpnMappDet mappDet);
        bomStatus getBOMIssues(string partNumber, string transactionID, int? partID);
        void RemoveComponent(ComponentModel objComponent);
    }
}
