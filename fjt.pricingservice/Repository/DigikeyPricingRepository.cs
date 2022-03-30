using fjt.pricingservice.Model;
using fjt.pricingservice.MongoDBModel.Interface;
using fjt.pricingservice.Repository.Interface;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using System;
using System.Globalization;

namespace fjt.pricingservice.Repository
{
    public class DigikeyPricingRepository : IDigikeyPricingRepository
    {
        private IDBContext _iDBContext;
        public DigikeyPricingRepository(IDBContext IDBContext)
        {
            this._iDBContext = IDBContext;
        }
        public void SavePrice(FJTMongoQtySupplier qtySuppliers)
        {
            _iDBContext.Add(qtySuppliers);
        }

        public void SaveErrorLog(ServiceErrorLog ServiceErrorLog)
        {
            _iDBContext.Add(ServiceErrorLog);
        }
        public FJTMongoQtySupplier FindPricing(int consolidateID, string mfgpartNumber, string PriceType, int? SupplierID, int? mfgCodeID, int? packageID, string supplierPN, bool isPurchaseApi)
        {
            return _iDBContext.FindOne<FJTMongoQtySupplier>(x => x.ConsolidateID == consolidateID && x.SupplierID == SupplierID && x.IsDeleted == false && x.mfgCodeID == mfgCodeID && x.ManufacturerPartNumber == mfgpartNumber && x.PriceType == PriceType && x.packageID == packageID && x.SourceOfPrice == "Auto" && x.SupplierPN == supplierPN && x.isPurchaseApi == isPurchaseApi);
        }
        public void saveComponent(ComponentModel objComponent)
        {
            _iDBContext.Add(objComponent);
        }
        public void removeMongoStatus()
        {
            DateTime removeDate = DateTime.Now.AddDays(-30);
            List<InovaxeServerStatus> removalList = _iDBContext.Find<InovaxeServerStatus>(x => x.MessageType == "115" || x.MessageType == "114").ToList();
            foreach (InovaxeServerStatus item in removalList)
            {
                if (item.TimeStamp.Date < removeDate.Date)
                {
                    _iDBContext.Delete<InovaxeServerStatus>(x => x._id == item._id);
                }
            }
        }
        public int saveBOMIssues(List<bomStatus> bomStatusList)
        {
            foreach (bomStatus item in bomStatusList)
            {
                var objStatus = _iDBContext.FindOne<bomStatus>(x => x.partID == item.partID && x.partNumber == item.partNumber && x.errorType == item.errorType && x.errorMsg.ToLower() == item.errorMsg.ToLower() && x.transactionID == item.transactionID);
                if (objStatus == null)
                {
                    _iDBContext.Add(item);
                }
            }
            return 1;
        }

        public bomStatus getBOMIssues(string partNumber, string transactionID, int? partID)
        {
            return _iDBContext.FindOne<bomStatus>(x => x.partNumber == partNumber && x.transactionID == transactionID && x.partID == partID);
        }

        public void saveExternalAPIStatus(ExternalSupplierStatus externalSupplierStatus)
        {
            _iDBContext.Add(externalSupplierStatus);
        }

        public List<ExternalSupplierStatus> updateExternalAPIStatus(ExternalSupplierStatus externalSupplierStatus)
        {
            ExternalSupplierStatus objExternalSupplierStatus = _iDBContext.FindOne<ExternalSupplierStatus>(x => x.partNumber == externalSupplierStatus.partNumber && x.transactionID == externalSupplierStatus.transactionID && x.supplier == externalSupplierStatus.supplier && x.type == externalSupplierStatus.type && x.partID == externalSupplierStatus.partID);
            if (objExternalSupplierStatus != null)
            {
                externalSupplierStatus._id = objExternalSupplierStatus._id;
                _iDBContext.Delete<ExternalSupplierStatus>(x => x._id == externalSupplierStatus._id);
            }
            return _iDBContext.Find<ExternalSupplierStatus>(x => x.partNumber == externalSupplierStatus.partNumber && x.transactionID == externalSupplierStatus.transactionID && x.type == externalSupplierStatus.type && x.status == false && x.partID == externalSupplierStatus.partID);
        }

        public void UpdatePrice(FJTMongoQtySupplier qtySuppliers)
        {
            _iDBContext.Update(x => x._id == qtySuppliers._id, qtySuppliers);
        }
        public void UpdateAssyPrice(AssemblyQtyBreak objAssemblyQtyBreak)
        {
            _iDBContext.Update(x => x.id == objAssemblyQtyBreak.id, objAssemblyQtyBreak);
        }
        public List<FJTMongoQtySupplier> FindPricingByConsolidateID(int QtyID, int consolidateID)
        {
            return _iDBContext.Find<FJTMongoQtySupplier>(x => x.ConsolidateID == consolidateID && x.IsDeleted == false).ToList();//x.copyFromID== ObjectId.
        }
        public List<PriceBreakComponent> FindPriceBreakComponent(int componentID, string supplier, string supplierPN)
        {
            string currentDate = Helper.Helper.GetCurrentUTCDateString();
            return _iDBContext.Find<PriceBreakComponent>(x => x.componentID == componentID && x.supplier == supplier && x.supplierPN == supplierPN && x.Type == "Auto" && x.UpdatedTimeStamp == currentDate).ToList();
        }
        public AssemblyQtyBreak FindAssyPrice(int consolidateID, ObjectId qtySupplierID, int assyQtyID)
        {
            return _iDBContext.FindOne<AssemblyQtyBreak>(x => x.ConsolidateID == consolidateID && x.qtySupplierID == qtySupplierID && x.isDeleted == false && x.RfqAssyQtyId == assyQtyID);
        }
        public void SaveAssyPrice(AssemblyQtyBreak objAssemblyQtyBreak)
        {
            _iDBContext.Add(objAssemblyQtyBreak);
        }
        public void SavePriceBreakComponent(List<PriceBreakComponent> PriceBreaks)
        {
            foreach (var item in PriceBreaks)
            {
                if (item._id != ObjectId.Empty)
                {
                    _iDBContext.Update(x => x._id == item._id, item);
                }
                else
                {
                    _iDBContext.Add(item);
                }
            }
        }
        public List<ComponentModel> getComponentList(string mfgPN, string supplierName)
        {
            return _iDBContext.Find<ComponentModel>(x => x.mfgPN.ToLower() == mfgPN.ToLower() && x.supplierName == supplierName).ToList();//x.copyFromID== ObjectId.
        }
        public List<ComponentModel> getAllComponentList(string mfgPN)
        {
            return _iDBContext.Find<ComponentModel>(x => x.mfgPN.ToLower() == mfgPN.ToLower() || (x.distPN != null && x.distPN.ToLower() == mfgPN.ToLower())).ToList();//x.copyFromID== ObjectId.
        }
        public void RemoveComponent(ComponentModel objComponent)
        {
            _iDBContext.Delete<ComponentModel>(x => x.mfgPN == objComponent.mfgPN && x.supplierName == objComponent.supplierName && x.manufacturerName == objComponent.manufacturerName && x._id == objComponent._id);
        }
        public List<MpnMappDet> GetMpnMappDet(string mfgPN)
        {
            return _iDBContext.Find<MpnMappDet>(x => x.importMfgPN.ToLower() == mfgPN.ToLower()).ToList();//x.copyFromID== ObjectId.
        }
        public void updateMPNMappDet(MpnMappDet item)
        {
            _iDBContext.Update(x => x._id == item._id, item);
        }
        public List<PriceBreakComponent> FindAllPriceBreakComponent()
        {
            return _iDBContext.Find<PriceBreakComponent>(x => x.supplierID == null && x.timeStamp < DateTime.Now).ToList();
        }
        public void updatePriceBreak(PriceBreakComponent item)
        {
            _iDBContext.Update(x => x._id == item._id, item);
        }
        public void SavePartAttribute(List<SchedulePartAttributeUpdate> attributeUpdate)
        {
            foreach (var item in attributeUpdate)
            {
                if (!(string.IsNullOrEmpty(item.oldValue) && string.IsNullOrEmpty(item.newValue)))
                {
                    _iDBContext.Add(item);
                }
            }
        }

        public List<SchedulePartAttributeUpdate> getPartAttribute()
        {
            DateTime date = DateTime.UtcNow.Date;
            return _iDBContext.Find<SchedulePartAttributeUpdate>(x => x.isMfr == true && x.updatedOn > date).ToList();
        }
        public void removeOldPartAttribute()
        {
            DateTime date = DateTime.UtcNow.Date.AddMonths(-1);
            _iDBContext.Delete<SchedulePartAttributeUpdate>(x => x.updatedOn < date);
        }
        /// <summary>
        /// Find and return user modified PIDCode in case of length too long got from external API
        /// </summary>
        /// <param name="TransactionID"></param>
        /// <param name="PartID"></param>
        /// <param name="MFGCode"></param>
        /// <param name="PartNumber"></param>
        /// <returns>partPIDCodeStatus</returns>
        public partPIDCodeStatus FindPartUpdatedPIDCode(string TransactionID, int? PartID, string MFGCode, string PartNumber)
        {
            return _iDBContext.FindOne<partPIDCodeStatus>(x => x.transactionID == TransactionID && x.PartID == PartID && x.MFGCode == MFGCode && x.PartNumber == PartNumber);
        }
        /// <summary>
        /// Remove consumed user modified PIDCode from mongoDB
        /// </summary>
        /// <param name="TransactionID"></param>
        /// <param name="PartID"></param>
        public void RemovePartUpdatedPIDCode(string TransactionID, int? PartID)
        {
            _iDBContext.Delete<partPIDCodeStatus>(x => x.transactionID == TransactionID && x.PartID == PartID);
        }
        /// <summary>
        /// Check Pending Error Count in mongo DB
        /// </summary>
        /// <param name="TransactionID"></param>
        /// <param name="PartID"></param>
        /// <returns>long</returns>
        public long CheckPendingErrorCount(string TransactionID, int? PartID)
        {
            return _iDBContext.Count<bomStatus>(x => x.transactionID == TransactionID && x.partID == PartID);
        }

        public void CheckPendingApiCalls(SupplierExternalCallLimit objSupplierLimitCall)
        {
            SupplierExternalCallLimit objSuppplier = _iDBContext.FindOne<SupplierExternalCallLimit>(x => x.supplierID == objSupplierLimitCall.supplierID && x.clientID == objSupplierLimitCall.clientID && x.currentDate == objSupplierLimitCall.currentDate);
            if (objSuppplier != null)
            {
                if (!objSuppplier.isLimitExceed)
                {
                    objSuppplier.isLimitExceed = objSupplierLimitCall.isLimitExceed;
                    objSuppplier.exceedCallNumber = objSuppplier.exceedCallNumber + 1;
                }
                objSuppplier.limitExceedText = objSupplierLimitCall.limitExceedText;
                objSuppplier.totalCall = objSuppplier.totalCall + 1;
                objSuppplier.callLimit = objSupplierLimitCall.callLimit;
                _iDBContext.Update(x => x.id == objSuppplier.id, objSuppplier);
            }
            else
            {
                objSupplierLimitCall.totalCall = 1;
                objSupplierLimitCall.exceedCallNumber = 1;
                _iDBContext.Add(objSupplierLimitCall);
            }
        }
    }
}
