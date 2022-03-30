using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Collections.Generic;
using System.Linq;

namespace fjt.pricingservice.Repository
{
    public class systemconfigrationsRepository : Repository<systemconfigrations>, IsystemconfigrationsRepository
    {
        public systemconfigrationsRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public List<systemconfigrations> GetSystemConfigurations(string apiName)
        {
            string query = string.Format("select `key`,`values`,clusterName,isActive from systemconfigrations where clusterName='{0}' and isActive =1 and isDeleted=0", apiName);
            var config = this.Context.Database.SqlQuery<systemconfigrations>(query).ToList();
            return config;
        }
        public systemconfigrations GetSystemConfiguration(string key)
        {
            string query = string.Format("select `key`,`values`,id from systemconfigrations where `key`='{0}' and isActive =1 and isDeleted=0", key);
            var config = this.Context.Database.SqlQuery<systemconfigrations>(query).FirstOrDefault();
            return config;
        }
        public void SetSystemConfiguration(string key, string status)
        {
            string query = string.Format("update systemconfigrations set `values`='{0}' where `key`='{1}' and isActive =1 and isDeleted=0", status, key);
            this.Context.Database.ExecuteSqlCommand(query);
        }
        public string getContactPersonEmail(int id)
        {
            string query = string.Format("SELECT GROUP_CONCAT(jsonTblEmails.email) FROM contactperson, JSON_TABLE(email, '$[*]' COLUMNS (email VARCHAR(150)  PATH '$.email')) jsonTblEmails WHERE deletedAt is NULL AND personid IN(SELECT refEmailID FROM email_addressdetail WHERE refid = {0} AND deletedAt is NULL)", id);

            var config = this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
            return config;
        }
        public string getCustomerEmail(int id)
        {
            string query = string.Format("SELECT email FROM customers WHERE id = {0} AND deletedat IS NULL", id);
            var config = this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
            return config;
        }
        public List<MailScheduleModel> getMailScheduleCustomerList()
        {
            string query = string.Format("SELECT em.id,em.`reportID`,em.`entity`,em.`customerID`,em.`schedule`, em.`lastEmailSendDate`,m.mfgName customerName,m.isCompany,ra.reportName,ra.reportAPI,ra.isExcel,ra.withAlternateParts,ra.emailTemplete FROM email_schedulemst em JOIN reportmaster ra ON ra.id=em.reportID left join mfgcodemst m on m.id=em.customerID AND m.deletedAt IS NULL  WHERE em.isDeleted = 0 AND em.isActive = 1;");
            var maialSchedulelist = this.Context.Database.SqlQuery<MailScheduleModel>(query).ToList();
            return maialSchedulelist;
        }

        public bool getStatus(int partID, string transactionID, string supplier)
        {
            string query = string.Empty;
            if (string.IsNullOrEmpty(transactionID))                // BOM Clean Status check
            {
                query = string.Format("SELECT exteranalAPICallStatus FROM component_bomsetting WHERE refComponentID={0} AND isdeleted=0", partID);
            }
            else if (partID == ConstantHelper.DefaultImportPart && !string.IsNullOrEmpty(transactionID))    // Import MPN Status Check
            {
                query = string.Format("SELECT partStatus as exteranalAPICallStatus FROM external_partverificationrequest_log WHERE partID={0} AND transactionID='{1}' and partStatus = 0", partID, transactionID);
            }
            else                        // Update Parts From Part List Page Status
            {
                query = string.Format("SELECT partStatus as exteranalAPICallStatus FROM external_partverificationrequest_log WHERE partID={0} AND transactionID='{1}' and partStatus = 0 and supplier='{2}'", partID, transactionID, supplier);
            }

            var config = this.Context.Database.SqlQuery<ComponentViewModel>(query).FirstOrDefault();
            if (config != null && config.exteranalAPICallStatus != null)
            {
                return config.exteranalAPICallStatus == 0 ? true : false;
            }
            return false;
        }

        public ExternalAPIConfigurationSettingsViewModel GetExternalApiConfig(int supplierID, string ApplicationID)
        {
            string query = string.Format("select id,supplierID,clientID,secretID,refreshToken,accessToken,specialPriceCustomerID,perCallRecordCount,dkCallLimit from external_api_configuration_settings where supplierID={0} and defaultAccess =1 and appID='{1}'", supplierID, ApplicationID);
            var config = this.Context.Database.SqlQuery<ExternalAPIConfigurationSettingsViewModel>(query).FirstOrDefault();
            return config;
        }
        public int saveExternalConfiguration(ExternalAPIConfigurationSettingsViewModel objModel)
        {
            string query = string.Format("update external_api_configuration_settings set refreshToken='{0}',accessToken='{1}' where id={2}", objModel.refreshToken, objModel.accessToken, objModel.id);
            return this.Context.Database.ExecuteSqlCommand(query);
        }

        public void savePartPicture(GenericFileDetail gencFile)
        {
            string insertQuery = string.Format(@"INSERT INTO genericfiles(gencFileName,gencFileOwnerType,fileSize,gencOriginalName,createByRoleId,fileGroupBy,
                                                    genFilePath, gencFileType,isDeleted,createdBy,isDisable,tags) 
                                                  VALUES('{0}','{1}',{2},'{3}',{4},'{5}','{6}','{7}',0,'Auto',0,'{8}')",
                                               gencFile.gencFileName, gencFile.gencFileOwnerType, gencFile.fileSize, gencFile.gencOriginalName,
                                               int.Parse(gencFile.roleID), gencFile.fileGroupBy, gencFile.imagePath, gencFile.documentType, gencFile.tags
                                               );
            insertQuery = insertQuery.Replace("(,", "(NULL,");
            insertQuery = insertQuery.Replace(",)", ",NULL)");
            insertQuery = insertQuery.Replace(",,,,", ",NULL,NULL,NULL,");
            insertQuery = insertQuery.Replace(",,,", ",NULL,NULL,");
            insertQuery = insertQuery.Replace(",,", ",NULL,");
            insertQuery = insertQuery.Replace(",'',", ",NULL,");
            insertQuery = insertQuery.Replace(",''", ",NULL");
            insertQuery = insertQuery.Replace(",,", ",NULL,");
            this.Context.Database.ExecuteSqlCommand(insertQuery);
        }

    }
}
