using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface IsystemconfigrationsRepository : IRepository<systemconfigrations>
    {
        List<systemconfigrations> GetSystemConfigurations(string apiName);
        systemconfigrations GetSystemConfiguration(string key);
        List<MailScheduleModel> getMailScheduleCustomerList();
        ExternalAPIConfigurationSettingsViewModel GetExternalApiConfig(int supplierID, string ApplicationID);
        int saveExternalConfiguration(ExternalAPIConfigurationSettingsViewModel objModel);
        bool getStatus(int partID, string transactionID, string supplier);
        string getContactPersonEmail(int id);
        string getCustomerEmail(int id);
        void SetSystemConfiguration(string key, string status);
        void savePartPicture(GenericFileDetail gencFile);
    }
}
