using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System.Collections.Generic;
using System.Linq;
using System;
using MySql.Data.MySqlClient;
using fjt.pricingservice.BOPricing.Interface;
using Unity;
using System.Threading;
using System.Data;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace fjt.pricingservice.Repository
{
    public class rfq_consolidated_mfgpn_lineitem_alternateRepository : Repository<rfq_consolidated_mfgpn_lineitem_alternate>, Irfq_consolidated_mfgpn_lineitem_alternateRepository
    {
        public rfq_consolidated_mfgpn_lineitem_alternateRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public bool getPartUpdateStatus(int partID, string transactionID, string supplierName, string type)
        {
            string query = string.Format("select isPartVerificationStop from external_partverificationrequest_log where partID={0} and transactionID='{1}' and supplier='{2}'", partID, transactionID, supplierName);
            bool stopApi = this.Context.Database.SqlQuery<bool>(query).FirstOrDefault();
            if (stopApi)
            {
                string updateQuery = string.Format("update external_partverificationrequest_log set partStatus=2,isPartVerificationStop=1 where partID={0} and transactionID='{1}' and type='{2}'", partID, transactionID, type);
                this.Context.Database.ExecuteSqlCommand(updateQuery);
            }
            return stopApi;
        }

        public List<ConsolidateMfgPnAlternatePart> GetRfqConsolidateLineItemParts(int ConsolidateID, bool isPurchaseApi)
        {
            string query = string.Empty;
            if (!isPurchaseApi)
                query = string.Format("SELECT rla.mfgPN,rla.mfgPNID,rla.mfgCodeID,rla.PIDCode,c.packaginggroupID,false as isPackaging,c.RoHSStatusID,case when rla.customerApproval='P' then 'P' else 'A' end customerApproval,m.mfgCode,m.mfgName,c.connecterTypeID,c.isGoodPart,IFNULL(c.restrictUSEwithpermission,0) restrictUseWithPermissionStep,IFNULL(c.restrictUsePermanently,0) restrictUsePermanentlyStep,IFNULL(rla.restrictUseInBOMStep,0) restrictUseInBOMStep,IFNULL(c.restrictPackagingUsePermanently,0) restrictPackagingUsePermanently,IFNULL(c.restrictPackagingUseWithpermission,0) restrictPackagingUseWithpermission,rla.restrictUseInBOMExcludingAliasStep,rla.restrictUseInBOMExcludingAliasWithPermissionStep,rla.approvedMountingType,rla.mismatchMountingTypeStep, rla.mismatchFunctionalCategoryStep  FROM rfq_consolidated_mfgpn_lineitem_alternate rla LEFT JOIN component c ON rla.mfgPNID = c.id AND c.isDeleted = 0 LEFT JOIN mfgcodemst m ON m.id = c.mfgcodeID AND m.isDeleted = 0  WHERE (c.isCustom IS NULL OR c.isCustom=0) AND (c.isCPN=0 OR c.isCPN IS NULL)  AND rla.consolidateID ={0} AND rla.isDeleted = 0", ConsolidateID);
            else
                query = string.Format("SELECT rla.mfgPN,rla.mfgPNID,rla.mfgCodeID,c.PIDCode,c.packaginggroupID,false as isPackaging,c.RoHSStatusID,case when rla.customerApproval='P' then 'P' else 'A' end customerApproval,m.mfgCode,m.mfgName,c.connecterTypeID,c.isGoodPart,IFNULL(c.restrictUSEwithpermission,0) restrictUseWithPermissionStep,IFNULL(c.restrictUsePermanently,0) restrictUsePermanentlyStep,IFNULL(rla.restrictUseInBOMStep,0) restrictUseInBOMStep,IFNULL(c.restrictPackagingUsePermanently,0) restrictPackagingUsePermanently,IFNULL(c.restrictPackagingUseWithpermission,0) restrictPackagingUseWithpermission,rla.restrictUseInBOMExcludingAliasStep,rla.restrictUseInBOMExcludingAliasWithPermissionStep,rla.approvedMountingType,rla.mismatchMountingTypeStep, rla.mismatchFunctionalCategoryStep  FROM rfq_lineitems_alternatepart rla LEFT JOIN component c ON rla.mfgPNID = c.id AND c.isDeleted = 0 LEFT JOIN mfgcodemst m ON m.id = c.mfgcodeID AND m.isDeleted = 0  WHERE (c.isCustom IS NULL OR c.isCustom=0) AND (c.isCPN=0 OR c.isCPN IS NULL)  AND rla.rfqLineItemsID ={0} AND rla.isDeleted = 0", ConsolidateID);
            var lineitems = this.Context.Database.SqlQuery<ConsolidateMfgPnAlternatePart>(query).ToList();
            return lineitems;
        }


        public ComponentViewModel GetComponentData(int mfgPNID)
        {
            string query = string.Format("select mfgPN,mfgcodeID,noOfPosition,noOfRows,packageQty,uom,mountingtypeID,functionalCategoryID,partPackage,RoHSStatusID,unit,connecterTypeID from component where id={0} and isDeleted=0", mfgPNID);
            var component = this.Context.Database.SqlQuery<ComponentViewModel>(query).FirstOrDefault();
            return component;
        }
        public int checkTBDParameters(int mfgPNID)
        {
            string query = string.Format("select COUNT(1) FROM component WHERE deletedat IS NULL AND id ={0} AND (partstatus = -1 OR mountingTypeID = -1 OR RoHSStatusID = -1 OR functionalCategoryID = -1)", mfgPNID);
            var component = this.Context.Database.SqlQuery<int>(query).FirstOrDefault();
            return component;
        }
        public int UpdateComponentDetail(ComponentModel ComponentModel, string supplier, bool isPricing, bool isfromUpdate)
        {

            ICommonApiPricing _ICommonApiPricing = UnityConfig.Container.Resolve<ICommonApiPricing>();
            ComponentModel.distPN = ComponentModel.distPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            ComponentModel.mfgPN = ComponentModel.mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            // Super Admin Role id
            int SARoleID = getSuperAdminRoleID();
            // commented detail description encoding for part# 300-30-50-GR-0250F
            //ComponentModel.detailDescription = ComponentModel.detailDescription != null ? ComponentModel.detailDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
            // attribute update list
            List<SchedulePartAttributeUpdate> partAttributeList = new List<SchedulePartAttributeUpdate>();
            //for manufacturer part number update
            string mfgPartQuery = string.Format("select mfgPN,mfgcodeID,noOfPosition,cl.supplierID,packagingID,PIDCode,noOfRows,packageQty,umidSPQ,c.id,uom,packaging,mfgPNDescription,mountingTypeID,partPackage,category,value,tolerance,minOperatingTemp,maxOperatingTemp,functionalCategoryID,mslID,connecterTypeID,costCategoryID,operatingTemp,partType,RoHSStatusID,isCloudApiUpdateAttribute,noOfPositionText,uomClassID,noOfRowsText,partStatus,isReversal,eolDate, ltbDate, partPackageID,detailDescription,obsoleteDate,functionalCategoryText,mountingTypeText,temperatureCoefficient,connectorTypeText,pitch,sizeDimension,pitchMating,heightText,voltage,feature,weight,powerRating,color,minimum,leadTime,mult,temperatureCoefficientValue,temperatureCoefficientUnit,price,partStatusText,rohsText,mfrNameText, dataSheetLink from vu_component_mpn c left join component_last_external_apicall cl on cl.refComponentID=c.id where c.id={0}  and c.isDeleted=0", ComponentModel.componentID);
            var MFGcomponent = this.Context.Database.SqlQuery<ComponentViewModel>(mfgPartQuery).FirstOrDefault();

            MFGcomponent.mfgPNDescription = !(string.IsNullOrEmpty(MFGcomponent.mfgPNDescription)) ? MFGcomponent.mfgPNDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ConstantHelper.Description;
            MFGcomponent.detailDescription = MFGcomponent.detailDescription != null ? MFGcomponent.detailDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : "";
            // set json object for external API
            SupplierExternalAPI externalAPI = new SupplierExternalAPI()
            {
                functionalCategoryText= ComponentModel.functionalCategoryText,
                mountingTypeText= ComponentModel.mountingType,
                connectorTypeText= ComponentModel.connectorTypeText,
                pitch= ComponentModel.pitch,
                partPackage= ComponentModel.partPackage,
                pitchMating= ComponentModel.pitchMating,
                value= ComponentModel.value,
                powerRating= ComponentModel.powerRating,
                feature= ComponentModel.feature,
                noOfPositionText= ComponentModel.noOfPositionText,
                noOfRowsText= ComponentModel.noOfRowsText,
                operatingTemp= ComponentModel.operatingTemp,
                temperatureCoefficient= ComponentModel.temperatureCoefficient,
                heightText= ComponentModel.heightText,
                sizeDimension= ComponentModel.sizeDimension,
                voltage= ComponentModel.voltage,
                weight=ComponentModel.weight,
                color=ComponentModel.color,
                tolerance=ComponentModel.tolerance
            };
            // As per new requirement add source for attributes
            if (!isPricing)
                saveAttributes(ComponentModel);
            //discussed with DP on 07-10-2019
            //if Part status change than update part only while do pricing
            if (ComponentModel.partStatusID != null && MFGcomponent.partStatus != ComponentModel.partStatusID)
                isPricing = false;
            bool isReversal = MFGcomponent.isReversal;
            ComponentModel.detailDescription = !(string.IsNullOrEmpty(ComponentModel.detailDescription)) ? ComponentModel.detailDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : "";
            if (MFGcomponent.partStatus == 1 && ComponentModel.partStatusID != 1)
            {
                isReversal = false;
            }
            else if (MFGcomponent.partStatus != 1 && ComponentModel.partStatusID == 1)
            {
                isReversal = true;
                MFGcomponent.eolDate = null;
                MFGcomponent.ltbDate = null;
            }
            if (MFGcomponent != null && (MFGcomponent.supplierID == ComponentModel.SupplierID || MFGcomponent.supplierID == null) && (MFGcomponent.packagingID == ComponentModel.packagingID || MFGcomponent.packaging == null) && !isPricing)
            {
                string querymfg = string.Empty;
                string querymfgAttribute = string.Empty;
                //check part status is obsolete, then set obsolete date for part
                if (ComponentModel.partStatusID == ConstantHelper.Obsolete_Status)
                {
                    if (ComponentModel.obsoleteDate == null)
                    {
                        if (MFGcomponent.obsoleteDate != null)
                        {
                            ComponentModel.obsoleteDate = MFGcomponent.obsoleteDate.Value;
                        }
                        else if (ComponentModel.ltbDate != null)
                        {
                            ComponentModel.obsoleteDate = ComponentModel.ltbDate.Value.AddDays(1);
                        }
                        else if (MFGcomponent.ltbDate != null)
                        {
                            ComponentModel.obsoleteDate = MFGcomponent.ltbDate.Value.AddDays(1);
                        }
                        else
                        {
                            ComponentModel.obsoleteDate = Helper.Helper.GetCurrentLocalDate();
                        }
                    }
                }
                else
                {
                    ComponentModel.obsoleteDate = null;
                }
                // to be check value changed or not for part
                bool isAttributesUpdated = false;
                if (ComponentModel.ltbDate != null ||
                    (string.IsNullOrEmpty(MFGcomponent.rohsText) && !string.IsNullOrEmpty(ComponentModel.rohsText)) ||
                    ComponentModel.eolDate != null ||
                    (!string.IsNullOrEmpty(ComponentModel.partStatusText) && ComponentModel.partStatusText != MFGcomponent.partStatusText) ||
                    (string.IsNullOrEmpty(MFGcomponent.detailDescription) && !string.IsNullOrEmpty(ComponentModel.detailDescription)) ||
                    ComponentModel.obsoleteDate != null ||
                    (string.IsNullOrEmpty(MFGcomponent.mfrNameText) && !string.IsNullOrEmpty(ComponentModel.manufacturerName)) ||
                    (string.IsNullOrEmpty(MFGcomponent.connectorTypeText) && !string.IsNullOrEmpty(ComponentModel.connectorTypeText)) ||
                    (string.IsNullOrEmpty(MFGcomponent.minimum) && !string.IsNullOrEmpty(ComponentModel.minimum)) ||
                    (MFGcomponent.mult == null && !string.IsNullOrEmpty(ComponentModel.mult)) ||
                    (MFGcomponent.price == null && ComponentModel.UnitPrice != null)
                    )
                {
                    isAttributesUpdated = true;
                }
                if (MFGcomponent.isCloudApiUpdateAttribute)
                {
                    if (!isAttributesUpdated && (
                        (string.IsNullOrEmpty(MFGcomponent.noOfRowsText) && !string.IsNullOrEmpty(ComponentModel.noOfRowsText)) ||
                        (string.IsNullOrEmpty(MFGcomponent.tolerance) && !string.IsNullOrEmpty(ComponentModel.tolerance)) ||
                        (MFGcomponent.minOperatingTemp == null && ComponentModel.minOperatingTemp != null) ||
                        (MFGcomponent.maxOperatingTemp == null && ComponentModel.maxOperatingTemp != null) ||
                        (string.IsNullOrEmpty(MFGcomponent.weight) && !string.IsNullOrEmpty(ComponentModel.weight)) ||
                        (string.IsNullOrEmpty(MFGcomponent.sizeDimension) && !string.IsNullOrEmpty(ComponentModel.sizeDimension)) ||
                        (string.IsNullOrEmpty(MFGcomponent.operatingTemp) && !string.IsNullOrEmpty(ComponentModel.operatingTemp)) ||
                        (string.IsNullOrEmpty(MFGcomponent.heightText) && !string.IsNullOrEmpty(ComponentModel.heightText)) ||
                        (string.IsNullOrEmpty(MFGcomponent.feature) && !string.IsNullOrEmpty(ComponentModel.feature)) ||
                        (string.IsNullOrEmpty(MFGcomponent.functionalCategoryText) && !string.IsNullOrEmpty(ComponentModel.functionalCategoryText)) ||
                        (string.IsNullOrEmpty(MFGcomponent.mountingTypeText) && !string.IsNullOrEmpty(ComponentModel.mountingType)) ||
                        (string.IsNullOrEmpty(MFGcomponent.voltage) && !string.IsNullOrEmpty(ComponentModel.voltage)) ||
                        (string.IsNullOrEmpty(MFGcomponent.pitchMating) && !string.IsNullOrEmpty(ComponentModel.pitchMating)) ||
                        (string.IsNullOrEmpty(MFGcomponent.pitch) && !string.IsNullOrEmpty(ComponentModel.pitch)) ||
                        (string.IsNullOrEmpty(MFGcomponent.powerRating) && !string.IsNullOrEmpty(ComponentModel.powerRating)) ||
                        (string.IsNullOrEmpty(MFGcomponent.noOfPositionText) && !string.IsNullOrEmpty(ComponentModel.noOfPositionText)) ||
                        (string.IsNullOrEmpty(MFGcomponent.value) && !string.IsNullOrEmpty(ComponentModel.value)) ||
                        (string.IsNullOrEmpty(MFGcomponent.temperatureCoefficient) && !string.IsNullOrEmpty(ComponentModel.temperatureCoefficient)) ||
                        (string.IsNullOrEmpty(MFGcomponent.color) && !string.IsNullOrEmpty(ComponentModel.color))))
                    {
                        isAttributesUpdated = true;
                    }
                    if (isAttributesUpdated)
                    {
                        querymfg = string.Format("update component set ltbDate='{2}',leadTime={3},packaging='{4}'," +
               "minimum='{5}',mult='{6}',rohsText='{7}',dataSheetLink='{8}',eolDate='{9}'," +
               "partStatusText='{10}', partStatus={11},RoHSStatusID={12}," +
               "packagingID={13}, price={14},Updatedby='Auto',updatedAt=UTC_TIMESTAMP(),isReversal={15},detailDescription='{16}'," +
               "obsoleteDate='{17}',mfrNameText='{18}' , updateByRoleId = '{19}', packageQty='{20}',umidSPQ='{21}' where mfgPN='{0}' and id={1}  and isDeleted=0",
                 ComponentModel.mfgPN, ComponentModel.componentID,
                 ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : (ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : MFGcomponent.ltbDate != null ? MFGcomponent.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null),
                MFGcomponent.leadTime ?? ComponentModel.leadTime,
                string.IsNullOrEmpty(MFGcomponent.packaging) ? ComponentModel.packaging : MFGcomponent.packaging,
              string.IsNullOrEmpty(MFGcomponent.minimum) ? ComponentModel.minimum : MFGcomponent.minimum,
              MFGcomponent.mult != null ? MFGcomponent.mult.ToString() : ComponentModel.mult,
              string.IsNullOrEmpty(MFGcomponent.rohsText) ? ComponentModel.rohsText : MFGcomponent.rohsText,
              ComponentModel.dataSheetLink != null ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ComponentModel.dataSheetLink,
                ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : (MFGcomponent.eolDate != null ? MFGcomponent.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null),
                ComponentModel.partStatusText,
                ComponentModel.partStatusID ?? MFGcomponent.partStatus,
                MFGcomponent.RoHSStatusID ?? ComponentModel.RoHSStatusID,
               MFGcomponent.packagingID ?? ComponentModel.packagingID,
                MFGcomponent.price ?? ComponentModel.UnitPrice,
                 isReversal,
                 string.IsNullOrEmpty(MFGcomponent.detailDescription) ? ComponentModel.detailDescription : MFGcomponent.detailDescription,
                 ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                 string.IsNullOrEmpty(MFGcomponent.mfrNameText) ? ComponentModel.manufacturerName : MFGcomponent.mfrNameText, SARoleID,
                  MFGcomponent.packageQty == null ? ComponentModel.minimum : MFGcomponent.packageQty.ToString(),
                  MFGcomponent.umidSPQ == null ? ComponentModel.minimum : MFGcomponent.umidSPQ.ToString()
                 );
                        querymfgAttribute = string.Format("update component_attributes set " +
               "noOfRowsText='{1}',tolerance='{2}'," +
               "minOperatingTemp='{3}',maxOperatingTemp='{4}',weight='{5}',sizeDimension='{6}',operatingTemp='{7}',heightText='{8}'," +
               "feature='{9}',functionalCategoryText='{10}',mountingTypeText='{11}',connectorTypeText='{12}',connecterTypeID={13},partPackage='{14}',voltage='{15}',pitchMating='{16}'," +
               "pitch='{17}',powerRating='{18}',noOfPositionText='{19}',`value`='{20}',temperatureCoefficient='{21}',temperatureCoefficientValue={22},temperatureCoefficientUnit='{23}',color='{24}',Updatedby='Auto',updatedAt=UTC_TIMESTAMP(),partPackageID={25},mountingTypeID={26},functionalCategoryID={27}," +
               "updateByRoleId = '{28}' where refComponentID={0}  and isDeleted=0",
                 ComponentModel.componentID,
              string.IsNullOrEmpty(MFGcomponent.noOfRowsText) ? ComponentModel.noOfRowsText : MFGcomponent.noOfRowsText,
              string.IsNullOrEmpty(MFGcomponent.tolerance) ? ComponentModel.tolerance : MFGcomponent.tolerance,
              (MFGcomponent.minOperatingTemp == null) ? ComponentModel.minOperatingTemp : MFGcomponent.minOperatingTemp,
              (MFGcomponent.maxOperatingTemp == null) ? ComponentModel.maxOperatingTemp : MFGcomponent.maxOperatingTemp,
              string.IsNullOrEmpty(MFGcomponent.weight) ? (!string.IsNullOrEmpty(ComponentModel.weight) ? ComponentModel.weight.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null) : MFGcomponent.weight,
              string.IsNullOrEmpty(MFGcomponent.sizeDimension) ? (!string.IsNullOrEmpty(ComponentModel.sizeDimension) ? ComponentModel.sizeDimension.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null) : MFGcomponent.sizeDimension,
              string.IsNullOrEmpty(MFGcomponent.operatingTemp) ? (!string.IsNullOrEmpty(ComponentModel.operatingTemp) ? ComponentModel.operatingTemp.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null) : MFGcomponent.operatingTemp,
              string.IsNullOrEmpty(MFGcomponent.heightText) ? ComponentModel.heightText : MFGcomponent.heightText,
                string.IsNullOrEmpty(MFGcomponent.feature) ? (!string.IsNullOrEmpty(ComponentModel.feature) ? ComponentModel.feature.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null) : MFGcomponent.feature,
                ComponentModel.functionalCategoryText,
                ComponentModel.mountingType,
                ComponentModel.connectorTypeText,
                (MFGcomponent.connecterTypeID == null || MFGcomponent.connecterTypeID == ConstantHelper.None_Status) ? ComponentModel.connectorTypeID : MFGcomponent.connecterTypeID,
                 ComponentModel.partPackage,
                 string.IsNullOrEmpty(MFGcomponent.voltage) ? ComponentModel.voltage : MFGcomponent.voltage,
                 string.IsNullOrEmpty(MFGcomponent.pitchMating) ? ((!string.IsNullOrEmpty(ComponentModel.pitchMating) ? ComponentModel.pitchMating.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : MFGcomponent.pitchMating,
                 string.IsNullOrEmpty(MFGcomponent.pitch) ? (!string.IsNullOrEmpty(ComponentModel.pitch) ? ComponentModel.pitch.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null) : MFGcomponent.pitch,
                 string.IsNullOrEmpty(MFGcomponent.powerRating) ? ComponentModel.powerRating : MFGcomponent.powerRating,
                 string.IsNullOrEmpty(MFGcomponent.noOfPositionText) ? ComponentModel.noOfPositionText : MFGcomponent.noOfPositionText,
                 string.IsNullOrEmpty(MFGcomponent.value) ? ComponentModel.value : MFGcomponent.value,
                 string.IsNullOrEmpty(MFGcomponent.temperatureCoefficient) ? ComponentModel.temperatureCoefficient : MFGcomponent.temperatureCoefficient,
                 MFGcomponent.temperatureCoefficientValue ?? ComponentModel.temperatureCoefficientValue,
                 string.IsNullOrEmpty(MFGcomponent.temperatureCoefficientUnit) ? ComponentModel.temperatureCoefficientUnit : MFGcomponent.temperatureCoefficientUnit,
                string.IsNullOrEmpty(MFGcomponent.color) ? ComponentModel.color : MFGcomponent.color,
                 (ComponentModel.partPackageID != null ? ComponentModel.partPackageID : MFGcomponent.partPackageID),
                 MFGcomponent.mountingTypeID != ConstantHelper.None_Status ? MFGcomponent.mountingTypeID : (ComponentModel.mountingTypeID != null ? ComponentModel.mountingTypeID : ConstantHelper.None_Status),
                 MFGcomponent.functionalCategoryID != ConstantHelper.None_Status ? MFGcomponent.functionalCategoryID : (ComponentModel.functionalCategoryID != null ? ComponentModel.functionalCategoryID : ConstantHelper.None_Status),
                 SARoleID
                 );
                        partAttributeList = getPartUpdatedAttributes(MFGcomponent, ComponentModel, true);

                    }
                    // save or update supplier external API detail
                    updateSupplierExternalAPI(MFGcomponent.id, ComponentModel.SupplierID, externalAPI, SARoleID);
                }
                else if (isAttributesUpdated)
                {
                    querymfg = string.Format("update component set ltbDate='{2}'," +
                   "rohsText='{3}',dataSheetLink='{4}',eolDate='{5}'," +
                   "partStatusText='{6}', partStatus={7},RoHSStatusID={8}," +
                   "price={9},Updatedby='Auto',updatedAt=UTC_TIMESTAMP(), isReversal={10},detailDescription='{11}'," +
                   "obsoleteDate='{12}',mfrNameText='{13}',packageQty='{14}',umidSPQ='{15}'," +
                   "minimum='{16}',mult='{17}',updateByRoleId = '{18}' where mfgPN='{1}' and id={0}  and isDeleted=0",
                     MFGcomponent.id, MFGcomponent.mfgPN,
                     ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : (MFGcomponent.ltbDate != null ? MFGcomponent.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null),
                    string.IsNullOrEmpty(MFGcomponent.rohsText) ? ComponentModel.rohsText : MFGcomponent.rohsText, string.IsNullOrEmpty(MFGcomponent.dataSheetLink) && string.IsNullOrEmpty(ComponentModel.dataSheetLink) ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : MFGcomponent.dataSheetLink,
                     ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : (MFGcomponent.eolDate != null ? MFGcomponent.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null),
                     ComponentModel.partStatusText, ComponentModel.partStatusID ?? MFGcomponent.partStatus, MFGcomponent.RoHSStatusID ?? ComponentModel.RoHSStatusID,
                    MFGcomponent.price ?? ComponentModel.UnitPrice, isReversal, string.IsNullOrEmpty(MFGcomponent.detailDescription) ? ComponentModel.detailDescription : MFGcomponent.detailDescription,
                     ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                     string.IsNullOrEmpty(MFGcomponent.mfrNameText) ? ComponentModel.manufacturerName : MFGcomponent.mfrNameText,
                   MFGcomponent.packageQty == null ? ComponentModel.minimum : MFGcomponent.packageQty.ToString(),
                    MFGcomponent.umidSPQ == null ? ComponentModel.minimum : MFGcomponent.umidSPQ.ToString(),
                     string.IsNullOrEmpty(MFGcomponent.minimum) ? ComponentModel.minimum : MFGcomponent.minimum,
               MFGcomponent.mult != null ? MFGcomponent.mult.ToString() : ComponentModel.mult, SARoleID);

                    querymfgAttribute = string.Format("update component_attributes set " +
                  "Updatedby='Auto',updatedAt=UTC_TIMESTAMP()," +
                  "connectorTypeText='{1}',connecterTypeID={2},partPackageID={3}," +
                  "updateByRoleId = '{4}' where refComponentID={0}  and isDeleted=0",
                    MFGcomponent.id,
                   ComponentModel.connectorTypeText
                    , (MFGcomponent.connecterTypeID == null || MFGcomponent.connecterTypeID == ConstantHelper.None_Status) ? ComponentModel.connectorTypeID : MFGcomponent.connecterTypeID
                    , (ComponentModel.partPackageID != null ? ComponentModel.partPackageID : MFGcomponent.partPackageID),SARoleID);
                }
                //parts added in list to update

                querymfg = querymfg.Replace("=''", "=NULL");
                querymfg = querymfg.Replace("=,", "=NULL,");
                if (!string.IsNullOrEmpty(querymfg))
                    this.Context.Database.ExecuteSqlCommand(querymfg);

                querymfgAttribute = querymfgAttribute.Replace("=''", "=NULL");
                querymfgAttribute = querymfgAttribute.Replace("=,", "=NULL,");
                if (!string.IsNullOrEmpty(querymfgAttribute))
                    this.Context.Database.ExecuteSqlCommand(querymfgAttribute);
                // upadte detail to save
                if (MFGcomponent != null)
                {
                    ManageUpdatedAPIDetail(MFGcomponent.id, ComponentModel.SupplierID);
                }
                savePartUpdatedAttributes(partAttributeList);
                if (isAttributesUpdated)
                {
                    addPartIntoPendingElasticSync(MFGcomponent.id);
                }
                if (ComponentModel.partStatusID != null && MFGcomponent.partStatus != ComponentModel.partStatusID)
                {
                    UpdateBOMforObsolatePart(MFGcomponent.id);
                }
            }

            if (ComponentModel.distPN == "N/A")
                return 1;
            List<SchedulePartAttributeUpdate> distpartAttributeList = new List<SchedulePartAttributeUpdate>();
            string distyquery = string.Format("select mfgPN,mfgcodeID,noOfPosition,cl.supplierID,PIDCode,noOfRows,packageQty,umidSPQ,c.id,uom,packaging,mfgPNDescription,mountingTypeID,partPackage,category,value,tolerance,minOperatingTemp,maxOperatingTemp,functionalCategoryID,mslID,connecterTypeID,costCategoryID,operatingTemp,partType,isCloudApiUpdateAttribute, partPackageID,detailDescription,ltbDate,obsoleteDate,functionalCategoryText,mountingTypeText,temperatureCoefficient,connectorTypeText,pitch,sizeDimension,pitchMating,heightText,voltage,feature,weight,powerRating,color,minimum,leadTime,mult,temperatureCoefficientValue,temperatureCoefficientUnit,price,partStatusText,rohsText,mfrNameText, dataSheetLink  from vu_component_spn c left join component_last_external_apicall cl on c.id=cl.refComponentID where mfgPN='{0}' and refSupplierMfgpnComponentID={1} and mfgcodeID={2}  and c.isDeleted=0", ComponentModel.distPN, MFGcomponent.id, ComponentModel.SupplierID);
            var Distycomponent = this.Context.Database.SqlQuery<ComponentViewModel>(distyquery).FirstOrDefault();
            if (Distycomponent != null)
            {
                if (!isPricing)
                {
                    //check part status is obsolete, then set obsolete date for part
                    if ((ComponentModel.partStatusID ?? MFGcomponent.partStatus) == ConstantHelper.Obsolete_Status)
                    {
                        if (ComponentModel.obsoleteDate == null)
                        {
                            if (Distycomponent.obsoleteDate != null)
                            {
                                ComponentModel.obsoleteDate = Distycomponent.obsoleteDate.Value;
                            }
                            else if (MFGcomponent.obsoleteDate != null)
                            {
                                ComponentModel.obsoleteDate = MFGcomponent.obsoleteDate.Value;
                            }
                            else if (ComponentModel.obsoleteDate != null)
                            {
                                ComponentModel.obsoleteDate = ComponentModel.obsoleteDate.Value;
                            }
                            else if (ComponentModel.ltbDate != null)
                            {
                                ComponentModel.obsoleteDate = ComponentModel.ltbDate.Value.AddDays(1);
                            }
                            else if (Distycomponent.ltbDate != null)
                            {
                                ComponentModel.obsoleteDate = Distycomponent.ltbDate.Value.AddDays(1);
                            }
                            else
                            {
                                ComponentModel.obsoleteDate = Helper.Helper.GetCurrentLocalDate();
                            }
                        }
                    }
                    else
                    {
                        ComponentModel.obsoleteDate = null;
                    }
                    string query = string.Empty;
                    string queryDistAttribute = string.Empty;
                    Distycomponent.detailDescription = Distycomponent.detailDescription != null ? Distycomponent.detailDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : "";
                    bool isDistyAttributesUpdated = false;
                    if (ComponentModel.ltbDate != null ||
                        (string.IsNullOrEmpty(Distycomponent.rohsText) && !string.IsNullOrEmpty(ComponentModel.rohsText)) ||
                        (string.IsNullOrEmpty(Distycomponent.dataSheetLink) && !string.IsNullOrEmpty(ComponentModel.dataSheetLink)) ||
                        ComponentModel.eolDate != null ||
                        (!string.IsNullOrEmpty(ComponentModel.partStatusText) && ComponentModel.partStatusText != Distycomponent.partStatusText) ||
                        (string.IsNullOrEmpty(Distycomponent.detailDescription) && !string.IsNullOrEmpty(ComponentModel.detailDescription)) ||
                        ComponentModel.obsoleteDate != null ||
                        (string.IsNullOrEmpty(Distycomponent.mfrNameText) && !string.IsNullOrEmpty(ComponentModel.manufacturerName)) ||
                        ((Distycomponent.connecterTypeID == null || Distycomponent.connecterTypeID == ConstantHelper.None_Status) && ComponentModel.connectorTypeID != null) ||
                        (Distycomponent.partPackageID == null && ComponentModel.partPackageID != null) ||
                        (Distycomponent.packageQty == null && !string.IsNullOrEmpty(ComponentModel.minimum)) ||
                        (Distycomponent.umidSPQ == null && !string.IsNullOrEmpty(ComponentModel.minimum)) ||
                        (string.IsNullOrEmpty(Distycomponent.minimum) && !string.IsNullOrEmpty(ComponentModel.minimum)) ||
                        (Distycomponent.mult == null && !string.IsNullOrEmpty(ComponentModel.mult)) ||
                        (Distycomponent.price == null && ComponentModel.UnitPrice != null)
                        )
                    {
                        isDistyAttributesUpdated = true;
                    }
                    if (Distycomponent.isCloudApiUpdateAttribute)
                    {
                        if (!isDistyAttributesUpdated && (
                        (Distycomponent.leadTime == null && ComponentModel.leadTime != null) ||
                        (string.IsNullOrEmpty(Distycomponent.noOfRowsText) && !string.IsNullOrEmpty(ComponentModel.noOfRowsText)) ||
                        (string.IsNullOrEmpty(Distycomponent.tolerance) && !string.IsNullOrEmpty(ComponentModel.tolerance)) ||
                        (Distycomponent.minOperatingTemp == null && ComponentModel.minOperatingTemp != null) ||
                        (Distycomponent.maxOperatingTemp == null && ComponentModel.maxOperatingTemp != null) ||
                        (string.IsNullOrEmpty(Distycomponent.weight) && !string.IsNullOrEmpty(ComponentModel.weight)) ||
                        (string.IsNullOrEmpty(Distycomponent.sizeDimension) && !string.IsNullOrEmpty(ComponentModel.sizeDimension)) ||
                        (string.IsNullOrEmpty(Distycomponent.operatingTemp) && !string.IsNullOrEmpty(ComponentModel.operatingTemp)) ||
                        (string.IsNullOrEmpty(Distycomponent.heightText) && !string.IsNullOrEmpty(ComponentModel.heightText)) ||
                        (string.IsNullOrEmpty(Distycomponent.feature) && !string.IsNullOrEmpty(ComponentModel.feature)) ||
                        (string.IsNullOrEmpty(Distycomponent.functionalCategoryText) && !string.IsNullOrEmpty(ComponentModel.functionalCategoryText)) ||
                        (string.IsNullOrEmpty(Distycomponent.mountingTypeText) && !string.IsNullOrEmpty(ComponentModel.mountingType)) ||
                        (string.IsNullOrEmpty(Distycomponent.voltage) && !string.IsNullOrEmpty(ComponentModel.voltage)) ||
                        (string.IsNullOrEmpty(Distycomponent.pitchMating) && !string.IsNullOrEmpty(ComponentModel.pitchMating)) ||
                        (string.IsNullOrEmpty(Distycomponent.pitch) && !string.IsNullOrEmpty(ComponentModel.pitch)) ||
                        (string.IsNullOrEmpty(Distycomponent.powerRating) && !string.IsNullOrEmpty(ComponentModel.powerRating)) ||
                        (string.IsNullOrEmpty(Distycomponent.noOfPositionText) && !string.IsNullOrEmpty(ComponentModel.noOfPositionText)) ||
                        (string.IsNullOrEmpty(Distycomponent.value) && !string.IsNullOrEmpty(ComponentModel.value)) ||
                        (string.IsNullOrEmpty(Distycomponent.temperatureCoefficient) && !string.IsNullOrEmpty(ComponentModel.temperatureCoefficient)) ||
                        (string.IsNullOrEmpty(Distycomponent.color) && !string.IsNullOrEmpty(ComponentModel.color)) ||
                        (Distycomponent.packagingID == null && ComponentModel.packagingID != null)))
                        {
                            isDistyAttributesUpdated = true;
                        }
                        if (isDistyAttributesUpdated)
                        {
                            query = string.Format("update component set ltbDate='{2}',leadTime={3},packaging='{4}'," +
                   "minimum='{5}',mult='{6}',rohsText='{7}',dataSheetLink='{8}',eolDate='{9}'," +
                   "partStatusText='{10}', partStatus={11},RoHSStatusID={12}," +
                   "refSupplierMfgpnComponentID={13},packagingID={14},price={15}," +
                   "isReversal={16},detailDescription='{17}',obsoleteDate='{18}',mfrNameText='{19}'," +
                   "updatedBy='Auto',updatedAt=UTC_TIMESTAMP() ,packageQty='{20}',umidSPQ='{21}', updateByRoleId = '{22}' where mfgPN='{1}' and mfgCodeID={0} and isDeleted=0",
                   Distycomponent.mfgcodeID, ComponentModel.distPN,
                   ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                   Distycomponent.leadTime ?? ComponentModel.leadTime,
                   string.IsNullOrEmpty(Distycomponent.packaging) ? ComponentModel.packaging : Distycomponent.packaging,
                  
                  string.IsNullOrEmpty(Distycomponent.minimum) ? ComponentModel.minimum : Distycomponent.minimum,
                  Distycomponent.mult != null ? Distycomponent.mult.ToString() : ComponentModel.mult,
                  string.IsNullOrEmpty(Distycomponent.rohsText) ? ComponentModel.rohsText : Distycomponent.rohsText,
                    ComponentModel.dataSheetLink != null ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ComponentModel.dataSheetLink, ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                   ComponentModel.partStatusText,
                   ComponentModel.partStatusID ?? MFGcomponent.partStatus, MFGcomponent.RoHSStatusID ?? ComponentModel.RoHSStatusID,
                   MFGcomponent.id, Distycomponent.packagingID ?? ComponentModel.packagingID, Distycomponent.price ?? ComponentModel.UnitPrice,
                   isReversal, 
                   string.IsNullOrEmpty(Distycomponent.detailDescription) ? ComponentModel.detailDescription : Distycomponent.detailDescription,
                   ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                   string.IsNullOrEmpty(Distycomponent.mfrNameText) ? ComponentModel.manufacturerName : Distycomponent.mfrNameText,
                   Distycomponent.packageQty == null ? ComponentModel.minimum : Distycomponent.packageQty.ToString(),
                   Distycomponent.umidSPQ == null ? ComponentModel.minimum : Distycomponent.umidSPQ.ToString(), SARoleID
                   );

                            queryDistAttribute = string.Format("update component_attributes set " +
                   "noOfPositionText='{1}',tolerance='{2}'," +
                   "minOperatingTemp='{3}',maxOperatingTemp='{4}',weight='{5}',sizeDimension='{6}',operatingTemp='{7}',heightText='{8}'," +
                   "feature='{9}',functionalCategoryText='{10}',mountingTypeText='{11}', connectorTypeText='{12}'," +
                   "connecterTypeID={13},partPackage='{14}',voltage='{15}',pitchMating='{16}',pitch='{17}',powerRating='{18}',noOfRowsText='{19}',`value`='{20}',temperatureCoefficient='{21}'," +
                   "temperatureCoefficientValue={22},temperatureCoefficientUnit='{23}',color='{24}',partPackageID={25}," +
                   "mountingTypeID={26},functionalCategoryID={27}," +
                   "updatedBy='Auto',updatedAt=UTC_TIMESTAMP() ,updateByRoleId ='{28}' where refComponentID={0} and isDeleted=0",
                   MFGcomponent.id,
                  string.IsNullOrEmpty(Distycomponent.noOfPositionText) ? ComponentModel.noOfPositionText : Distycomponent.noOfPositionText,
                  string.IsNullOrEmpty(Distycomponent.tolerance) ? ComponentModel.tolerance : Distycomponent.tolerance,
                   (Distycomponent.minOperatingTemp == null) ? ComponentModel.minOperatingTemp : Distycomponent.minOperatingTemp,
                   (Distycomponent.maxOperatingTemp == null) ? ComponentModel.maxOperatingTemp : Distycomponent.maxOperatingTemp,
                   string.IsNullOrEmpty(Distycomponent.weight) ? ComponentModel.weight : Distycomponent.weight,
                   string.IsNullOrEmpty(Distycomponent.sizeDimension) ? ((!string.IsNullOrEmpty(ComponentModel.sizeDimension) ? ComponentModel.sizeDimension.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : Distycomponent.sizeDimension,
                   string.IsNullOrEmpty(Distycomponent.operatingTemp) ? ((!string.IsNullOrEmpty(ComponentModel.operatingTemp) ? ComponentModel.operatingTemp.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : Distycomponent.operatingTemp,
                   string.IsNullOrEmpty(Distycomponent.heightText) ? ComponentModel.heightText : Distycomponent.heightText,
                   string.IsNullOrEmpty(Distycomponent.feature) ? ((!string.IsNullOrEmpty(ComponentModel.feature) ? ComponentModel.feature.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : Distycomponent.feature,
                   string.IsNullOrEmpty(Distycomponent.functionalCategoryText)? ComponentModel.functionalCategoryText: Distycomponent.functionalCategoryText, string.IsNullOrEmpty(Distycomponent.mountingTypeText)?ComponentModel.mountingType: Distycomponent.mountingTypeText,
                   string.IsNullOrEmpty(Distycomponent.connectorTypeText)? ComponentModel.connectorTypeText: Distycomponent.connectorTypeText, (Distycomponent.connecterTypeID != null || Distycomponent.connecterTypeID == ConstantHelper.None_Status) ? ComponentModel.connectorTypeID : Distycomponent.connecterTypeID,
                   string.IsNullOrEmpty(Distycomponent.partPackage) ? ComponentModel.partPackage : Distycomponent.partPackage,
                   string.IsNullOrEmpty(Distycomponent.voltage) ? ComponentModel.voltage : Distycomponent.voltage,
                   string.IsNullOrEmpty(Distycomponent.pitchMating) ? ((!string.IsNullOrEmpty(ComponentModel.pitchMating) ? ComponentModel.pitchMating.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : Distycomponent.pitchMating,
                   string.IsNullOrEmpty(Distycomponent.pitch) ? ((!string.IsNullOrEmpty(ComponentModel.pitch) ? ComponentModel.pitch.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null)) : Distycomponent.pitch,
                   string.IsNullOrEmpty(Distycomponent.powerRating) ? ComponentModel.powerRating : Distycomponent.powerRating,
                   string.IsNullOrEmpty(Distycomponent.noOfRowsText) ? ComponentModel.noOfRowsText : Distycomponent.noOfRowsText,
                   string.IsNullOrEmpty(Distycomponent.value) ? ComponentModel.value : Distycomponent.value,
                   string.IsNullOrEmpty(Distycomponent.temperatureCoefficient) ? ComponentModel.temperatureCoefficient : Distycomponent.temperatureCoefficient,
                   Distycomponent.temperatureCoefficientValue ?? ComponentModel.temperatureCoefficientValue, Distycomponent.temperatureCoefficientUnit ?? ComponentModel.temperatureCoefficientUnit,
                   string.IsNullOrEmpty(Distycomponent.color) ? ComponentModel.color : Distycomponent.color,
                   (ComponentModel.partPackageID != null ? ComponentModel.partPackageID : MFGcomponent.partPackageID), Distycomponent.mountingTypeID != ConstantHelper.None_Status ? Distycomponent.mountingTypeID : (ComponentModel.mountingTypeID != null ? ComponentModel.mountingTypeID : ConstantHelper.None_Status),
                   Distycomponent.functionalCategoryID != ConstantHelper.None_Status ? Distycomponent.functionalCategoryID : (ComponentModel.functionalCategoryID != null ? ComponentModel.functionalCategoryID : ConstantHelper.None_Status),SARoleID
                   );
                            distpartAttributeList = getPartUpdatedAttributes(Distycomponent, ComponentModel, false);
                        }

                    }
                    else if (isDistyAttributesUpdated)
                    {
                        query = string.Format("update component set ltbDate='{2}'," +
                        "rohsText='{3}',dataSheetLink='{4}',eolDate='{5}'," +
                        "partStatusText='{6}',partStatus={7},RoHSStatusID={8}," +
                        "refSupplierMfgpnComponentID={9},updatedBy='Auto'," +
                        "updatedAt=UTC_TIMESTAMP(),price={10},detailDescription='{11}',obsoleteDate='{12}',mfrNameText='{13}', " +
                        "minimum='{14}',mult='{15}',packageQty ='{16}',umidSPQ='{17}',updateByRoleId = '{18}' where mfgPN='{0}' and mfgCodeID={1} and isDeleted=0",
                       ComponentModel.distPN, Distycomponent.mfgcodeID, ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                        string.IsNullOrEmpty(Distycomponent.rohsText) ? ComponentModel.rohsText : Distycomponent.rohsText, ComponentModel.dataSheetLink != null ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ComponentModel.dataSheetLink,
                        ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                        ComponentModel.partStatusText, ComponentModel.partStatusID ?? MFGcomponent.partStatus, MFGcomponent.RoHSStatusID ?? ComponentModel.RoHSStatusID,
                        MFGcomponent.id,
                        Distycomponent.price ?? ComponentModel.UnitPrice, string.IsNullOrEmpty(Distycomponent.detailDescription) ? ComponentModel.detailDescription : Distycomponent.detailDescription,
                        ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                        string.IsNullOrEmpty(Distycomponent.mfrNameText) ? ComponentModel.manufacturerName : Distycomponent.mfrNameText,
                        string.IsNullOrEmpty(Distycomponent.minimum) ? ComponentModel.minimum : Distycomponent.minimum,
                        Distycomponent.mult != null ? Distycomponent.mult.ToString() : ComponentModel.mult,
                        Distycomponent.packageQty == null ? ComponentModel.minimum : Distycomponent.packageQty.ToString(),
                        Distycomponent.umidSPQ == null ? ComponentModel.minimum : Distycomponent.umidSPQ.ToString(), SARoleID);

                        queryDistAttribute = string.Format("update component_attributes set" +
                        "connectorTypeText='{1}',connecterTypeID={2},partPackageID={3},updatedBy='Auto'," +
                        "updatedAt=UTC_TIMESTAMP(), " +
                        "updateByRoleId = '{4}' where refComponentID={0} and isDeleted=0",
                        MFGcomponent.id, string.IsNullOrEmpty(Distycomponent.connectorTypeText)? ComponentModel.connectorTypeText: Distycomponent.connectorTypeText
                        , (Distycomponent.connecterTypeID == null || Distycomponent.connecterTypeID == ConstantHelper.None_Status) ? ComponentModel.connectorTypeID : Distycomponent.connecterTypeID
                        , (Distycomponent.partPackageID != null ? ComponentModel.partPackageID : Distycomponent.partPackageID)
                        , SARoleID);
                    }
                    query = query.Replace("=''", "=NULL");
                    query = query.Replace("=,", "=NULL,");
                    if (!string.IsNullOrEmpty(query))
                        this.Context.Database.ExecuteSqlCommand(query);

                    queryDistAttribute = queryDistAttribute.Replace("=''", "=NULL");
                    queryDistAttribute = queryDistAttribute.Replace("=,", "=NULL,");
                    if (!string.IsNullOrEmpty(queryDistAttribute))
                        this.Context.Database.ExecuteSqlCommand(queryDistAttribute);
                    // upadte detail to save
                    if (Distycomponent != null)
                    {
                        ManageUpdatedAPIDetail(Distycomponent.id, ComponentModel.SupplierID);
                    }
                    savePartUpdatedAttributes(distpartAttributeList);
                    if (isDistyAttributesUpdated)
                    {
                        addPartIntoPendingElasticSync(Distycomponent.id);
                    }
                    //update manufacturer part
                }
                return 1;
            }
            else if (MFGcomponent != null && !string.IsNullOrEmpty(ComponentModel.distPN) && ComponentModel.distPN != "N/A")
            {

                ComponentModel.mfgPnDescription = !(string.IsNullOrEmpty(ComponentModel.mfgPnDescription)) ? ComponentModel.mfgPnDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ConstantHelper.Description;
                ComponentModel.distPN = ComponentModel.distPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
                ComponentModel.imageURL = ComponentModel.imageURL != null ? ComponentModel.imageURL.Replace(@"\", @"\\").Replace("\"", "\\\"").Replace("'", "\\'") : null;
                string mfgCodeName = string.Format("select mfgCode from mfgcodemst where id={0}", ComponentModel.SupplierID);
                var codeName = this.Context.Database.SqlQuery<string>(mfgCodeName).FirstOrDefault();
                string mfgcodeDist = string.Format("{0}+{1}", codeName != null ? codeName : supplier, ComponentModel.distPN);
                string checkDuplicate = string.Format("select id from component where PIDCode='{0}' and deletedAt is null", mfgcodeDist);
                var Distycomp = this.Context.Database.SqlQuery<int?>(checkDuplicate).FirstOrDefault();
                if (Distycomp == null)
                {
                    var serialNumber = GetComponentSerialNumber("SPNSystemID");

                    ComponentModel.productionPN = GenerateProductionPN(ComponentModel.distPN);

                    //check part status is obsolete, then set obsolete date for part
                    if (MFGcomponent.partStatus == ConstantHelper.Obsolete_Status)
                    {
                        if (ComponentModel.obsoleteDate == null)
                        {
                            if (ComponentModel.ltbDate != null)
                            {
                                ComponentModel.obsoleteDate = ComponentModel.ltbDate.Value.AddDays(1);
                            }
                            else
                            {
                                ComponentModel.obsoleteDate = Helper.Helper.GetCurrentLocalDate();
                            }
                        }
                    }
                    //supplier part creation
                    //MFGcomponent mfg part model
                    //ComponentModel supplier part model
                    string insertQuery = string.Format(@"INSERT INTO component(imageURL,mfgPN,mfgcodeID,mfgPNDescription,packageQty,partStatus,
                                                    ltbDate, RoHSStatusID, isDeleted, createdBy, PIDCode,
                                                    isGoodPart, leadTime, packaging, uom,
                                                     minimum, mult, uomText, category,
                                                    rohsText, dataSheetLink, eolDate,
                                                    partStatusText,
                                                     mslID,
                                                    costCategoryID,
                                                    partType, refSupplierMfgpnComponentID,unit,packagingID,epicorType,updatedBy,price,uomClassID,createdAt,updatedAt,serialNumber,detailDescription,obsoleteDate,refMfgPNMfgCodeId,productionPN,mfrNameText,
                                                    isFluxNotApplicable, createByRoleId, updateByRoleId, umidSPQ,mfgType)
                                                  VALUES('{0}','{1}',{2},'{3}',{4},{5},'{6}',{7},{8},'{9}','{10}',{11},{12},'{13}',{14},'{15}','{16}','{17}',{18},'{19}','{20}','{21}','{22}',{23},{24},{25},{26},{27},{28},'{29}','{30}',{31},{32},UTC_TIMESTAMP(),UTC_TIMESTAMP(),'{33}','{34}','{35}',{36},'{37}','{38}',{39},{40},{41},'{42}','{43}')",
                                                        ComponentModel.imageURL, ComponentModel.distPN, ComponentModel.SupplierID, ComponentModel.mfgPnDescription ?? MFGcomponent.mfgPNDescription, ComponentModel.minimum == null ? "1" : ComponentModel.minimum, MFGcomponent.partStatus,
                                                        ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null, MFGcomponent.RoHSStatusID ?? ComponentModel.RoHSStatusID, 0, "Auto", mfgcodeDist,
                                                        1, ComponentModel.leadTime, ComponentModel.packaging, MFGcomponent.uom,
                                                       ComponentModel.minimum, ComponentModel.mult, ComponentModel.uomText, MFGcomponent.category,
                                                        ComponentModel.rohsText, ComponentModel.dataSheetLink != null ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ComponentModel.dataSheetLink, ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                                                         ComponentModel.partStatusText, 
                                                        MFGcomponent.mslID,
                                                        MFGcomponent.costCategoryID,
                                                        MFGcomponent.partType, MFGcomponent.id, 1, ComponentModel.packagingID, "Purchased", "Auto", ComponentModel.UnitPrice, MFGcomponent.uomClassID, serialNumber,
                                                        ComponentModel.detailDescription != null ? ComponentModel.detailDescription : "",
                                                        ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null, MFGcomponent.mfgcodeID,
                                                        ComponentModel.productionPN, ComponentModel.manufacturerName, 1, SARoleID, SARoleID, ComponentModel.minimum == null ? "1" : ComponentModel.minimum, ConstantHelper.DISTType);
                    insertQuery = insertQuery.Replace("(,", "(NULL,");
                    insertQuery = insertQuery.Replace(",)", ",NULL)");
                    insertQuery = insertQuery.Replace(",,,,", ",NULL,NULL,NULL,");
                    insertQuery = insertQuery.Replace(",,,", ",NULL,NULL,");
                    insertQuery = insertQuery.Replace(",,", ",NULL,");
                    insertQuery = insertQuery.Replace(",'',", ",NULL,");
                    insertQuery = insertQuery.Replace(",''", ",NULL");
                    insertQuery = insertQuery.Replace(",,", ",NULL,");
                    this.Context.Database.ExecuteSqlCommand(insertQuery);
                    // save or update supplier external API detail
                    updateSupplierExternalAPI(MFGcomponent.id, ComponentModel.SupplierID, externalAPI, SARoleID);

                    //serial number
                    //enter into alias table 
                    string distyinsertquery = string.Format("select mfgPN,mfgcodeID,noOfPosition,PIDCode,noOfRows,packageQty,id,uom,packaging,mfgPNDescription,mountingTypeID,partPackage,category,value,tolerance,minOperatingTemp,maxOperatingTemp,functionalCategoryID,mslID,connecterTypeID,costCategoryID,operatingTemp,partType  from vu_component_spn where mfgPN='{0}' and refSupplierMfgpnComponentID={1} and mfgcodeID={2} and isDeleted=0", ComponentModel.distPN, MFGcomponent.id, ComponentModel.SupplierID);
                    var DistyInsertcomponent = this.Context.Database.SqlQuery<ComponentViewModel>(distyinsertquery).FirstOrDefault();
                    if (DistyInsertcomponent != null)
                    {
                        // insert detail to save
                        if (DistyInsertcomponent != null)
                        {
                            ManageUpdatedAPIDetail(DistyInsertcomponent.id, ComponentModel.SupplierID);
                        }
                        //string saveAlias = string.Format("INSERT INTO component_alias(aliasgroupID,componentID,isDeleted,createdBy)VALUES({0},{1},0,'Auto')", MFGcomponent.aliasgroupID, DistyInsertcomponent.id);
                        //this.Context.Database.ExecuteSqlCommand(saveAlias);

                        //enter images for the disty part
                        if (ComponentModel.ComponentImages != null && ComponentModel.ComponentImages.Count() > 0)
                        {
                            // var componentImages = ComponentModel.ComponentImages.GroupBy(a => a.imageURL).Select(a => new ComponentImages { imageURL = a.Key }).ToList();
                            foreach (ComponentImages component in ComponentModel.ComponentImages)
                            {
                                if (!string.IsNullOrEmpty(component.imageURL))
                                {
                                    string saveImages = string.Format("INSERT INTO component_images(imageURL,refComponentID,createdBy,updatedBy,isDeleted, createByRoleId, updateByRoleId)VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", component.imageURL != null ? component.imageURL.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : component.imageURL, DistyInsertcomponent.id, SARoleID, SARoleID);
                                    saveImages = saveImages.Replace("(,", "(NULL,");
                                    saveImages = saveImages.Replace("('',", "(NULL,");
                                    this.Context.Database.ExecuteSqlCommand(saveImages);
                                }
                            }
                        }
                        //enter data sheet links
                        if (ComponentModel.DataSheets != null && ComponentModel.DataSheets.Count() > 0)
                        {
                            foreach (DataSheetURL component in ComponentModel.DataSheets)
                            {
                                if (!string.IsNullOrEmpty(component.SheetURL))
                                {
                                    string dataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted, createByRoleId, updateByRoleId)VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", component.SheetURL != null ? component.SheetURL.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : component.SheetURL, DistyInsertcomponent.id, SARoleID, SARoleID);
                                    dataSheets = dataSheets.Replace("(,", "(NULL,");
                                    dataSheets = dataSheets.Replace("('',", "(NULL,");
                                    this.Context.Database.ExecuteSqlCommand(dataSheets);
                                }
                            }
                        }
                        else if (!string.IsNullOrEmpty(ComponentModel.dataSheetLink))
                        {
                            var sheetUrl = ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
                            string dataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted, createByRoleId, updateByRoleId)VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", sheetUrl, DistyInsertcomponent.id, SARoleID, SARoleID);
                            dataSheets = dataSheets.Replace("(,", "(NULL,");
                            dataSheets = dataSheets.Replace("('',", "(NULL,");
                            this.Context.Database.ExecuteSqlCommand(dataSheets);
                        }
                        addPartIntoPendingElasticSync(DistyInsertcomponent.id);
                    }
                }
            }
            return 1;
        }

        public void ManageUpdatedAPIDetail(int componentID, int? supplierID)
        {

            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pcomponentID", componentID),
                        new MySqlParameter("psupplierID", supplierID)
                 };
            this.Context.Database.ExecuteSqlCommand("call Sproc_manageComponentLastExternalAPICall (@pcomponentID,@psupplierID)", parameters);
        }

        //create Mfr parts
        public int SaveComponentDetails(ComponentModel ComponentModel)
        {

            ComponentModel.mfgPN = ComponentModel.mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            ComponentModel.manufacturerName = ComponentModel.manufacturerName.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            int SARoleID = getSuperAdminRoleID();
            //for manufacturer part number update
            string mfgPartQuery = string.Format("select id,mfgPN,mfgcodeID  from component where mfgPN='{0}' and mfgcodeID={1}  and isDeleted=0", ComponentModel.mfgPN, ComponentModel.mfgcodeID);
            var MFGcomponent = this.Context.Database.SqlQuery<ComponentViewModel>(mfgPartQuery).FirstOrDefault();
            if (MFGcomponent == null)
            {
                if (ComponentModel.PIDCode == null) { return 1; }
                ComponentModel.mfgPnDescription = !(string.IsNullOrEmpty(ComponentModel.mfgPnDescription)) ? ComponentModel.mfgPnDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ConstantHelper.Description;
                ComponentModel.detailDescription = ComponentModel.detailDescription != null ? ComponentModel.detailDescription.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : "";
                ComponentModel.sizeDimension = ComponentModel.sizeDimension != null ? ComponentModel.sizeDimension.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.feature = ComponentModel.feature != null ? ComponentModel.feature.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.operatingTemp = ComponentModel.operatingTemp != null ? ComponentModel.operatingTemp.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.pitch = ComponentModel.pitch != null ? ComponentModel.pitch.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.pitchMating = ComponentModel.pitchMating != null ? ComponentModel.pitchMating.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.weight = ComponentModel.weight != null ? ComponentModel.weight.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : null;
                ComponentModel.PIDCode = ComponentModel.PIDCode.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
                ComponentModel.RoHSStatusID = ComponentModel.RoHSStatusID ?? 1;
                ComponentModel.functionalCategoryID = ComponentModel.functionalCategoryID ?? ConstantHelper.None_Status;
                ComponentModel.mountingTypeID = ComponentModel.mountingTypeID ?? ConstantHelper.None_Status;
                if (string.IsNullOrEmpty(ComponentModel.mountingType))
                {
                    ComponentModel.mountingType = ConstantHelper.TBD;
                }
                if (string.IsNullOrEmpty(ComponentModel.functionalCategoryText))
                {
                    ComponentModel.functionalCategoryText = ConstantHelper.TBD;
                }

                var serialNumber = GetComponentSerialNumber("MPNSystemID");

                ComponentModel.productionPN = GenerateProductionPN(ComponentModel.mfgPN);

                //check part status is obsolete, then set obsolete date for part
                if (ComponentModel.partStatusID == ConstantHelper.Obsolete_Status)
                {
                    if (ComponentModel.obsoleteDate == null)
                    {
                        if (ComponentModel.ltbDate != null)
                        {
                            ComponentModel.obsoleteDate = ComponentModel.ltbDate.Value.AddDays(1);
                        }
                        else
                        {
                            ComponentModel.obsoleteDate = Helper.Helper.GetCurrentLocalDate();
                        }
                    }
                }
                else
                {
                    ComponentModel.obsoleteDate = null;
                }
                if (!String.IsNullOrEmpty(ComponentModel.feature) && ComponentModel.feature.ToLower().Contains(ConstantHelper.Epoxy))
                {
                    ComponentModel.isEpoxyMount = true;
                }
                string rohsCategory = string.Format("select refMainCategoryID from  rfq_rohsmst where id={0}", ComponentModel.RoHSStatusID);
                int rohsCatID = this.Context.Database.SqlQuery<int>(rohsCategory).FirstOrDefault();

                //insert manufacturer part
                //
                string insertQuery = string.Format(@"INSERT INTO component(imageURL,mfgPN,mfgcodeID,mfgPNDescription,packageQty,partStatus,
                                                    ltbDate, RoHSStatusID, isDeleted, createdBy, PIDCode,
                                                    isGoodPart, leadTime, packaging, uom,
                                                    minimum, mult, uomText, category,
                                                    rohsText, dataSheetLink, eolDate,partStatusText,
                                                    maxPriceLimit, mslID,costCategoryID,
                                                    partType, refSupplierMfgpnComponentID,unit,packagingID,epicorType,updatedBy,
                                                    price,uomClassID,createdAt,updatedAt,serialNumber,detailDescription,
                                                    obsoleteDate,productionPN,mfrNameText, isFluxNotApplicable, createByRoleId, updateByRoleId, umidSPQ,mfgType)
                                                  VALUES('{0}','{1}',{2},'{3}',{4},{5},'{6}',{7},{8},'{9}','{10}',
                                                        {11},{12},'{13}',{14},
                                                        {15},{16},'{17}',{18},
                                                        '{19}','{20}','{21}','{22}',{23},{24},{25},
                                                         {26},{27},{28},{29},'{30}','{31}',
                                                        {32},{33},UTC_TIMESTAMP(),UTC_TIMESTAMP(),'{34}','{35}','{36}','{37}','{38}',{39},'{40}','{41}','{42}','{43}')",
                                                    ComponentModel.imageURL != null ? ComponentModel.imageURL.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"") : ComponentModel.imageURL, ComponentModel.mfgPN, ComponentModel.mfgcodeID, ComponentModel.mfgPnDescription, ComponentModel.minimum == null ? "1" : ComponentModel.minimum, ComponentModel.partStatusID,
                                                    ComponentModel.ltbDate != null ? ComponentModel.ltbDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null, ComponentModel.RoHSStatusID, 0, "Auto", ComponentModel.PIDCode,
                                                    1, ComponentModel.leadTime, ComponentModel.packaging, ComponentModel.uomID,
                                                    ComponentModel.minimum, ComponentModel.mult, ComponentModel.uomText, ComponentModel.category,
                                                    ComponentModel.rohsText, ComponentModel.dataSheetLink != null ? ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'") : ComponentModel.dataSheetLink, ComponentModel.eolDate != null ? ComponentModel.eolDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null, ComponentModel.partStatusText, null, null, ComponentModel.costCategoryID,
                                                    ComponentModel.category, null, 1, ComponentModel.packagingID, "Purchased", "Auto", ComponentModel.UnitPrice, ComponentModel.uomClassID, serialNumber,
                                                    ComponentModel.detailDescription,
                                                    ComponentModel.obsoleteDate != null ? ComponentModel.obsoleteDate.Value.ToString(ConstantHelper.DateTimeFormatForDB) : null,
                                                    ComponentModel.productionPN, ComponentModel.manufacturerName, 1, SARoleID, SARoleID, ComponentModel.minimum == null ? "1" : ComponentModel.minimum, ConstantHelper.MFGType);
                insertQuery = insertQuery.Replace("(,", "(NULL,");
                insertQuery = insertQuery.Replace(",)", ",NULL)");
                insertQuery = insertQuery.Replace(",,,,", ",NULL,NULL,NULL,");
                insertQuery = insertQuery.Replace(",,,", ",NULL,NULL,");
                insertQuery = insertQuery.Replace(",,", ",NULL,");
                insertQuery = insertQuery.Replace(",'',", ",NULL,");
                insertQuery = insertQuery.Replace(",'',", ",NULL,");
                insertQuery = insertQuery.Replace(",,", ",NULL,");
                insertQuery = insertQuery.Replace(",''", ",NULL");
                insertQuery = insertQuery.Replace(",,", ",NULL,");
                this.Context.Database.ExecuteSqlCommand(insertQuery);


                //serial number

                //enter into alias table 
                string mfgselectQuery = string.Format("select id  from component where mfgPN='{0}' and mfgcodeID={1} and isDeleted=0", ComponentModel.mfgPN, ComponentModel.mfgcodeID);
                var MfgInsertcomponent = this.Context.Database.SqlQuery<ComponentViewModel>(mfgselectQuery).FirstOrDefault();
                if (MfgInsertcomponent != null)
                {
                    ICommonApiPricing _ICommonApiPricing = UnityConfig.Container.Resolve<ICommonApiPricing>();
                    //enter images for the disty part
                    if (ComponentModel.ComponentImages != null && ComponentModel.ComponentImages.Count() > 0)
                    {
                        foreach (ComponentImages component in ComponentModel.ComponentImages)
                        {
                            if (!string.IsNullOrEmpty(component.imageURL))
                            {
                                string saveImages = string.Format("INSERT INTO component_images(imageURL,refComponentID,createdBy,updatedBy,isDeleted,createByRoleId, updateByRoleId)VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", component.imageURL != null ? component.imageURL.Replace(@"\", @"\\").Replace("'", "\\'") : component.imageURL, MfgInsertcomponent.id, SARoleID, SARoleID);
                                saveImages = saveImages.Replace("(,", "(NULL,");
                                saveImages = saveImages.Replace("('',", "(NULL,");
                                this.Context.Database.ExecuteSqlCommand(saveImages);
                            }
                        }
                    }
                    //enter data sheet links
                    if (ComponentModel.DataSheets != null && ComponentModel.DataSheets.Count() > 0)
                    {
                        foreach (DataSheetURL component in ComponentModel.DataSheets)
                        {
                            if (!string.IsNullOrEmpty(component.SheetURL))
                            {
                                string dataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted,createByRoleId, updateByRoleId) VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", component.SheetURL != null ? component.SheetURL.Replace(@"\", @"\\").Replace("'", "\\'") : component.SheetURL, MfgInsertcomponent.id, SARoleID, SARoleID);
                                dataSheets = dataSheets.Replace("(,", "(NULL,");
                                dataSheets = dataSheets.Replace("('',", "(NULL,");
                                this.Context.Database.ExecuteSqlCommand(dataSheets);
                                if (component.SheetURL.Contains(".pdf"))
                                {
                                    string lastID = "SELECT MAX(id) FROM component_datasheets";
                                    var id = this.Context.Database.SqlQuery<int>(lastID).FirstOrDefault();
                                    DataSheetComponentModel model = new DataSheetComponentModel()
                                    {
                                        refComponentID = MfgInsertcomponent.id,
                                        datasheetURL = component.SheetURL,
                                        id = id,
                                        saRoleID = SARoleID
                                    };
                                    Thread.Sleep(500);
                                    _ICommonApiPricing.sendDataSheetDownLoad(model);
                                }
                            }
                        }
                    }
                    else if (!string.IsNullOrEmpty(ComponentModel.dataSheetLink))
                    {
                        var sheetUrl = ComponentModel.dataSheetLink.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
                        string dataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted,createByRoleId, updateByRoleId)VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", sheetUrl, MfgInsertcomponent.id, SARoleID, SARoleID);
                        dataSheets = dataSheets.Replace("(,", "(NULL,");
                        dataSheets = dataSheets.Replace("('',", "(NULL,");
                        var v = this.Context.Database.ExecuteSqlCommand(dataSheets);
                    }

                    // enter component attributes  for mfg part
                    string insertAttributeQuery = string.Format(@" INSERT INTO component_attributes(refComponentID,isCloudApiUpdateAttribute,functionalCategoryID,functionalCategoryText,
                                                                mountingTypeID,mountingTypeText,isEpoxyMount,partPackageID,partPackage,connecterTypeID,connectorTypeText,
                                                               feature,noOfPosition,noOfPositionText,noOfRows,noOfRowsText,operatingTemp,minOperatingTemp,maxOperatingTemp,
                                                                temperatureCoefficient,temperatureCoefficientValue,temperatureCoefficientUnit,pitch,pitchMating,sizeDimension,
                                                                heightText,tolerance,voltage,value,powerRating,weight,color,isDeleted,
                                                                  createdBy,createdAt,createByRoleId,updatedBy,updatedAt,updateByRoleId) Values({0},1,{1},'{2}',{3},'{4}',{5},{6},'{7}',{8},'{9}','{10}',{11},'{12}',{13},'{14}','{15}',{16},{17},'{18}',{19},'{20}','{21}','{22}','{23}','{24}','{25}','{26}','{27}','{28}','{29}','{30}',{31},'Auto',UTC_TIMESTAMP(),'{32}','Auto',UTC_TIMESTAMP(),'{32}')",

                                                                  MfgInsertcomponent.id, ComponentModel.functionalCategoryID, ComponentModel.functionalCategoryText,
                                                                  ComponentModel.mountingTypeID, ComponentModel.mountingType, ComponentModel.isEpoxyMount, ComponentModel.partPackageID, ComponentModel.partPackage, ComponentModel.connectorTypeID, ComponentModel.connectorTypeText,
                                                                  ComponentModel.feature, ComponentModel.noOfPosition, ComponentModel.noOfPositionText ?? string.Empty, ComponentModel.noOfRows, ComponentModel.noOfRowsText ?? string.Empty, ComponentModel.operatingTemp, ComponentModel.minOperatingTemp, ComponentModel.maxOperatingTemp,
                                                                  ComponentModel.temperatureCoefficient, ComponentModel.temperatureCoefficientValue, ComponentModel.temperatureCoefficientUnit, ComponentModel.pitch, ComponentModel.pitchMating, ComponentModel.sizeDimension,
                                                                  ComponentModel.heightText, ComponentModel.tolerance, ComponentModel.voltage, ComponentModel.value, ComponentModel.powerRating, ComponentModel.weight, ComponentModel.color, false, SARoleID);
                    insertAttributeQuery = insertAttributeQuery.Replace("(,", "(NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",)", ",NULL)");
                    insertAttributeQuery = insertAttributeQuery.Replace(",,,,", ",NULL,NULL,NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",,,", ",NULL,NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",,", ",NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",'',", ",NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",'',", ",NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",,", ",NULL,");
                    insertAttributeQuery = insertAttributeQuery.Replace(",''", ",NULL");
                    insertAttributeQuery = insertAttributeQuery.Replace(",,", ",NULL,");
                    this.Context.Database.ExecuteSqlCommand(insertAttributeQuery);
                    // end insert component attributes
                    addPartIntoPendingElasticSync(MfgInsertcomponent.id);
                }
                ComponentModel.componentID = MfgInsertcomponent.id;
                ManageUpdatedAPIDetail(ComponentModel.componentID.Value, ComponentModel.SupplierID);
                int data = UpdateComponentDetail(ComponentModel, ComponentModel.supplierName, false, false);
            }
            else
            {
                ComponentModel.componentID = MFGcomponent.id;
                int data = UpdateComponentDetail(ComponentModel, ComponentModel.supplierName, false, true);
            }
            return MFGcomponent != null ? MFGcomponent.id : ComponentModel.componentID.Value;
        }

        // Update Component Datasheet for Download completed
        public int? updateDataSheetDownloaded(int id)
        {
            string query = string.Format("update component_datasheets set isDownloadCompleted = 1, updatedBy = 'Auto' where id = {0}", id);
            return this.Context.Database.ExecuteSqlCommand(query);
        }
        // Update Component Datasheet for Download completed
        public void addPartIntoPendingElasticSync(int id)
        {
            string entityParamDet = string.Concat("{\"id\": ", id, "}");
            var alreadyAddedQuery = string.Format("Select Count(1) from pending_elastic_entity_sync_data where entityID='{0}'and entityParamDet='{1}'",
                ConstantHelper.DefaultPartEntityID, entityParamDet);
            int isExist = this.Context.Database.SqlQuery<int>(alreadyAddedQuery).FirstOrDefault();
            if (isExist == 0)
            {
                string query = string.Format("INSERT INTO pending_elastic_entity_sync_data(entityID,entityParamDet)" +
                    "VALUES({0},'{1}')", ConstantHelper.DefaultPartEntityID, string.Concat("{\"id\": ", id, "}"));
                this.Context.Database.ExecuteSqlCommand(query);
            }
        }
        // Add New downloaded Component Datasheet
        public int? addDataSheetLocalDownloadFile(string fileName, int refComponentId, int saRoleID)
        {
            if (saRoleID == 0)
            {
                saRoleID = getSuperAdminRoleID();
            }
            string dataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted,createByRoleId,  " +
                "updateByRoleId, isDownloadCompleted)VALUES('{0}',{1},'Auto','Auto',0,{2},{3}, 1)", fileName, refComponentId, saRoleID, saRoleID);
            dataSheets = dataSheets.Replace("(,", "(NULL,");
            dataSheets = dataSheets.Replace("('',", "(NULL,");
            return this.Context.Database.ExecuteSqlCommand(dataSheets);
        }
        public int? getPartStatus(string partstatus)
        {
            string query = string.Format("select gencCategoryID from genericcategory where categoryType='Part Status' and isDeleted=0 and isActive=1 and gencCategoryName='{0}'", partstatus);
            return this.Context.Database.SqlQuery<int?>(query).FirstOrDefault();
        }
        //GEt data from attributes and its aliases
        public CommonIDModel getCommonID(string tableName, string commonName, string fieldName)
        {
            string activeFieldName = " cmn.isActive ";
            //added dummy field for UOM table as it does not have field and not required to add
            if (tableName == Helper.Helper.aliasTable.Uoms.ToString())
            {
                activeFieldName = " true as isActive ";
            }

            string query = string.Format("select cmn.id,{3}  from {0} cmn where {2}='{1}' and isDeleted=0  UNION  select cfg.refid, {3} from  component_fields_genericalias_mst cfg join {0} cmn ON cmn.id=cfg.refId where cfg.refTableName='{0}' and cfg.alias='{1}' and cfg.isDeleted=0 and cmn.isDeleted=0", tableName, commonName, fieldName, activeFieldName);
            return this.Context.Database.SqlQuery<CommonIDModel>(query).FirstOrDefault();
        }

        public string getAttributeName(string tableName, int id, string fieldName)
        {
            string query = string.Format("select cmn.{2}   from {0} cmn where cmn.id={1} and cmn.isDeleted=0", tableName, id, fieldName);
            return this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
        }

        // Get Document Path by FileOwner Type and RefTransID
        public GenericFilePathStatus getFilePathByGenricOwnerType(string genericFileOwnerType, int refTransID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                     new MySqlParameter("pRefTransID", refTransID),
                     new MySqlParameter("pGencFileOwnerType", genericFileOwnerType),
                     new MySqlParameter("pIsReturnDetail", true)

              };
            GenericFilePathStatus genericFilePathStatus = new GenericFilePathStatus();
            var procResponse = this.Context.Database.SqlQuery<GenericFilePathStatus>("call Sproc_getRefTransDetailForDocument (@pGencFileOwnerType,@pRefTransID,@pIsReturnDetail)", parameters).ToList();
            genericFilePathStatus = procResponse.Count > 0 ? genericFilePathStatus = procResponse[0] : genericFilePathStatus;
            return genericFilePathStatus;

        }
        public string getCommonName(string fieldName, string tableName, int? id)
        {
            string query = string.Format("select {0} as name from {1} where id={2} and isDeleted=0", fieldName, tableName, id);
            return this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
        }
        public UOMs getUnits(int? ID)
        {
            string query = string.Format("select id,perUnit,baseUnitID,baseUnitConvertValue,abbreviation from uoms where id={0} and isDeleted=0", ID);
            return this.Context.Database.SqlQuery<UOMs>(query).FirstOrDefault();
        }

        public List<ConsolidateMfgPnAlternatePart> GetPackagingAliasDetails(int packaggingID, string componentIDs)
        {
            componentIDs = componentIDs.TrimEnd(',');
            string query = string.Format("SELECT c.mfgPN,c.id mfgPNID,c.mfgCodeID,c.PIDCode,c.packaginggroupID,true as isPackaging,m.mfgCode,m.mfgName  FROM component c LEFT JOIN mfgcodemst m ON m.id = c.mfgcodeID AND m.isDeleted = 0  WHERE c.isCustom = 0  AND c.isDeleted = 0 AND c.packaginggroupID ={0} AND c.id not in ({1}) ", packaggingID, componentIDs);
            var lineitems = this.Context.Database.SqlQuery<ConsolidateMfgPnAlternatePart>(query).ToList();
            return lineitems;
        }
        public ManufacturerViewModel GetManufacturerDetail(string mfgName, string type)
        {
            mfgName = string.IsNullOrEmpty(mfgName) ? "" : mfgName.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("SELECT mg.id,mg.mfgCode,mg.mfgName FROM mfgcodealias ma LEFT JOIN mfgcodemst mg ON mg.id=ma.mfgcodeid WHERE mg.isdeleted = 0 AND ma.isdeleted = 0 AND (mg.mfgName = '{0}' OR mg.mfgcode = '{0}' OR ma.alias = '{0}') AND mg.mfgType = '{1}' LIMIT 1 ", mfgName, type);
            var mfgDetail = this.Context.Database.SqlQuery<ManufacturerViewModel>(query).FirstOrDefault();
            return mfgDetail;
        }
        public List<ManufacturerViewModel> GetAvailableSupplierList()
        {
            string query = string.Format("SELECT id,mfgCode,mfgName FROM mfgcodemst WHERE issupplierEnable=1 AND isPricingApi=1 ORDER BY  IFNULL(externalSupplierOrder,0) ASC ,id DESC ");
            var mfgDetail = this.Context.Database.SqlQuery<ManufacturerViewModel>(query).ToList();
            return mfgDetail;
        }
        public int? getCostCategory(double? price)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("price", price)
                 };
            return this.Context.Database.SqlQuery<int?>("call Sproc_getPriceCategory (@price)", parameters).FirstOrDefault();

        }

        public void updateSupplierExternalAPI(int componentID,int? supplierID, SupplierExternalAPI ObjSupplierExternalAPI,int roleID)
        {
            var jsonString = JsonConvert.SerializeObject(ObjSupplierExternalAPI);
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pPartID", componentID),
                        new MySqlParameter("pSupplierID",supplierID),
                        new MySqlParameter("pJson",jsonString),
                        new MySqlParameter("proleId",roleID)
                 };
            this.Context.Database.ExecuteSqlCommand("call Sproc_updateSupplierExternalAPI (@pPartID,@pSupplierID,@pJson,@proleId)", parameters);
        }

        /// <summary>
        /// Get data from Operating Temperature Conversion Master
        /// </summary>
        /// <param name="strOperatingTemperature"></param>
        /// <returns></returns>
        public OperatingTemperatureConversionModel GetOperatingTemperatureConversion(string strOperatingTemperature)
        {
            string query = string.Format("select externalTemperatureValue,minTemperature,maxTemperature from  operating_temperature_conversion_mst where upper(externalTemperatureValue)=upper('{0}') and isDeleted = 0", strOperatingTemperature);
            return this.Context.Database.SqlQuery<OperatingTemperatureConversionModel>(query).FirstOrDefault();
        }
        public void updateExternalLog(ExternalPartVerificationRequestLog lineItem)
        {
            if (lineItem.partID.HasValue)
            {
                updateExternalBomClean(lineItem.partNumber.ToUpper(), 2, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
            }
            else
            {
                updateExternalPartClean(lineItem.transactionID, 2, lineItem.supplier, null, lineItem.partNumber, lineItem.type);
            }
        }
        public ExternalBOMCleanStatusViewModel updateExternalBomClean(string mfgPN, int status, string supplier, string type, int partID, string message)
        {
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'");
            message = message != null ? message.Replace(@"\", "\\").Replace("'", "\\'") : null;
            string query = string.Format("update  external_partverificationrequest_log set  partStatus={0},errorMsg='{5}',modifiedDate=current_timestamp where partID={1} and supplier='{2}' and `type`='{3}' and partNumber='{4}'", status, partID, supplier, type, mfgPN, message);
            query = query.Replace("=,", "=NULL,").Replace("=''", "=NULL");
            this.Context.Database.ExecuteSqlCommand(query);

            string selectStatus = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE partID={0} AND `type`='{1}' and partStatus=1 GROUP BY partNumber ", partID, type);
            int issueCount = this.Context.Database.SqlQuery<int>(selectStatus).FirstOrDefault();

            string selectQuery = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE partID={0} AND `type`='{1}' and partStatus=0", partID, type);
            int statusApi = this.Context.Database.SqlQuery<int>(selectQuery).FirstOrDefault();

            //string extApi = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE partID={0} AND `type`='{1}' and partStatus=3", partID, type);
            //int extStatusApi = this.Context.Database.SqlQuery<int>(extApi).FirstOrDefault();
            ExternalBOMCleanStatusViewModel objExternalBOMCleanStatusViewModel = new ExternalBOMCleanStatusViewModel()
            {
                apiStatus = false,
                bomStatus = issueCount == 0 ? true : false,
            };
            if (statusApi == 0)
            {
                string checkComponentStatus = string.Format("select  exteranalAPICallStatus from  component_bomsetting where refComponentID={0} AND isDeleted=0", partID);
                var componentModel = this.Context.Database.SqlQuery<ComponentViewModel>(checkComponentStatus).FirstOrDefault();
                objExternalBOMCleanStatusViewModel.apiStatus = true;
                if (componentModel != null && componentModel.exteranalAPICallStatus == 0)
                {
                    //objExternalBOMCleanStatusViewModel.apiStatus = true;
                    string updatePartMaster = string.Format("update component_bomsetting set exteranalAPICallStatus={0} WHERE refComponentID={1} AND isDeleted=0", issueCount == 0 ? 2 : 1, partID);
                    this.Context.Database.ExecuteSqlCommand(updatePartMaster);
                }
            }
            return objExternalBOMCleanStatusViewModel;
        }

        public ExternalBOMCleanStatusViewModel updateAllComponentsParts(string transactionID, string supplier)
        {
            string query = string.Format("update  external_partverificationrequest_log set  partStatus=1,modifiedDate=current_timestamp where supplier='{0}' and `transactionID`='{1}'", supplier, transactionID);
            this.Context.Database.ExecuteSqlCommand(query);

            ExternalBOMCleanStatusViewModel objExternalBOMCleanStatusViewModel = new ExternalBOMCleanStatusViewModel()
            {
                apiStatus = true,
                bomStatus = true
            };
            return objExternalBOMCleanStatusViewModel;
        }

        public ExternalBOMCleanStatusViewModel updateAllBOMParts(int? partID, string supplier, string type)
        {
            string query = string.Format("update  external_partverificationrequest_log set  partStatus=1,modifiedDate=current_timestamp where partID={0} and supplier='{1}' and `type`='{2}'", partID, supplier, type);
            this.Context.Database.ExecuteSqlCommand(query);

            string selectQuery = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE partID={0} AND `type`='{1}' and partStatus=0", partID, type);
            int statusApi = this.Context.Database.SqlQuery<int>(selectQuery).FirstOrDefault();
            ExternalBOMCleanStatusViewModel objExternalBOMCleanStatusViewModel = new ExternalBOMCleanStatusViewModel()
            {
                apiStatus = false,
                bomStatus = false
            };
            if (statusApi == 0)
            {
                string checkComponentStatus = string.Format("select  exteranalAPICallStatus from  component_bomsetting where refComponentID={0} AND isDeleted=0", partID);
                var componentModel = this.Context.Database.SqlQuery<ComponentViewModel>(checkComponentStatus).FirstOrDefault();
                objExternalBOMCleanStatusViewModel.apiStatus = true;
                if (componentModel != null && componentModel.exteranalAPICallStatus == 0)
                {
                    //objExternalBOMCleanStatusViewModel.apiStatus = true;
                    string updatePartMaster = string.Format("update component_bomsetting set exteranalAPICallStatus={0} WHERE refComponentID={1} AND isDeleted=0", 1, partID);
                    this.Context.Database.ExecuteSqlCommand(updatePartMaster);
                }
            }
            return objExternalBOMCleanStatusViewModel;
        }

        public void RemoveLogForPart()
        {
            string query = string.Format("DELETE FROM external_partverificationrequest_log where modifiedDate<TIMESTAMPADD(DAY,-5,UTC_TIMESTAMP())");
            this.Context.Database.ExecuteSqlCommand(query);
        }
        public ExternalBOMCleanStatusViewModel updateExternalPartClean(string transactionID, int status, string supplier, string message, string mfgPN, string type)
        {
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            message = string.IsNullOrEmpty(message) ? "" : message.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Empty;
            string selectStatus = string.Empty;
            string selectQuery = string.Empty;
            if (string.IsNullOrEmpty(type))
            {
                query = string.Format("update  external_partverificationrequest_log set  partStatus={3},errorMsg='{4}',modifiedDate=current_timestamp where transactionID='{0}' and supplier='{1}'   and partNumber='{2}'", transactionID, supplier, mfgPN, status, message);
                selectStatus = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE transactionID='{0}'  and partStatus=1 GROUP BY partNumber ", transactionID);
                selectQuery = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE transactionID='{0}' and partStatus=0", transactionID);
            }
            else
            {
                query = string.Format("update  external_partverificationrequest_log set  partStatus={3},errorMsg='{4}',modifiedDate=current_timestamp where transactionID='{0}' and supplier='{1}' and type='{5}'  and partNumber='{2}'", transactionID, supplier, mfgPN, status, message, type);
                selectStatus = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE transactionID='{0}' and type='{1}' and partStatus=1 GROUP BY partNumber ", transactionID, type);
                selectQuery = string.Format("SELECT COUNT(1) FROM external_partverificationrequest_log WHERE transactionID='{0}' and type='{1}' and partStatus=0", transactionID, type);
            }
            query = query.Replace("=,", "=NULL,").Replace("=''", "=NULL");
            this.Context.Database.ExecuteSqlCommand(query);
            int issueCount = this.Context.Database.SqlQuery<int>(selectStatus).FirstOrDefault();
            int statusApi = this.Context.Database.SqlQuery<int>(selectQuery).FirstOrDefault();

            ExternalBOMCleanStatusViewModel objExternalBOMCleanStatusViewModel = new ExternalBOMCleanStatusViewModel()
            {
                apiStatus = statusApi == 0 ? true : false,
                bomStatus = issueCount == 0 ? false : true
            };
            return objExternalBOMCleanStatusViewModel;
        }
        public void updateBOMPart(int? partID, string supplier, string type, string mfgPN)
        {
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("update  external_partverificationrequest_log set  partStatus=1,modifiedDate=current_timestamp where partID={0} and supplier='{1}' and `type`='{2}' and partNumber='{3}'", partID, supplier, type, mfgPN);
            this.Context.Database.ExecuteSqlCommand(query);
        }
        public ComponentViewModel GetComponentDataFromMFGPN(int mfgCodeID, string mfgPN)
        {
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("select id,mfgPN,mfgcodeID,noOfPosition,noOfRows,packageQty,uom,mountingtypeID,functionalCategoryID,partPackage,RoHSStatusID,unit,connecterTypeID from component where mfgPN='{0}' and mfgCodeID={1} and isDeleted=0", mfgPN, mfgCodeID);
            var component = this.Context.Database.SqlQuery<ComponentViewModel>(query).FirstOrDefault();
            return component;
        }

        public void updateStock(string qtySupplierID, decimal? stock, double? eachStock)
        {
            string query = string.Format("select currentStock,supplierStock,grossStock  from rfq_consolidate_mfgpn_lineitem_quantity where rfqQtySupplierID='{0}' and isDeleted=0", qtySupplierID);
            var component = this.Context.Database.SqlQuery<StockUpdateModel>(query).FirstOrDefault();
            if (component != null && component.supplierStock != null && component.grossStock != null && component.currentStock != null)
            {
                decimal? supplierstock = component.supplierStock - component.currentStock + stock;
                decimal? grossStock = component.grossStock - component.currentStock + stock;
                string updatequery = string.Format("update rfq_consolidate_mfgpn_lineitem_quantity set currentStock={1},supplierStock ={2},grossStock={3},supplierEachStcok={4} where rfqQtySupplierID='{0}' and isDeleted=0", qtySupplierID, stock, supplierstock, grossStock, eachStock);
                this.Context.Database.ExecuteSqlCommand(updatequery);
            }
        }
        public void insertBOMPart(int? partID, string supplier, string type, string mfgPN, string transactionID)
        {
            if (string.IsNullOrEmpty(supplier)) { return; }
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("INSERT INTO external_partverificationrequest_log (partID,partNumber,partStatus,supplier,`type`,modifiedDate,transactionID) VALUES ({0},'{1}',0,'{2}','{3}',CURRENT_TIMESTAMP,'{4}')", partID, mfgPN, supplier, type, transactionID);
            query = query.Replace(",,", ",NULL,");
            query = query.Replace("(,", "(NULL,");
            query = query.Replace("('',", "(NULL,");
            query = query.Replace(",'')", ",NULL)");
            query = query.Replace(",)", "NULL)");
            this.Context.Database.ExecuteSqlCommand(query);
        }
        public int getAlreadyExistsPartDetail(string supplier, string mfgPN, string transactionID)
        {
            if (string.IsNullOrEmpty(supplier)) { return 0; }
            mfgPN = mfgPN.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("Select Count(1) from external_partverificationrequest_log where supplier='{0}'  and transactionID='{1}' and partNumber='{2}'", supplier, transactionID, mfgPN);
            return this.Context.Database.SqlQuery<int>(query).FirstOrDefault();
        }
        public void UpdateBOMforObsolatePart(int partID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pPartID", partID)
                 };
            this.Context.Database.SqlQuery<int?>("call Sproc_UpdateRFQ_LineItems_AlternatePart_Obsolete (@pPartID)", parameters);
        }

        public List<DataSheetComponentModel> getDataSheetList()
        {
            return this.Context.Database.SqlQuery<DataSheetComponentModel>("call Sproc_DataSheetComponentList ()").ToList();
        }
        //Get Measurement Type based on UOM id
        public CommonIDModel getMeasureMentType(int? uomID)
        {
            string query = string.Format("SELECT id,`name`,isActive FROM measurement_types WHERE id = (SELECT measurementTypeID FROM uoms WHERE id ={0})", uomID);
            return this.Context.Database.SqlQuery<CommonIDModel>(query).FirstOrDefault();
        }

        public int getPartNumber(string partnumber)
        {
            partnumber = partnumber.Replace(@"\", @"\\").Replace("'", "\\'").Replace("\"", "\\\"");
            string query = string.Format("select count(1) from component where mfgpn='{0}' and deletedAt is null", partnumber);
            return this.Context.Database.SqlQuery<int>(query).FirstOrDefault();
        }
        /*Get Package Case Type Id from DB*/
        public int? getPartPackageCaseID(string partPackageCase)
        {
            if (!string.IsNullOrEmpty(partPackageCase) && !string.IsNullOrWhiteSpace(partPackageCase))
            {
                string query = string.Format("select id from rfq_packagecasetypemst where name='{0}' and deletedAt is null", partPackageCase);
                return this.Context.Database.SqlQuery<int?>(query).FirstOrDefault();
            }
            return null;
        }

        public void saveSourceAttribute(string tableName, string commonName, int supplierId)
        {
            string query = string.Format("select cfg.id from  component_fields_genericalias_mst cfg where cfg.refTableName='{0}' and cfg.alias='{1}' and cfg.isDeleted=0", tableName, commonName);
            CommonIDModel objmodel = this.Context.Database.SqlQuery<CommonIDModel>(query).FirstOrDefault();
            if (objmodel != null && objmodel.id != null)
            {
                string querySource = string.Format("select cfg.id from  component_attributes_source_mapping cfg where cfg.refAliasID={0} and cfg.MfgCodeID={1} and cfg.isDeleted=0", objmodel.id, supplierId);
                CommonIDModel objSource = this.Context.Database.SqlQuery<CommonIDModel>(querySource).FirstOrDefault();
                if (!(objSource != null && objSource.id != null))
                {
                    string querySourceInsert = string.Format("insert into component_attributes_source_mapping (refAliasID,MfgCodeID,createdBy,updatedBy) values ({0},{1},'Auto','Auto')", objmodel.id, supplierId);
                    this.Context.Database.ExecuteSqlCommand(querySourceInsert);
                }
            }
        }
        public void saveAttributes(ComponentModel ComponentModel)
        {
            //source for mounting type
            if (!string.IsNullOrEmpty(ComponentModel.mountingType))
            {
                if (ComponentModel.mountingTypeID != ConstantHelper.None_Status)
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.rfq_mountingtypemst.ToString(), ComponentModel.mountingType, ComponentModel.SupplierID.Value);
                }
            }
            //source for functional type
            if (!string.IsNullOrEmpty(ComponentModel.functionalCategoryText))
            {
                if (ComponentModel.functionalCategoryID != ConstantHelper.None_Status)
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.rfq_parttypemst.ToString(), ComponentModel.functionalCategoryText, ComponentModel.SupplierID.Value);
                }
            }
            //source for connector type
            if (!string.IsNullOrEmpty(ComponentModel.connectorTypeText))
            {
                if (ComponentModel.connectorTypeID != ConstantHelper.None_Status)
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.rfq_connectertypemst.ToString(), ComponentModel.connectorTypeText, ComponentModel.SupplierID.Value);
                }
            }
            //source for packaging type
            if (!string.IsNullOrEmpty(ComponentModel.packaging))
            {
                if (ComponentModel.packagingID != ConstantHelper.None_Status)
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.component_packagingmst.ToString(), ComponentModel.packaging, ComponentModel.SupplierID.Value);
                }
            }
            //source for packaging case type
            if (!string.IsNullOrEmpty(ComponentModel.partPackage))
            {
                saveSourceAttribute(Helper.Helper.aliasTable.rfq_packagecasetypemst.ToString(), ComponentModel.partPackage, ComponentModel.SupplierID.Value);
            }
            //source for rohs master
            if (!string.IsNullOrEmpty(ComponentModel.rohsText))
            {
                if (ComponentModel.RoHSStatusID != ConstantHelper.None_Status)
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.rfq_rohsmst.ToString(), ComponentModel.rohsText, ComponentModel.SupplierID.Value);
                }
            }
            //source for part status
            if (!string.IsNullOrEmpty(ComponentModel.partStatusText))
            {
                if (ComponentModel.partStatusID != ConstantHelper.None_Status && ComponentModel.supplierName != Helper.Helper.UpdateComponentSupplier.Newark.ToString() && ComponentModel.supplierName != Helper.Helper.UpdateComponentSupplier.Arrow.ToString() && ComponentModel.supplierName != Helper.Helper.UpdateComponentSupplier.TTI.ToString())
                {
                    saveSourceAttribute(Helper.Helper.aliasTable.component_partstatusmst.ToString(), ComponentModel.partStatusText, ComponentModel.SupplierID.Value);
                }
            }
        }

        public void saveDataSheetLinks(int partID, string DataSheetLinks)
        {
            if (!string.IsNullOrEmpty(DataSheetLinks))
            {
                int SARoleID = getSuperAdminRoleID();
                string DataSheetLink = DataSheetLinks.Replace(@"\", @"\\").Replace("'", "\\'");
                string dataSheets = string.Format("select id from component_datasheets where refcomponentid={0} and datasheetURL='{1}'", partID, DataSheetLink);
                int? ID = this.Context.Database.SqlQuery<int?>(dataSheets).FirstOrDefault();
                if (ID == null)
                {
                    string InsertdataSheets = string.Format("INSERT INTO component_datasheets(datasheetURL,refComponentID,createdBy,updatedBy,isDeleted,createByRoleId,updateByRoleId) VALUES('{0}',{1},'Auto','Auto',0,{2},{3})", DataSheetLink, partID, SARoleID, SARoleID);
                    InsertdataSheets = InsertdataSheets.Replace("(,", "(NULL,");
                    InsertdataSheets = InsertdataSheets.Replace("('',", "(NULL,");
                    this.Context.Database.ExecuteSqlCommand(InsertdataSheets);

                    if (DataSheetLink.Contains(".pdf"))
                    {
                        string lastID = string.Format("select id from component_datasheets where refcomponentid={0} and datasheetURL='{1}'", partID, DataSheetLink);
                        var id = this.Context.Database.SqlQuery<int>(lastID).FirstOrDefault();
                        DataSheetComponentModel model = new DataSheetComponentModel()
                        {
                            refComponentID = partID,
                            datasheetURL = DataSheetLinks,
                            id = id
                        };
                        Thread.Sleep(500);
                        ICommonApiPricing _ICommonApiPricing = UnityConfig.Container.Resolve<ICommonApiPricing>();
                        _ICommonApiPricing.sendDataSheetDownLoad(model);
                    }
                }
            }
        }

        public double? convertTemperatureFromFahrenheitToCelsius(double fahrenheitTemperature)
        {
            string query = "select udf.formula \n" +
                            "from unit_detail_formula udf \n" +
                            "where exists (select 1 from uoms u \n" +
                            "			  join measurement_types m ON m.id = u.measurementTypeID and m.name = 'Temperature' \n" +
                            "			 where u.id = udf.toUnitID and u.unitName = 'Celsius' and u.isDeleted = 0) \n" +
                            "and exists (select 1 from uoms u \n" +
                            "			  join measurement_types m ON m.id = u.measurementTypeID and m.name = 'Temperature' \n" +
                            "			 where u.id = udf.unitID and u.unitName = 'Fahrenheit' and u.isDeleted = 0) \n" +
                            "and udf.isDeleted = 0;";
            string formula = this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
            if (!string.IsNullOrEmpty(formula))
            {
                formula = formula.Replace("X", Convert.ToString(fahrenheitTemperature));
                DataTable dt = new DataTable();
                var convertedValue = dt.Compute(formula, "");

                return Math.Round(Convert.ToDouble(convertedValue), 2);
            }
            return null;
        }
        public List<SchedulePartAttributeUpdate> getPartUpdatedAttributes(ComponentViewModel Distycomponent, ComponentModel ComponentModel, bool isMfr)
        {
            List<SchedulePartAttributeUpdate> partAttributeList = new List<SchedulePartAttributeUpdate>();
            // functional type updated internal 
            if (Distycomponent.functionalCategoryID == ConstantHelper.None_Status && Distycomponent.functionalCategoryID != ComponentModel.functionalCategoryID && ComponentModel.functionalCategoryID != null)
            {
                string functionalType = getAttributeName(Helper.Helper.aliasTable.rfq_parttypemst.ToString(), ComponentModel.functionalCategoryID.Value, ConstantHelper.partTypeField);
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Functional Type (Internal)",
                    oldValue = ConstantHelper.TBD,
                    newValue = !string.IsNullOrEmpty(functionalType) ? functionalType : ConstantHelper.TBD,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // functional type updated external 
            if (Distycomponent.functionalCategoryText != ComponentModel.functionalCategoryText && !string.IsNullOrEmpty(ComponentModel.functionalCategoryText))
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Functional Type (External)",
                    oldValue = Distycomponent.functionalCategoryText,
                    newValue = ComponentModel.functionalCategoryText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // mounting type updated external 
            if (Distycomponent.mountingTypeText != ComponentModel.mountingType && !string.IsNullOrEmpty(ComponentModel.mountingType))
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Mounting Type (External)",
                    oldValue = Distycomponent.mountingTypeText,
                    newValue = ComponentModel.mountingType,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // mounting type updated Internal 
            if (Distycomponent.mountingTypeID == ConstantHelper.None_Status && Distycomponent.mountingTypeID != ComponentModel.mountingTypeID && ComponentModel.mountingTypeID != null)
            {
                string mountingTypeID = getAttributeName(Helper.Helper.aliasTable.rfq_mountingtypemst.ToString(), ComponentModel.mountingTypeID.Value, ConstantHelper.mountingField);
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Mounting Type (Internal)",
                    oldValue = ConstantHelper.TBD,
                    newValue = !string.IsNullOrEmpty(mountingTypeID) ? mountingTypeID : ConstantHelper.TBD,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Package case type updated external 
            if (!string.IsNullOrEmpty(ComponentModel.partPackage) && Distycomponent.partPackage != ComponentModel.partPackage)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Package/Case(Shape) Type (External)",
                    oldValue = Distycomponent.partPackage,
                    newValue = ComponentModel.partPackage,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Operating Temprature updated external 
            if (!string.IsNullOrEmpty(ComponentModel.operatingTemp) && Distycomponent.operatingTemp != ComponentModel.operatingTemp)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Operating Temperature(C°) (External)",
                    oldValue = Distycomponent.operatingTemp,
                    newValue = ComponentModel.operatingTemp,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Min Operating Temprature updated external 
            if (Distycomponent.minOperatingTemp == null && ComponentModel.minOperatingTemp != null)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Min(C°) (External)",
                    oldValue = string.Empty,
                    newValue = ComponentModel.minOperatingTemp.ToString(),
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Max Operating Temprature updated external 
            if (Distycomponent.maxOperatingTemp == null && ComponentModel.maxOperatingTemp != null)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Max(C°) (External)",
                    oldValue = string.Empty,
                    newValue = ComponentModel.maxOperatingTemp.ToString(),
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Temperature Coefficient updated external 
            if (!string.IsNullOrEmpty(ComponentModel.temperatureCoefficient) && Distycomponent.temperatureCoefficient != ComponentModel.temperatureCoefficient)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Temperature Coefficient (External)",
                    oldValue = Distycomponent.temperatureCoefficient,
                    newValue = ComponentModel.temperatureCoefficient,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Connector type updated external 
            if (!string.IsNullOrEmpty(ComponentModel.connectorTypeText) && Distycomponent.connectorTypeText != ComponentModel.connectorTypeText)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Connector Type (External)",
                    oldValue = Distycomponent.connectorTypeText,
                    newValue = ComponentModel.connectorTypeText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Connector type updated Internal 
            if ((Distycomponent.connecterTypeID == null || Distycomponent.connecterTypeID == ConstantHelper.None_Status) && Distycomponent.connecterTypeID != ComponentModel.connectorTypeID)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Connector Type (Internal)",
                    oldValue = Distycomponent.connecterTypeID != null ? Distycomponent.connecterTypeID.ToString() : string.Empty,
                    newValue = ComponentModel.connectorTypeID != null ? ComponentModel.connectorTypeID.ToString() : string.Empty,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Pin Count updated External 
            if (!string.IsNullOrEmpty(ComponentModel.noOfPositionText) && Distycomponent.noOfPositionText != ComponentModel.noOfPositionText)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Pin Count (External)",
                    oldValue = Distycomponent.noOfPositionText,
                    newValue = ComponentModel.noOfPositionText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // No. of Rows updated External 
            if (!string.IsNullOrEmpty(ComponentModel.noOfRowsText) && Distycomponent.noOfRowsText != ComponentModel.noOfRowsText)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "No. of Rows (External)",
                    oldValue = Distycomponent.noOfRowsText,
                    newValue = ComponentModel.noOfRowsText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Pitch updated External 
            if (!string.IsNullOrEmpty(ComponentModel.pitch) && Distycomponent.pitch != ComponentModel.pitch)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Pitch (Unit in mm) (External)",
                    oldValue = Distycomponent.pitch,
                    newValue = ComponentModel.pitch,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Pitch mating updated External 
            if (!string.IsNullOrEmpty(ComponentModel.pitchMating) && Distycomponent.pitchMating != ComponentModel.pitchMating)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Pitch Mating(Unit in mm) (External)",
                    oldValue = Distycomponent.pitchMating,
                    newValue = ComponentModel.pitchMating,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Size Dimention updated External 
            if (!string.IsNullOrEmpty(ComponentModel.sizeDimension) && Distycomponent.sizeDimension != ComponentModel.sizeDimension)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Size/Dimension (External)",
                    oldValue = Distycomponent.sizeDimension,
                    newValue = ComponentModel.sizeDimension,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Height Seated updated External 
            if (!string.IsNullOrEmpty(ComponentModel.heightText) && Distycomponent.heightText != ComponentModel.heightText)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Height - Seated (Max) (External)",
                    oldValue = Distycomponent.heightText,
                    newValue = ComponentModel.heightText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Tolerence updated External 
            if (!string.IsNullOrEmpty(ComponentModel.tolerance) && Distycomponent.tolerance != ComponentModel.tolerance)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Tolerance",
                    oldValue = Distycomponent.tolerance,
                    newValue = ComponentModel.tolerance,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Voltage updated External 
            if (!string.IsNullOrEmpty(ComponentModel.voltage) && Distycomponent.voltage != ComponentModel.voltage)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Voltage",
                    oldValue = Distycomponent.voltage,
                    newValue = ComponentModel.voltage,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Value updated External 
            if (!string.IsNullOrEmpty(ComponentModel.value) && Distycomponent.value != ComponentModel.value)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Value",
                    oldValue = Distycomponent.value,
                    newValue = ComponentModel.value,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Power  updated External 
            if (!string.IsNullOrEmpty(ComponentModel.powerRating) && Distycomponent.powerRating != ComponentModel.powerRating)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Power (Watts)",
                    oldValue = Distycomponent.powerRating,
                    newValue = ComponentModel.powerRating,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Weight  updated External 
            if (!string.IsNullOrEmpty(ComponentModel.weight) && Distycomponent.weight != ComponentModel.weight)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Weight",
                    oldValue = Distycomponent.weight,
                    newValue = ComponentModel.weight,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Feature  updated External 
            if (!string.IsNullOrEmpty(ComponentModel.feature) && Distycomponent.feature != ComponentModel.feature)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Feature",
                    oldValue = Distycomponent.feature,
                    newValue = ComponentModel.feature,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Color  updated External 
            if (!string.IsNullOrEmpty(ComponentModel.color) && Distycomponent.color != ComponentModel.color)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Color",
                    oldValue = Distycomponent.color,
                    newValue = ComponentModel.color,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Min  updated External 
            if (string.IsNullOrEmpty(Distycomponent.minimum) && !string.IsNullOrEmpty(ComponentModel.minimum) && Distycomponent.minimum != ComponentModel.minimum)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Min",
                    oldValue = Distycomponent.minimum,
                    newValue = ComponentModel.minimum,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Mult  updated External 
            if (Distycomponent.mult == null && !string.IsNullOrEmpty(ComponentModel.mult))
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Mult",
                    oldValue = "",
                    newValue = ComponentModel.mult,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            // Part Status  updated External 
            if (Distycomponent.partStatusText != ComponentModel.partStatusText)
            {
                SchedulePartAttributeUpdate objSchedule = new SchedulePartAttributeUpdate()
                {
                    pidCode = Distycomponent.PIDCode,
                    attributeName = "Status (External)",
                    oldValue = Distycomponent.partStatusText,
                    newValue = ComponentModel.partStatusText,
                    updatedOn = DateTime.UtcNow,
                    isMfr = isMfr,
                    componentID = Distycomponent.id,
                    supplier = Distycomponent.supplier
                };
                partAttributeList.Add(objSchedule);
            }
            return partAttributeList;
        }

        public void savePartUpdatedAttributes(List<SchedulePartAttributeUpdate> updatePartAttribute)
        {
            IDigikeyPricingRepository _IDigikeyPricingRepository = UnityConfig.Container.Resolve<IDigikeyPricingRepository>();
            _IDigikeyPricingRepository.SavePartAttribute(updatePartAttribute);
        }

        public string getCustomerEmail()
        {
            string query = string.Format("select email from mfgcodemst where iscompany=1 and  isDeleted=0");
            return this.Context.Database.SqlQuery<string>(query).FirstOrDefault();
        }
        // generate and check duplicate Production PN
        public string GenerateProductionPN(string pMfgPN)
        {
            string generatedProductionPN = string.Empty;
            if (!string.IsNullOrEmpty(pMfgPN))
            {
                // generate productionPN
                generatedProductionPN = Regex.Replace(pMfgPN, "[^-+a-zA-Z0-9]", "");
                if (!string.IsNullOrEmpty(generatedProductionPN))
                {
                    string query = string.Format("select COUNT(1) FROM component WHERE deletedat IS NULL and productionPN = '{0}' ", generatedProductionPN);
                    int component = this.Context.Database.SqlQuery<int>(query).FirstOrDefault();
                    generatedProductionPN = (component > 0) ? string.Empty : generatedProductionPN;
                    if (component == 0)
                    {
                        query = "select `key`,`values`,id from systemconfigrations where `key`='productionPNLength' and isActive =1 and isDeleted=0";
                        var config = this.Context.Database.SqlQuery<systemconfigrations>(query).FirstOrDefault();
                        generatedProductionPN = (config != null && generatedProductionPN.Length <= int.Parse(config.values)) ? generatedProductionPN : string.Empty;
                    }
                }
            }
            return generatedProductionPN;
        }
        /// <summary>
        /// Get Component Serial Number
        /// </summary>
        /// <param name="pType"></param>
        /// <returns></returns>
        public string GetComponentSerialNumber(string pType)
        {
            string serialNumber = "";
            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                        new MySqlParameter("pType", pType),
                        new MySqlParameter("pIsResInTempTable", false)
                 };
            var serialNumberData = this.Context.Database.SqlQuery<IncrementalNumberModel>("call Sproc_GenerateIncrementalNumber (@pType,@pIsResInTempTable)", parameters).ToList();
            if (serialNumberData != null && serialNumberData.Count > 0)
            {
                serialNumber = serialNumberData[0].systemID;
            }
            return serialNumber;
        }

        public int getSuperAdminRoleID()
        {
            string query = string.Format("select id from roles where name = 'Super Admin'");
            return this.Context.Database.SqlQuery<int>(query).FirstOrDefault();
        }
        //create Mfr parts
        public ComponentViewModel GetComponentDetail(string mfgPN)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                        new MySqlParameter("pMPN", mfgPN)
               };
            return this.Context.Database.SqlQuery<ComponentViewModel>("call Sproc_GetComponentByMPNExteranlAPI (@pMPN)", parameters).FirstOrDefault();
        }
    }
}
