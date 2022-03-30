using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_consolidated_mfgpn_lineitem_alternateRepository : IRepository<rfq_consolidated_mfgpn_lineitem_alternate>
    {
        List<ConsolidateMfgPnAlternatePart> GetRfqConsolidateLineItemParts(int ConsolidateID, bool isPurchaseApi);
        ComponentViewModel GetComponentData(int mfgPNID);
        int UpdateComponentDetail(ComponentModel ComponentModel, string supplier, bool isPricing, bool isfromUpdate);
        int? getPartStatus(string partstatus);
        CommonIDModel getCommonID(string tableName, string mountingType, string fieldName);
        GenericFilePathStatus getFilePathByGenricOwnerType(string genericFileOwnerType, int refTransID);
        int? updateDataSheetDownloaded(int id);
        int? addDataSheetLocalDownloadFile(string fileName, int refComponentId, int saRoleID);
        List<ConsolidateMfgPnAlternatePart> GetPackagingAliasDetails(int packaggingID, string componentIDs);
        UOMs getUnits(int? ID);
        string getCommonName(string fieldName, string tableName, int? id);
        ManufacturerViewModel GetManufacturerDetail(string mfgName, string type);
        int? getCostCategory(double? price);
        int SaveComponentDetails(ComponentModel ComponentModel);
        ExternalBOMCleanStatusViewModel updateExternalBomClean(string mfgPN, int status, string supplier, string type, int partID, string message);
        void updateExternalLog(ExternalPartVerificationRequestLog lineItem);
        ExternalBOMCleanStatusViewModel updateAllBOMParts(int? partID, string supplier, string type);
        void updateBOMPart(int? partID, string supplier, string type, string mfgPN);
        void insertBOMPart(int? partID, string supplier, string type, string mfgPN, string transactionID);
        ComponentViewModel GetComponentDataFromMFGPN(int mfgCodeID, string mfgPN);
        void updateStock(string qtySupplierID, decimal? stock, double? stockEach);
        void UpdateBOMforObsolatePart(int partID);
        List<DataSheetComponentModel> getDataSheetList();
        CommonIDModel getMeasureMentType(int? uomID);
        int checkTBDParameters(int mfgPNID);
        int getPartNumber(string partnumber);
        int? getPartPackageCaseID(string partPackageCase);
        ExternalBOMCleanStatusViewModel updateExternalPartClean(string transactionID, int status, string supplier, string message, string mfgPN, string type);
        void RemoveLogForPart();
        void saveDataSheetLinks(int partID, string DataSheetLinks);
        double? convertTemperatureFromFahrenheitToCelsius(double fahrenheitTemperature);
        ExternalBOMCleanStatusViewModel updateAllComponentsParts(string transactionID, string supplier);
        OperatingTemperatureConversionModel GetOperatingTemperatureConversion(string strOperatingTemperature);
        string getCustomerEmail();
        bool getPartUpdateStatus(int partID, string transactionID, string supplierName, string type);
        List<ManufacturerViewModel> GetAvailableSupplierList();
        int getAlreadyExistsPartDetail(string supplier, string mfgPN, string transactionID);
        ComponentViewModel GetComponentDetail(string mfgPN);

    }
}
