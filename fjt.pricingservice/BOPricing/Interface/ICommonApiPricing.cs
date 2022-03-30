using fjt.pricingservice.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace fjt.pricingservice.BOPricing.Interface
{
    public interface ICommonApiPricing
    {
        int LeadTime(int Qtyid);
        void sendCustomerDetailForReport(ObsoletePartRequestModel objModel, string APIUrl);
        bool ValidateJSON(string s);
        void ApiCallforErrorStatus(AutoPricingLineItemwiseStatus objStatus);
        void ApiCallforDigikeyErrorStatus(AutoPricingLineItemwiseStatus objStatus);
        void ApiCallforSuccessStatus(AutoPricingLineItemwiseStatus objStatus);
        void UpdatePendingAutoPricingStatus();
        void UpdateOldComponentDetails();
        CommonApiError getBOMVerificationIssueList(ComponentModel objComponentModel, string mfgPN, ExternalPartVerificationRequestLog objExtVerification);
        void ApiCallforExternalPartBOMUpdate(ExternalPartVerificationRequestLog objStatus);
        void downloaddataSheetLinks();
        void sendDataSheetDownLoad(DataSheetComponentModel model);
        int PricingDetail(List<AutoPricingPrice> pricinglist, List<RFQAssyQuantityModel> assyQtyList, PricingViewModel lineitem, string PricingApi, bool isPurchaseApi);
        dynamic ArrowApiGetResponse(string apikey, string loginkey, string partNumber);
        dynamic AvnetApiGetResponse(string mfgPN, string avnetStoreId, string avnetWCToken, string avnetWCTrustedToken, string avnetApiPath, string avnetSubscriptionPath);
        dynamic TTIApiGetResponse(string mfgPN, string apiAccessToken, string apiHeader);
        void ApiCallforBomProgressStatus(ExternalPartVerificationRequestLog objStatus);
        dynamic RegenerateExternalAccessTokenV3(string appName, string oldAccessToken, out string newAccessToken);
        string KeywordSearchV3(string baseUri, string accessToken, string clientId, string mpn, int recordCount, string CustomerID);
        dynamic GetCspPricingsV3(string baseUri, string accessToken, string clientId, dynamic response, string CustomerID, int packagesCount);
        ExternalPartVerificationRequestLog savePartFromMongoDB(List<ComponentModel> componentModel, ExternalPartVerificationRequestLog objExtVerification);
        void ApiCallforExternalPartUpdate(ExternalPartVerificationRequestLog objStatus);
        void SendRequestTocheckCartStatus();
        void sendExceedLimitNotification(bomStatus objStatus);
        void ApiCallforPartMasterProgressStatus(ExternalPartVerificationRequestLog objStatus);
        void savePriceBreak(Dictionary<int, string> PricesByReqQty, PricingViewModel lineitem, string supplier, string Packaging, string supplierPN, bool isCustom, int? LeadTime, int? packagingID);
        double? OperatingTemparatureRemoveNonNumericCharacters(string strOperatingTemperature, bool isFahrenheit);
        void UpdatePriceBreakComponent();
        void sendEmailforPartAttribute();
        void ApiCallforPartPictureStatus(GenericFileStatus objStatus);
        ManufacturerViewModel setNextSupplierDetail(ManufacturerViewModel supplierDetail, string cleanType);
        dynamic MouserApiGetResponse(string apikey, string partNumber);
        int callToNextExternalAPI(ExternalPartVerificationRequestLog objExtVerification, List<ComponentModel> componentList, bool isUpdate, bool isInsert, string QueueName, string nextSupplierName);
        void savedeclainedStatus(List<ComponentModel> componentList, string supplierName);
        void SaveIssueForAPIs(List<ComponentModel> listComponent, bool isIssue, ExternalPartVerificationRequestLog lineItem, List<ManufacturerViewModel> mfgList);
        dynamic HeilindApiGetResponse(string partnerKey, string AccessToken, string partNumber);
        Task SyncPendingElasticData();
        List<ManufacturerViewModel> checkNextSupplierDetail(ExternalPartVerificationRequestLog Item, int supplierID);
        int callToNextApi(ExternalPartVerificationRequestLog objExtVerification, List<ManufacturerViewModel> mfgList);
    }
}
