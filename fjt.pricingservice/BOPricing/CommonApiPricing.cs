using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using static fjt.pricingservice.Helper.Helper;
using System.Linq;
using fjt.pricingservice.Helper;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using MongoDB.Bson;
using System.Dynamic;
using System.Collections;
using fjt.pricingservice.ErrorLog.Interface;
using System.IO;
using System.Net;
using System.Threading;
using System.Web;
using System.Text;
using fjt.pricingservice.Handlers.Interfaces;
using System.Configuration;
using System.IO.Compression;

namespace fjt.pricingservice.BOPricing
{
    public class CommonApiPricing : ICommonApiPricing
    {
        private readonly Irfq_assy_quantity_turn_timeRepository _Irfq_assy_quantity_turn_timeRepository;
        private readonly IDigikeyPricingRepository _IDigikeyPricingRepository;
        private readonly IRabbitMQ _IRabbitMQ;
        private readonly Irfq_lineitem_autopricingstatusRepository _Irfq_lineitem_autopricingstatusRepository;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_assy_autopricingstatusRepository _Irfq_assy_autopricingstatusRepository;
        private readonly Irfq_consolidate_mfgpn_lineitem_quantityRepository _Irfq_consolidate_mfgpn_lineitem_quantityRepository;
        private readonly Irfq_assy_quantity_price_selection_settingRepository _Irfq_assy_quantity_price_selection_settingRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly Irfq_assy_bomRepository _Irfq_assy_bomRepository;
        private readonly IBOSendPartUpdateEmail _IBOSendPartUpdateEmail;
        private readonly IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler;
        string MouserScheduleQueueName = ConfigurationManager.AppSettings["PartCleanMOQueue"].ToString();
        string MouserQueueName = ConfigurationManager.AppSettings["BOMCleanMOQueue"].ToString();
        string AvnetScheduleQueueName = ConfigurationManager.AppSettings["PartCleanAVQueue"].ToString();
        string AvnetQueueName = ConfigurationManager.AppSettings["BOMCleanAVQueue"].ToString();
        string NewarkScheduleQueueName = ConfigurationManager.AppSettings["PartCleanNWQueue"].ToString();
        string NewarkQueueName = ConfigurationManager.AppSettings["BOMCleanNWQueue"].ToString();
        string ArrowScheduleQueueName = ConfigurationManager.AppSettings["PartCleanARQueue"].ToString();
        string ArrowQueueName = ConfigurationManager.AppSettings["BOMCleanARQueue"].ToString();
        string TTIQueueName = ConfigurationManager.AppSettings["BOMCleanTTIQueue"].ToString();
        string TTIScheduleQueueName = ConfigurationManager.AppSettings["PartCleanTTIQueue"].ToString();
        string HeilindQueueName = ConfigurationManager.AppSettings["BOMCleanHeilindQueue"].ToString();
        string HeilindScheduleQueueName = ConfigurationManager.AppSettings["PartCleanHeilindQueue"].ToString();
        string UpdatePartAttributeMailConfiguration = ConfigurationManager.AppSettings["UpdatePartAttributeMailConfiguration"].ToString();

        public CommonApiPricing(Irfq_assy_quantity_turn_timeRepository Irfq_assy_quantity_turn_timeRepository, IDigikeyPricingRepository IDigikeyPricingRepository,
            Irfq_lineitem_autopricingstatusRepository Irfq_lineitem_autopricingstatusRepository,
            IsystemconfigrationsRepository IsystemconfigrationsRepository,
            Irfq_assy_autopricingstatusRepository Irfq_assy_autopricingstatusRepository,
            Irfq_consolidate_mfgpn_lineitem_quantityRepository Irfq_consolidate_mfgpn_lineitem_quantityRepository,
            Irfq_assy_quantity_price_selection_settingRepository Irfq_assy_quantity_price_selection_settingRepository,
            Irfq_consolidated_mfgpn_lineitem_alternateRepository Irfq_consolidated_mfgpn_lineitem_alternateRepository,
            Irfq_assy_bomRepository Irfq_assy_bomRepository,
            IRabbitMQ IRabbitMQ,
            IBOSendPartUpdateEmail IBOSendPartUpdateEmail,
            IRabbitMQSendMessageRequestHandler IRabbitMQSendMessageRequestHandler)
        {
            _Irfq_assy_quantity_turn_timeRepository = Irfq_assy_quantity_turn_timeRepository;
            _IDigikeyPricingRepository = IDigikeyPricingRepository;
            _Irfq_lineitem_autopricingstatusRepository = Irfq_lineitem_autopricingstatusRepository;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_assy_autopricingstatusRepository = Irfq_assy_autopricingstatusRepository;
            _Irfq_consolidate_mfgpn_lineitem_quantityRepository = Irfq_consolidate_mfgpn_lineitem_quantityRepository;
            _Irfq_assy_quantity_price_selection_settingRepository = Irfq_assy_quantity_price_selection_settingRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _Irfq_assy_bomRepository = Irfq_assy_bomRepository;
            _IRabbitMQ = IRabbitMQ;
            _IBOSendPartUpdateEmail = IBOSendPartUpdateEmail;
            _IRabbitMQSendMessageRequestHandler = IRabbitMQSendMessageRequestHandler;
        }



        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : part search with keyword for digikey
        /// </summary>
        /// <param name="baseUri">string</param>
        /// <param name="accessToken">string</param>
        /// <param name="clientId">string</param>
        /// <param name="mpn">string</param>
        /// <param name="recordCount">int</param>
        public string KeywordSearchV3(string baseUri, string accessToken, string clientId, string mpn, int recordCount, string CustomerID)
        {
            //var client = new RestClient("https://api.digikey.com/services/partsearch/v2/keywordsearch");
            //var request = new RestRequest(Method.POST);

            //request.AddHeader("authorization", "79MchbbJcigLcLDlk4lsji509xJb");
            //request.AddHeader("x-ibm-client-id", "330686fb-a60d-4dda-a92c-d59c2b2d8b09");
            //request.AddHeader("cache-control", "no-cache");
            //request.AddHeader("accept", "application/json");
            //request.AddHeader("Content-Type", "application/json");
            //request.AddParameter("undefined", "{\n\t\"Keywords\":\"H-90\",\n\t\"RecordCount\":3,\n\t\"RecordStartPosition\":0\n}", ParameterType.RequestBody);
            //var response = client.Execute(request).Content;

            JObject jObject = new JObject();
            jObject.Add(ConstantHelper.Keyword, mpn);
            jObject.Add(ConstantHelper.RecordCount, recordCount);
            jObject.Add(ConstantHelper.StartPosition, 0);

            var request = new RestRequest(Method.POST);
            request.AddHeader(ConstantHelper.Content, ConstantHelper.ApplicationJson);
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("accept", "application/json");
            request.AddHeader(ConstantHelper.ClientKeyV3, clientId);
            request.AddHeader(ConstantHelper.Auth, string.Format("Bearer {0}", accessToken));
            if (!string.IsNullOrEmpty(CustomerID))
                request.AddHeader(ConstantHelper.CustomerID, CustomerID);
            request.AddParameter(ConstantHelper.ApplicationJson, jObject, ParameterType.RequestBody);
            var client = new RestClient(baseUri);
            var response = client.Execute(request).Content;
            return response;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :exact part search from partnumber in digikey
        /// </summary>
        /// <param name="baseUri">string</param>
        /// <param name="accessToken">string</param>
        /// <param name="clientId">string</param>
        /// <param name="mpn">string</param>
        /// <param name="recordCount">int</param>
        public string DigikeyPartSearchV3(string baseUri, string accessToken, string clientId, string mpn, int recordCount, string CustomerID)
        {
            mpn = System.Web.HttpUtility.UrlEncode(mpn);
            var client = new RestClient(string.Format(baseUri, mpn));
            var request = new RestRequest(Method.GET);
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader(ConstantHelper.ClientKeyV3, clientId);
            request.AddHeader(ConstantHelper.Content, ConstantHelper.ApplicationJson);
            request.AddHeader("Accept", "application/json");
            request.AddHeader(ConstantHelper.Auth, string.Format("Bearer {0}", accessToken));
            var response = client.Execute(request).Content;
            return response;
        }


        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :generate access token from refresh token once it expire
        /// </summary>
        /// <param name="oldAccessToken">string</param>
        /// <param name="newAccessToken">string</param>
        public dynamic RegenerateExternalAccessTokenV3(string appName, string oldAccessToken, out string newAccessToken)
        {
            newAccessToken = oldAccessToken;
            dynamic response = null;
            try
            {

                var digiKeyConfiguration = _IsystemconfigrationsRepository.GetExternalApiConfig(ConstantHelper.DkSupplierID, appName);
                string uri = DigikeyAuthenticationURLV3;
                string urlPayload = string.Format(ConstantHelper.DigiKeyRefreshTokenUri
                    , ConstantHelper.RefreshToken, digiKeyConfiguration.refreshToken, digiKeyConfiguration.clientID, digiKeyConfiguration.secretID);

                var client = new RestClient(uri);
                var request = new RestRequest(Method.POST);
                request.AddHeader(ConstantHelper.Content, RequestFormat);
                request.AddParameter(ConstantHelper.RequestType, urlPayload, ParameterType.RequestBody);

                var data = client.Execute(request).Content;
                response = JsonConvert.DeserializeObject<dynamic>(data);

                if (response != null && response.access_token != null && response.refresh_token != null)
                {
                    digiKeyConfiguration.refreshToken = response.refresh_token;
                    digiKeyConfiguration.accessToken = response.access_token;
                    _IsystemconfigrationsRepository.saveExternalConfiguration(digiKeyConfiguration);
                    newAccessToken = response.access_token;
                }
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                    supplier = PricingAPINames.DigiKey.GetEnumStringValue(),
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return response;
            }
            return response;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :total lead time count for quantity 
        /// </summary>
        /// <param name="Qtyid">int</param>
        public int LeadTime(int Qtyid)
        {
            int leadTime = 0;
            var turnTimeList = _Irfq_assy_quantity_turn_timeRepository.GetRfqAssyQuantityTurnTime(Qtyid);
            foreach (rfq_assy_quantity_turn_time turnTime in turnTimeList)
            {
                if (turnTime.unitOfTime == unitOfTime.Day.GetEnumStringValue())
                {
                    leadTime = leadTime + turnTime.turnTime;
                }
                else
                {
                    leadTime = leadTime + (turnTime.turnTime * 7);
                }
            }
            return leadTime;
        }

        public CommonApiError getBOMVerificationIssueList(ComponentModel objComponentModel, string mfgPN, ExternalPartVerificationRequestLog objExtVerification)
        {
            CommonApiError objCommonApiError = new CommonApiError();
            List<bomStatus> bomList = new List<bomStatus>();

            //supplier id
            var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(objComponentModel.supplierName, "DIST");
            if (objComponentModel.supplierName != string.Empty && objComponentModel.supplierName != null && objSupplier == null)
            {
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.supplierName, ConstantHelper.Supplier),
                    errorType = ErrorType.MFGNOTADDED.ToString(),
                    DataField = objComponentModel.supplierName,
                    Source = objComponentModel.supplierName,
                    Type = ConstantHelper.DIST,
                    MFGCode = objComponentModel.supplierName,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    transactionID = objExtVerification.transactionID
                };
                bomList.Add(objbomStatus);
            }
            else
                objComponentModel.SupplierID = objSupplier.id;
            //get mounting type id
            CommonIDModel mountingTypeID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.rfq_mountingtypemst.ToString(), objComponentModel.mountingType, ConstantHelper.mountingField);
            if (objComponentModel.mountingType != string.Empty && objComponentModel.mountingType != null &&
                (mountingTypeID == null || (mountingTypeID != null && mountingTypeID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.mountingType, ConstantHelper.MountingType);
                string stringErrorType = ErrorType.MOUNTNOTADDED.ToString();
                if (mountingTypeID != null && mountingTypeID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.mountingType, ConstantHelper.MountingType);
                    stringErrorType = ErrorType.MOUNTINACTIVE.ToString();
                }

                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.mountingType,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    description = objExtVerification.description,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = mountingTypeID != null ? mountingTypeID.id : null
                };
                bomList.Add(objbomStatus);
                mountingTypeID = null;
            }
            objComponentModel.mountingTypeID = mountingTypeID != null ? mountingTypeID.id : null; //assign mountying type id
                                                                                                  //get Packageing id
            CommonIDModel PackageID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.component_packagingmst.ToString(), objComponentModel.packaging, ConstantHelper.packagingField);
            if (objComponentModel.packaging != string.Empty && objComponentModel.packaging != null &&
                (PackageID == null || (PackageID != null && PackageID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.packaging, ConstantHelper.PackagingType);
                string stringErrorType = ErrorType.PACKAGINGNOTADDED.ToString();
                if (PackageID != null && PackageID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.packaging, ConstantHelper.PackagingType);
                    stringErrorType = ErrorType.PACKAGINGINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.packaging,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = PackageID != null ? PackageID.id : null
                };
                bomList.Add(objbomStatus);
                PackageID = null;
            }
            objComponentModel.packagingID = PackageID != null ? PackageID.id : null; //assign packaging type id

            //get connector type id
            CommonIDModel connectorTypeID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.rfq_connectertypemst.ToString(), objComponentModel.connectorTypeText, ConstantHelper.connectorField);
            if (objComponentModel.connectorTypeText != string.Empty && objComponentModel.connectorTypeText != null &&
                (connectorTypeID == null || (connectorTypeID != null && connectorTypeID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.connectorTypeText, ConstantHelper.ConnecterType);
                string stringErrorType = ErrorType.CONNECTNOTADDED.ToString();
                if (connectorTypeID != null && connectorTypeID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.connectorTypeText, ConstantHelper.ConnecterType);
                    stringErrorType = ErrorType.CONNECTINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.connectorTypeText,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = connectorTypeID != null ? connectorTypeID.id : null
                };
                bomList.Add(objbomStatus);
                connectorTypeID = null;
            }
            objComponentModel.connectorTypeID = connectorTypeID != null ? connectorTypeID.id : null; //assign connector type id

            //get functional type id
            CommonIDModel functionalCategoryID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.rfq_parttypemst.ToString(), objComponentModel.functionalCategoryText, ConstantHelper.partTypeField);
            if (objComponentModel.functionalCategoryText != string.Empty && objComponentModel.functionalCategoryText != null &&
                (functionalCategoryID == null || (functionalCategoryID != null && functionalCategoryID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.functionalCategoryText, ConstantHelper.FunctionalType);
                string stringErrorType = ErrorType.PARTTYPENOTADDED.ToString();
                if (functionalCategoryID != null && functionalCategoryID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.functionalCategoryText, ConstantHelper.FunctionalType);
                    stringErrorType = ErrorType.PARTTYPEINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.functionalCategoryText,
                    Source = objComponentModel.supplierName,
                    partType = objComponentModel.functionalCategoryText,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = functionalCategoryID != null ? functionalCategoryID.id : null
                };
                bomList.Add(objbomStatus);
                functionalCategoryID = null;
            }
            objComponentModel.functionalCategoryID = functionalCategoryID != null ? functionalCategoryID.id : null; //assign functional type id
                                                                                                                    //get part status
            CommonIDModel partStatusID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.component_partstatusmst.ToString(), objComponentModel.partStatusText, ConstantHelper.partStatusField);
            if (!string.IsNullOrEmpty(objComponentModel.partStatusText) &&
                (partStatusID == null || (partStatusID != null && partStatusID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.partStatusText, ConstantHelper.PartStatus);
                string stringErrorType = ErrorType.PARTSTATUSNOTADDED.ToString();
                if (partStatusID != null && partStatusID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.partStatusText, ConstantHelper.PartStatus);
                    stringErrorType = ErrorType.PARTSTATUSINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.partStatusText,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = partStatusID != null ? partStatusID.id : null
                };
                bomList.Add(objbomStatus);
                partStatusID = null;
            }
            objComponentModel.partStatusID = partStatusID != null ? partStatusID.id : null; // assign part status id 

            //get uom id
            CommonIDModel uomID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.Uoms.ToString(), objComponentModel.uomText, ConstantHelper.unitMeaserField);
            if (objComponentModel.uomText != string.Empty && objComponentModel.uomText != null &&
                (uomID == null || (uomID != null && uomID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.uomText, ConstantHelper.UOM);
                string stringErrorType = ErrorType.UOMNOTADDED.ToString();
                if (uomID != null && uomID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.uomText, ConstantHelper.UOM);
                    stringErrorType = ErrorType.UOMINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.uomText,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = uomID != null ? uomID.id : null
                };
                bomList.Add(objbomStatus);
                uomID = null;
            }
            else
            {
                CommonIDModel measureType = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getMeasureMentType(uomID != null ? uomID.id : null);
                if (uomID != null &&
                    (measureType == null || (measureType != null && measureType.isActive == false)))
                {
                    string unitName = string.Format("for {1} {0}", objComponentModel.uomText, ConstantHelper.UOM);
                    string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, unitName, ConstantHelper.UOMClass);
                    string stringErrorType = ErrorType.UOMCLASSNOTADDED.ToString();
                    if (measureType != null && measureType.isActive == false)
                    {
                        stringErrorMsg = string.Format(ConstantHelper.DISABLED, measureType.name, ConstantHelper.UOMClass);
                        stringErrorType = ErrorType.UOMCLASSINACTIVE.ToString();
                    }
                    bomStatus objbomStatus = new bomStatus()
                    {
                        partID = objExtVerification.partID,
                        lineID = objExtVerification.lineID,
                        productUrl = objComponentModel.productUrl,
                        partNumber = mfgPN,
                        errorMsg = stringErrorMsg,
                        errorType = stringErrorType,
                        ActualPart = objComponentModel.mfgPN,
                        DataField = (measureType != null ? measureType.name : objComponentModel.uomText),
                        Source = objComponentModel.supplierName,
                        MFGCode = objComponentModel.manufacturerName,
                        apiPartdesc = objComponentModel.mfgPnDescription,
                        description = objExtVerification.description,
                        bomMFG = objExtVerification.mfgName,
                        SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                        transactionID = objExtVerification.transactionID,
                        attributeId = measureType != null ? measureType.id : null
                    };
                    bomList.Add(objbomStatus);
                    measureType = null;
                }

                objComponentModel.uomClassID = measureType != null ? measureType.id : null;
                objComponentModel.uomClassText = measureType != null ? measureType.name : null;
            }
            objComponentModel.uomID = uomID != null ? uomID.id : null; //assign unit of measure id
                                                                       //get rohs id
            CommonIDModel rohsID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.rfq_rohsmst.ToString(), objComponentModel.rohsText, ConstantHelper.rohsField);
            if (objComponentModel.rohsText != string.Empty && objComponentModel.rohsText != null &&
                (rohsID == null || (rohsID != null && rohsID.isActive == false)))
            {
                string stringErrorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.rohsText, ConstantHelper.RoHS);
                string stringErrorType = ErrorType.ROHSNOTADDED.ToString();
                if (rohsID != null && rohsID.isActive == false)
                {
                    stringErrorMsg = string.Format(ConstantHelper.DISABLED, objComponentModel.rohsText, ConstantHelper.RoHS);
                    stringErrorType = ErrorType.ROHSINACTIVE.ToString();
                }
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = stringErrorMsg,
                    errorType = stringErrorType,
                    ActualPart = objComponentModel.mfgPN,
                    DataField = objComponentModel.rohsText,
                    Source = objComponentModel.supplierName,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID,
                    attributeId = rohsID != null ? rohsID.id : null
                };
                bomList.Add(objbomStatus);
                rohsID = null;
            }
            objComponentModel.RoHSStatusID = rohsID != null ? rohsID.id : null; //assign rohs id
                                                                                //get manufacturer detail 
            var objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(objComponentModel.manufacturerName, "MFG");
            if (objComponentModel.manufacturerName != string.Empty && objComponentModel.manufacturerName != null && objMfg == null)
            {
                bomStatus objbomStatus = new bomStatus()
                {
                    partID = objExtVerification.partID,
                    lineID = objExtVerification.lineID,
                    productUrl = objComponentModel.productUrl,
                    partNumber = mfgPN,
                    errorMsg = string.Format(ConstantHelper.NOT_ADDED, objComponentModel.manufacturerName, ConstantHelper.Manufacturer),
                    errorType = ErrorType.MFGNOTADDED.ToString(),
                    DataField = objComponentModel.manufacturerName,
                    Source = objComponentModel.supplierName,
                    Type = ConstantHelper.MFG,
                    MFGCode = objComponentModel.manufacturerName,
                    apiPartdesc = objComponentModel.mfgPnDescription,
                    description = objExtVerification.description,
                    bomMFG = objExtVerification.mfgName,
                    SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                    transactionID = objExtVerification.transactionID
                };
                bomList.Add(objbomStatus);
            }
            else if (objMfg != null)
            {
                var model = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDataFromMFGPN(objMfg.id, mfgPN);
                if (model == null)
                {
                    int PIDCodeLentgh = 30;
                    var objconfig = _IsystemconfigrationsRepository.GetSystemConfiguration(ConstantHelper.PIDCodeLengthKey);
                    if (objconfig != null && objconfig.values != null)
                    {
                        PIDCodeLentgh = int.Parse(objconfig.values);
                    }
                    if (string.Format("{0}+{1}", objMfg.mfgCode, mfgPN).Count() > PIDCodeLentgh)
                    {
                        var PartUpdatedPIDCode = _IDigikeyPricingRepository.FindPartUpdatedPIDCode(objExtVerification.transactionID, objExtVerification.partID, objMfg.mfgCode, mfgPN);
                        if (PartUpdatedPIDCode != null && !string.IsNullOrEmpty(PartUpdatedPIDCode.ValidPIDCode))
                        {
                            objComponentModel.PIDCode = Convert.ToString(PartUpdatedPIDCode.ValidPIDCode).Trim();
                        }
                        else
                        {
                            bomStatus objbomStatus = new bomStatus()
                            {
                                partID = objExtVerification.partID,
                                lineID = objExtVerification.lineID,
                                productUrl = objComponentModel.productUrl,
                                partNumber = mfgPN,
                                errorMsg = string.Format(ConstantHelper.PIDCODE_VALID, string.Format("{0}+{1}", objMfg.mfgCode, mfgPN)),
                                errorType = ConstantHelper.PIDCodeLength,
                                Source = objComponentModel.supplierName,
                                Type = ConstantHelper.PIDCodeLength,
                                apiPartdesc = objComponentModel.mfgPnDescription,
                                ActualPart = mfgPN,
                                MFGCode = objMfg.mfgCode,
                                MFGName = objMfg.mfgName,
                                PIDCode = string.Format("{0}+{1}", objMfg.mfgCode, mfgPN),
                                DataField = objMfg.id.ToString(),
                                description = objExtVerification.description,
                                bomMFG = objExtVerification.mfgName,
                                SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                                transactionID = objExtVerification.transactionID
                            };
                            bomList.Add(objbomStatus);
                        }
                    }
                    else if (mfgPN.Contains(ConstantHelper.PIDCODE_INVALID_CHARACTER) == true)
                    {
                        var PartUpdatedPIDCode = _IDigikeyPricingRepository.FindPartUpdatedPIDCode(objExtVerification.transactionID, objExtVerification.partID, objMfg.mfgCode, mfgPN);
                        if (PartUpdatedPIDCode != null && !string.IsNullOrEmpty(PartUpdatedPIDCode.ValidPIDCode))
                        {
                            objComponentModel.PIDCode = Convert.ToString(PartUpdatedPIDCode.ValidPIDCode).Trim();
                        }
                        else
                        {
                            bomStatus objbomStatus = new bomStatus()
                            {
                                partID = objExtVerification.partID,
                                lineID = objExtVerification.lineID,
                                productUrl = objComponentModel.productUrl,
                                partNumber = mfgPN,
                                errorMsg = string.Format(ConstantHelper.PIDCODE_HYPHENS_INVALID, string.Format("{0}+{1}", objMfg.mfgCode, mfgPN)),
                                errorType = ConstantHelper.PIDCodeInvalid,
                                Source = objComponentModel.supplierName,
                                Type = ConstantHelper.PIDCodeInvalid,
                                apiPartdesc = objComponentModel.mfgPnDescription,
                                ActualPart = mfgPN,
                                MFGCode = objMfg.mfgCode,
                                MFGName = objMfg.mfgName,
                                PIDCode = string.Format("{0}+{1}", objMfg.mfgCode, mfgPN),
                                DataField = objMfg.id.ToString(),
                                description = objExtVerification.description,
                                bomMFG = objExtVerification.mfgName,
                                SourceSupplierName = objSupplier != null ? objSupplier.mfgName : string.Empty,
                                transactionID = objExtVerification.transactionID
                            };
                            bomList.Add(objbomStatus);
                        }
                    }
                    else
                    {
                        objComponentModel.PIDCode = string.Format("{0}+{1}", objMfg.mfgCode, mfgPN);
                    }
                }
                objComponentModel.mfgcodeID = objMfg.id;
            }
            int? costCategoryID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCostCategory(objComponentModel.UnitPrice);
            objComponentModel.costCategoryID = costCategoryID;//assign cost category id

            //fetch Part Package Case ID
            int? partPackageCaseID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartPackageCaseID(objComponentModel.partPackage);
            objComponentModel.partPackageID = partPackageCaseID;

            objCommonApiError.bomStatusList = bomList;
            objCommonApiError.ComponentModel = objComponentModel;
            return objCommonApiError;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :save common pricing in mongo db  
        /// </summary>
        /// <param name="pricinglist">List<AutoPricingPrice></param>
        /// <param name="assyQtyList">List<rfq_assy_quantity></param>
        /// <param name="lineitem">rfq_lineitems</param>
        /// <param name="PricingApi">string</param>
        public int PricingDetail(List<AutoPricingPrice> pricinglist, List<RFQAssyQuantityModel> assyQtyList, PricingViewModel lineitem, string PricingApi, bool isPurchaseApi)
        {
            bool isexecuted = false;
            foreach (var price in pricinglist)
            {
                if (lineitem.qpa == null || lineitem.qpa == 0)
                {
                    isexecuted = true;
                    continue;
                }

                if (price.Manufacturers.Count() == 0)
                    isexecuted = true;
                foreach (var manufacturer in price.Manufacturers)
                {
                    foreach (var seller in manufacturer.Sellers)
                    {
                        isexecuted = true;
                        if (seller.PricesByReqQty != null && seller.PricesByReqQty.Count > 0)
                        {
                            if (lineitem.connectorTypeID == ConstantHelper.HeaderBreakAway)
                            {
                                lineitem.BOMUnitID = ConstantHelper.pinUOM;
                            }
                            UOMs fromUnit = new UOMs(); UOMs toUnit = new UOMs();
                            double stock = (double)seller.InStockQuantity;
                            fromUnit = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getUnits(lineitem.BOMUnitID ?? -1);
                            toUnit = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getUnits(lineitem.ComponentUnitID ?? -1);
                            if (lineitem.ComponentUnitID != null && lineitem.BOMUnitID != null)
                            {
                                stock = stock * (lineitem.packageSpqQty ?? 1);
                                var fromBasedUnitValues = (double)(toUnit.baseUnitConvertValue.Value);
                                var toBasedUnitValues = (double)fromUnit.baseUnitConvertValue.Value;
                                var ConvertFromValueIntoBasedValue = (stock / fromBasedUnitValues);
                                stock = ConvertFromValueIntoBasedValue * toBasedUnitValues;
                            }
                            if (lineitem.ApiNoOfPosition != null && lineitem.connectorTypeID == ConstantHelper.HeaderBreakAway)
                            {
                                stock = stock * lineitem.ApiNoOfPosition.Value;
                            }
                            CommonIDModel PackageID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(Helper.Helper.aliasTable.component_packagingmst.ToString(), seller.Packaging, ConstantHelper.packagingField);
                            //save price break for component
                            if (seller.PricesByReqQty.Count() > 0)
                                savePriceBreak(seller.PricesByReqQty, lineitem, PricingApi, seller.Packaging, seller.Sku, lineitem.IsCustomPrice, seller.APILeadTime, (PackageID != null ? PackageID.id : null));
                            //end price break
                            if (lineitem.isStockUpdate)
                            {
                                var objSupplierPrice = _IDigikeyPricingRepository.FindPricing((int)price.consolidateID, manufacturer.PartNumber, string.IsNullOrEmpty(price.PriceType) ? seller.PricingType : price.PriceType, lineitem.SupplierID, lineitem.mfgCodeID, (PackageID != null ? PackageID.id : null), seller.Sku, isPurchaseApi);
                                if (objSupplierPrice != null)
                                {
                                    objSupplierPrice.OrgInStock = (double)seller.InStockQuantity;
                                    objSupplierPrice.OtherStock = stock;
                                    objSupplierPrice.TimeStamp = seller.TimeStamp;
                                    objSupplierPrice.UpdatedTimeStamp = (Helper.Helper.GetCurrentUTCDateString());
                                    _IDigikeyPricingRepository.UpdatePrice(objSupplierPrice);
                                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateStock(objSupplierPrice._id.ToString(), (decimal)stock, objSupplierPrice.OrgInStock);
                                }
                                isexecuted = true;
                                continue;
                            }
                            RoHSViewModel rohsModel = _Irfq_assy_bomRepository.getRohsDetail(lineitem.rohsStatusID ?? 1);
                            string rohsIcon = string.Empty;
                            if (rohsModel != null)
                            {
                                rohsIcon = rohsModel.rohsIcon;
                            }
                            //update component api wise
                            int retint = UpdateComponent(seller, manufacturer.PartNumber, manufacturer.LTBDate, rohsModel != null ? rohsModel.id : ConstantHelper.Non_RoHS, ((manufacturer.PartStatus == null || manufacturer.PartStatus == string.Empty) ? ConstantHelper.Active : manufacturer.PartStatus), manufacturer.supplier, lineitem.mfgPNID, lineitem.SupplierID, manufacturer.mfgPNDescription, (PackageID != null ? PackageID.id : null));

                            string mountingType = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonName(ConstantHelper.mountingField, aliasTable.rfq_mountingtypemst.ToString(), lineitem.mountingtypeID ?? -1);
                            string functionalType = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonName(ConstantHelper.partTypeField, aliasTable.rfq_parttypemst.ToString(), lineitem.functionalCategoryID ?? -1);

                            FJTMongoQtySupplier qtySuppliers = new FJTMongoQtySupplier()
                            {
                                SupplierName = seller.SellerName != null ? seller.SellerName : string.Empty,
                                ManufacturerName = lineitem.mfgName,
                                Active = true,
                                ConsolidateID = price.consolidateID,
                                PartNumberId = lineitem.mfgPNID,
                                OrgInStock = (double)seller.InStockQuantity,
                                ProductUrl = seller.ProductUrl,
                                SupplierPN = string.IsNullOrEmpty(seller.Sku) ? ConstantHelper.SupplierPN : seller.Sku,
                                SourceOfPrice = seller.SellerName != null ? "Auto" : string.Empty,
                                APILeadTime = seller.APILeadTime,
                                Packaging = seller.Packaging,
                                TimeStamp = seller.TimeStamp,
                                Authorized_Reseller = seller.Authorized_Reseller,
                                ManufacturerPartNumber = manufacturer.PartNumber,
                                PartStatus = string.IsNullOrEmpty(manufacturer.PartStatus) ? CommonStatus.UNKNOWN.GetEnumStringValue() : manufacturer.PartStatus,
                                LTBDate = manufacturer.LTBDate,
                                PurchaseUom = seller.Uom,
                                MinimumBuy = (double)seller.MinimumBuy,
                                Multiplier = (double)seller.Multiplier,
                                RoHS = rohsModel != null ? rohsModel.name : string.Empty,
                                NCNR = seller.NCNR,
                                Reeling = seller.Reeling,
                                CurrencyName = Currency.DefaultUSD.GetEnumStringValue(),
                                IsDeleted = false,
                                PIDCode = lineitem.PIDCode,
                                PriceType = string.IsNullOrEmpty(price.PriceType) ? seller.PricingType : price.PriceType,
                                rfqAssyID = lineitem.rfqAssemblyID,
                                ApiNoOfPosition = lineitem.ApiNoOfPosition,
                                NoOfPosition = lineitem.NoOfPositions,
                                eolDate = seller.eolDate,
                                feature = seller.feature,
                                isPackaging = lineitem.isPackaging,
                                partPackage = seller.partPackage ?? lineitem.partPackage,
                                value = seller.partValue,
                                noOfRows = lineitem.ApiNoOfRows,
                                mfgPNDescription = manufacturer.mfgPNDescription,
                                UpdatedTimeStamp = (Helper.Helper.GetCurrentUTCDateString()),
                                mfgCodeID = lineitem.mfgCodeID,
                                packageID = (PackageID != null ? PackageID.id : null),
                                SupplierID = lineitem.SupplierID,
                                OtherStock = stock,
                                PartAbbrivation = toUnit.abbreviation,
                                BOMAbbrivation = fromUnit.abbreviation,
                                packageQty = lineitem.packageSpqQty,
                                rohsIcon = rohsIcon,
                                MountingTypeID = lineitem.mountingtypeID,
                                FunctionalTypeID = lineitem.functionalCategoryID,
                                MountingType = mountingType,
                                FunctionalType = functionalType,
                                PackageSPQQty = lineitem.PackageQty,
                                bomUnitID = lineitem.BOMUnitID,
                                componentUnitID = lineitem.ComponentUnitID,
                                qpa = lineitem.qpa,
                                connectorTypeID = lineitem.connectorTypeID,
                                AuthorizeSupplier = ConstantHelper.Authorize,
                                isPurchaseApi = isPurchaseApi,
                                AdditionalValueFee = seller.AdditionalValueFee,
                                approvedMountingType = lineitem.approvedMountingType,
                                mismatchMountingTypeStep = lineitem.mismatchMountingTypeStep,
                                mismatchFunctionalCategoryStep = lineitem.mismatchFunctionalCategoryStep
                            };
                            //manage unique pricing for part number 
                            ObjectId assySupplierQtyID = new ObjectId();
                            var pricingObj = _IDigikeyPricingRepository.FindPricing((int)price.consolidateID, qtySuppliers.ManufacturerPartNumber, qtySuppliers.PriceType, qtySuppliers.SupplierID, qtySuppliers.mfgCodeID, qtySuppliers.packageID, qtySuppliers.SupplierPN, isPurchaseApi);
                            if (pricingObj != null)
                            {
                                assySupplierQtyID = pricingObj._id;
                                pricingObj.IsDeleted = true;
                                _IDigikeyPricingRepository.UpdatePrice(pricingObj);
                            }
                            _IDigikeyPricingRepository.SavePrice(qtySuppliers);
                            //end here for pricing main block

                            foreach (var reqqty in assyQtyList.Where(x => x.isQtyDetail))
                            {
                                var _totalQty = (reqqty.requestQty * (lineitem.qpa ?? 1));
                                var requiredQty = reqqty.requestQty * (lineitem.qpa ?? 1);
                                if (reqqty.rfqpricegroupID != null)
                                { // Price Group related logic change for get preice
                                    var currentConsolidateQty = assyQtyList.Where(x => x.consolidateID == lineitem.consolidateID && x.rfqpricegroupID == reqqty.rfqpricegroupID).FirstOrDefault();
                                    if (currentConsolidateQty != null && currentConsolidateQty.requestQty > 0)
                                    {
                                        _totalQty = currentConsolidateQty.requestQty;
                                        requiredQty = currentConsolidateQty.requestQty;
                                    }
                                }
                                if (lineitem.ComponentUnitID != null && lineitem.BOMUnitID != null)
                                {
                                    var fromBasedUnitValues = ((double)fromUnit.baseUnitConvertValue.Value) * (lineitem.packageSpqQty ?? 1);
                                    var toBasedUnitValues = (double)toUnit.baseUnitConvertValue.Value;
                                    var ConvertFromValueIntoBasedValue = (requiredQty / fromBasedUnitValues);
                                    _totalQty = (ConvertFromValueIntoBasedValue * toBasedUnitValues) == 0 ? 1 : (ConvertFromValueIntoBasedValue * toBasedUnitValues);
                                    // _totalQty = (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * (toBasedUnitValues))) == 0 ? 1 : (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                                }
                                if (lineitem.ApiNoOfPosition != null && lineitem.connectorTypeID == ConstantHelper.HeaderBreakAway)
                                {
                                    lineitem.NoOfPositions = lineitem.NoOfPositions != null ? lineitem.NoOfPositions : 1;
                                    requiredQty = requiredQty * lineitem.NoOfPositions.Value;
                                    double noOfPositionDiff = Convert.ToDouble((lineitem.ApiNoOfPosition) - ((lineitem.ApiNoOfPosition) % (lineitem.NoOfPositions)));
                                    if (noOfPositionDiff == 0)
                                    {
                                        continue;
                                    }
                                    _totalQty = requiredQty / noOfPositionDiff;
                                    //if (lineitem.ApiNoOfPosition.Value == 0)
                                    //    _totalQty = 0;
                                    //else
                                    //_totalQty = (int)(Math.Ceiling(requiredQty/(lineitem.ApiNoOfPosition.Value-(lineitem.ApiNoOfPosition.Value % lineitem.NoOfPositions.Value))));
                                }
                                double bomMin, bomMult;
                                bomMult = (double)seller.Multiplier;
                                bomMin = (double)seller.MinimumBuy;
                                bomMult = bomMult == 0 ? 1 : bomMult;
                                var ordQty = Math.Max((Math.Ceiling((_totalQty) / bomMult) * bomMult), bomMin);
                                var actualQty = ordQty;
                                double actualPrice = 0;
                                double perUnitPrice = 0;
                                if (lineitem.IsCustomPrice == true && seller.SellerName.ToUpper() == Helper.Helper.SourceOfPricing.TTIPricingService.GetEnumStringValue())
                                {
                                    if (price.VIPPrice == null)
                                        continue;
                                    perUnitPrice = price.VIPPrice.Value;
                                }
                                else
                                {
                                    var unitPrice = seller.PricesByReqQty.FirstOrDefault(x => x.Key == ordQty);
                                    if (unitPrice.Value != null)
                                    {
                                        var pricedet = unitPrice.Value.Replace(ConstantHelper.Dollar, "");
                                        perUnitPrice = double.Parse(pricedet);
                                    }
                                    else
                                    {
                                        unitPrice = seller.PricesByReqQty.Where(x => x.Key < ordQty).OrderByDescending(x => x.Key).FirstOrDefault();
                                        if (unitPrice.Value == null)
                                        {
                                            var pricedet = (seller.PricesByReqQty.OrderByDescending(x => x.Key).FirstOrDefault()).Value.Replace(ConstantHelper.Dollar, "");
                                            perUnitPrice = double.Parse(pricedet);
                                        }
                                        else
                                        {
                                            var pricedet = unitPrice.Value.Replace(ConstantHelper.Dollar, "");
                                            perUnitPrice = double.Parse(pricedet);
                                        }

                                    }
                                }
                                actualPrice = perUnitPrice;
                                if (lineitem.ComponentUnitID != null && lineitem.BOMUnitID != null)
                                {
                                    //change code as did for Each
                                    perUnitPrice = (perUnitPrice * (((double?)toUnit.baseUnitConvertValue) ?? 1)) / ((lineitem.packageSpqQty ?? 1) * ((double?)fromUnit.baseUnitConvertValue ?? 1));
                                    var toBasedUnitValues = ((double)fromUnit.baseUnitConvertValue.Value) * (lineitem.packageSpqQty ?? 1);
                                    var fromBasedUnitValues = toUnit.baseUnitConvertValue.Value;
                                    var ConvertFromValueIntoBasedValue = (ordQty / (double)fromBasedUnitValues);
                                    ordQty = (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * toBasedUnitValues));

                                    //check for total price
                                    //ConvertFromValueIntoBasedValue = (_totalQty / fromBasedUnitValues);
                                    //_totalQty = (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : (int)(Math.Ceiling(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                                    _totalQty = (reqqty.requestQty * (lineitem.qpa ?? 1));
                                    if (reqqty.rfqpricegroupID != null)
                                    { // Price Group related logic change for get preice
                                        var currentConsolidateQty = assyQtyList.Where(x => x.consolidateID == lineitem.consolidateID && x.rfqpricegroupID == reqqty.rfqpricegroupID).FirstOrDefault();
                                        if (currentConsolidateQty != null && currentConsolidateQty.requestQty > 0)
                                        {
                                            _totalQty = currentConsolidateQty.requestQty;
                                        }
                                    }
                                    //ordQty = _totalQty * (fromUnit.baseUnitConvertValue ?? 1) * (lineitem.PackageQty??1);
                                    //logic for stock
                                }
                                if (lineitem.ApiNoOfPosition != null && lineitem.connectorTypeID == ConstantHelper.HeaderBreakAway)
                                {
                                    ordQty = ordQty * lineitem.ApiNoOfPosition.Value;
                                    perUnitPrice = perUnitPrice / lineitem.ApiNoOfPosition.Value;
                                    _totalQty = ((reqqty.requestQty * (lineitem.qpa ?? 1)) * lineitem.NoOfPositions ?? 1);
                                    if (reqqty.rfqpricegroupID != null)
                                    { // Price Group related logic change for get preice
                                        var currentConsolidateQty = assyQtyList.Where(x => x.consolidateID == lineitem.consolidateID && x.rfqpricegroupID == reqqty.rfqpricegroupID).FirstOrDefault();
                                        if (currentConsolidateQty != null && currentConsolidateQty.requestQty > 0)
                                        {
                                            _totalQty = (currentConsolidateQty.requestQty * lineitem.NoOfPositions ?? 1);
                                        }
                                    }
                                }
                                if (seller.AdditionalValueFee != null && seller.AdditionalValueFee > 0)
                                {
                                    //Custom reel code to add additional Price 19/03/2020 2:51 PM
                                    double additionalPrice = seller.AdditionalValueFee.Value / ordQty;
                                    perUnitPrice = perUnitPrice + additionalPrice;
                                    actualPrice = actualPrice + additionalPrice;
                                }
                                AssemblyQtyBreak assyBreak = new AssemblyQtyBreak()
                                {
                                    qtySupplierID = qtySuppliers._id,
                                    RfqAssyQtyId = reqqty.id,
                                    PricePerPart = perUnitPrice,
                                    OrderQty = ordQty,
                                    TotalDollar = ordQty * perUnitPrice,
                                    CurrentQty = reqqty.requestQty,
                                    SufficientStockQty = qtySuppliers.OrgInStock >= ordQty,
                                    isDeleted = false,
                                    ConsolidateID = qtySuppliers.ConsolidateID,
                                    RequireQty = (long)_totalQty,
                                    ActualQty = actualQty,
                                    ActualPrice = actualPrice
                                };
                                //manage unique pricing for part number assy qty wise
                                var assyQty = _IDigikeyPricingRepository.FindAssyPrice((int)price.consolidateID, assySupplierQtyID, reqqty.id);
                                if (assyQty != null)
                                {
                                    assyQty.isDeleted = true;
                                    _IDigikeyPricingRepository.UpdateAssyPrice(assyQty);
                                }
                                _IDigikeyPricingRepository.SaveAssyPrice(assyBreak);
                                //end here for pricing main block
                                //var result = 1;
                                //if (qtySuppliers.PriceType != Helper.Helper.PriceStatus.Custom.GetEnumStringValue())
                                // result = SaveDefaultPrice((int)price.consolidateID, reqqty.id, (decimal?)assyBreak.TotalDollar, qtySuppliers.ManufacturerPartNumber, qtySuppliers.SupplierName, Convert.ToDecimal(perUnitPrice), (lineitem.ComponentUnitID!=null && lineitem.ComponentUnitID>0)? qtySuppliers.OtherStock:qtySuppliers.OrgInStock, qtySuppliers.MinimumBuy, qtySuppliers.Multiplier, (int)assyBreak.OrderQty, qtySuppliers.PIDCode, qtySuppliers.APILeadTime, qtySuppliers.ApiNoOfPosition, lineitem.mfgPNID, qtySuppliers.Packaging, qtySuppliers._id, assyBreak.OrderQty,lineitem.BOMUnitID);
                                if (assyQtyList[assyQtyList.Count() - 1].requestQty == reqqty.requestQty)
                                    isexecuted = true;
                            }
                        }
                    }
                }
            }
            if (isexecuted || pricinglist.Count() == 0)
            {
                #region log success msg in AutoPricingStatus
                int status = (int)Status.SendRequest;
                if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.consolidateID == lineitem.consolidateID
                && x.rfqAssyID == lineitem.rfqAssemblyID && x.pricingSupplierID == lineitem.SupplierID && x.status == status && x.isPurchaseApi == isPurchaseApi
                ))
                {
                    AutoPricingLineItemwiseStatus statusModel = new AutoPricingLineItemwiseStatus()
                    {
                        Status = (int)Status.Success,
                        Message = string.Empty,
                        ErrorMessage = string.Empty,
                        PricingAPIName = PricingApi,
                        AssyID = lineitem.rfqAssemblyID,
                        ConsolidateID = lineitem.consolidateID,
                        isStockUpdate = lineitem.isStockUpdate,
                        isPurchaseApi = isPurchaseApi,
                        supplierID = lineitem.SupplierID
                    };
                    if (_Irfq_lineitem_autopricingstatusRepository.Any(x => x.rfqAssyID == lineitem.rfqAssemblyID && x.pricingSupplierID == lineitem.SupplierID
                    && x.status == status && x.isPurchaseApi == isPurchaseApi
                   ))
                    {
                        int response = _Irfq_lineitem_autopricingstatusRepository.UpdateLineItemwiseAutoPricing((int)Status.Success, string.Empty, string.Empty, lineitem.rfqAssemblyID, lineitem.SupplierID.Value, lineitem.consolidateID, status, isPurchaseApi);
                        ApiCallforSuccessStatus(statusModel);
                    }
                }
                #endregion
            }
            return 1;
        }

        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose :Run service each minutes to get data which is in send request from last 30 mins.
        /// </summary>
        public void UpdatePendingAutoPricingStatus()
        {
            var objConfiguratoin = _IsystemconfigrationsRepository.GetSystemConfiguration("PricingStatusUpdateTime");
            if (objConfiguratoin != null && objConfiguratoin.values != null)
            {
                try
                {
                    int minuts = int.Parse(objConfiguratoin.values);
                    var list = _Irfq_lineitem_autopricingstatusRepository.UpdatePendingAutoPricingStatus((int)Status.NotPricing, ConstantHelper.AutoUpdateMessage, minuts);
                    foreach (var item in list)
                    {
                        ApiCallforSuccessStatus(item);
                    }
                }
                catch (Exception ex)
                {
                    ServiceErrorLog objErrorLog = new ServiceErrorLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = ConstantHelper.Pricing,
                    };
                    _IRabbitMQ.SendRequest(objErrorLog);
                }
            }
        }

        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : Run service every day to get data which are not updated in last day.
        /// </summary>
        public void UpdateOldComponentDetails()
        {
            dynamic partObj = new Object();
            string myContent = JsonConvert.SerializeObject(partObj);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.UpdateComponentDetails, byteContent);
            });
        }

        public void sendCustomerDetailForReport(ObsoletePartRequestModel objModel, string APIUrl)
        {
            string myContent = JsonConvert.SerializeObject(objModel);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClientReport();
            Task.Run(() =>
            {
                client.PostAsync(APIUrl, byteContent);
            });
        }


        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :validate json object get from supplier api
        /// </summary>
        /// <param name="response">string</param>
        public bool ValidateJSON(string response)
        {
            try
            {
                JToken.Parse(response);
                return true;
            }
            catch (JsonReaderException ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing,
                };
                _IRabbitMQ.SendRequest(objErrorLog);
                return false;
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update ui bom status
        /// </summary>
        /// <param name="objStatus">ExternalPartVerificationRequestLog</param>

        public void ApiCallforExternalPartBOMUpdate(ExternalPartVerificationRequestLog objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.ExternalBOMStatus, byteContent);
            });
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api after rate limit exceeds
        /// </summary>
        /// <param name="objStatus">bomStatus</param>

        public void sendExceedLimitNotification(bomStatus objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.sendExceedLimitNotification, byteContent);
            });
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update ui part master status
        /// </summary>
        /// <param name="objStatus">ExternalPartVerificationRequestLog</param>

        public void ApiCallforExternalPartUpdate(ExternalPartVerificationRequestLog objStatus)
        {
            //_Irfq_consolidated_mfgpn_lineitem_alternateRepository.RemoveLogForPart(objStatus.transactionID);
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.ExternalPartUpdate, byteContent);
            });
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update status for cart
        /// </summary>
        /// <param name="objStatus">SendRequestTocheckCartStatus</param>
        public void SendRequestTocheckCartStatus()
        {
            dynamic partObj = new Object();
            string myContent = JsonConvert.SerializeObject(partObj);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            _IDigikeyPricingRepository.removeMongoStatus();
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository.RemoveLogForPart();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.SendRequestToupdateCartStatus, byteContent);
            });
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update ui error status
        /// </summary>
        /// <param name="objStatus">AutoPricingLineItemwiseStatus</param>

        public void ApiCallforErrorStatus(AutoPricingLineItemwiseStatus objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.ApiErrorStatus, byteContent);
            });
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update digikey error status
        /// </summary>
        /// <param name="objStatus">ApiCallforDigikeyErrorStatus</param>
        public void ApiCallforDigikeyErrorStatus(AutoPricingLineItemwiseStatus objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.DigikeyApiErrorStatus, byteContent);
            });
        }

        /// <summary>
        /// Author  : Purav Patel
        /// Purpose :call api for delivering status for file upload
        /// </summary>
        /// <param name="objStatus">ApiCallforPartPictureStatus</param>
        public void ApiCallforPartPictureStatus(GenericFileStatus objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.PartFileStatus, byteContent);
            });
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api to update progress bar in bom
        /// </summary>
        /// <param name="objStatus">ApiCallforBomProgressStatus</param>
        public void ApiCallforBomProgressStatus(ExternalPartVerificationRequestLog objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.BomApiProgressStatus, byteContent);
            });
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api to update progress bar in Part Master
        /// </summary>
        /// <param name="objStatus">ApiCallforBomProgressStatus</param>
        public void ApiCallforPartMasterProgressStatus(ExternalPartVerificationRequestLog objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.PartMasterApiProgressStatus, byteContent);
            });
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :call api for update UI success status
        /// </summary>
        /// <param name="objStatus">ApiCallforDigikeyErrorStatus</param>
        public void ApiCallforSuccessStatus(AutoPricingLineItemwiseStatus objStatus)
        {
            string myContent = JsonConvert.SerializeObject(objStatus);
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            ByteArrayContent byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue(ConstantHelper.ApplicationJson);
            HttpClient client = CreateHttpClient();
            Task.Run(() =>
            {
                client.PostAsync(ConstantHelper.ApiSuccesStatus, byteContent);
            });
        }

        public void UpdatePriceBreakComponent()
        {
            var priceBreakList = _IDigikeyPricingRepository.FindAllPriceBreakComponent();
            foreach (PriceBreakComponent item in priceBreakList)
            {
                ManufacturerViewModel objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(item.supplier, ConstantHelper.DIST);
                if (objSupplier != null)
                {
                    item.supplierID = objSupplier.id;
                    if (!string.IsNullOrEmpty(item.supplierPN))
                    {
                        var objComp = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDataFromMFGPN(objSupplier.id, item.supplierPN);
                        if (objComp != null)
                        {
                            item.supplierPartID = objComp.id;
                        }
                    }
                    _IDigikeyPricingRepository.updatePriceBreak(item);
                }
            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :save price break for component
        /// </summary>
        /// <param name="objStatus">ApiCallforDigikeyErrorStatus</param>
        public void savePriceBreak(Dictionary<int, string> PricesByReqQty, PricingViewModel lineitem, string supplier, string Packaging, string supplierPN, bool isCustom, int? LeadTime, int? packagingID)
        {
            List<PriceBreakComponent> priceBreaks = new List<PriceBreakComponent>();
            var priceBreakList = _IDigikeyPricingRepository.FindPriceBreakComponent(lineitem.mfgPNID.Value, supplier, supplierPN);
            int? supplierPartID = null;
            int? supplierID = null;
            ManufacturerViewModel objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(supplier, ConstantHelper.DIST);
            if (objSupplier != null)
            {
                supplierID = objSupplier.id;
                if (!string.IsNullOrEmpty(supplierPN))
                {
                    var objComp = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDataFromMFGPN(objSupplier.id, supplierPN);
                    if (objComp != null)
                    {
                        supplierPartID = objComp.id;
                    }
                }
            }
            if (priceBreakList.Count > 0 && PricesByReqQty != null)
            {
                foreach (var item in PricesByReqQty)
                {
                    PriceBreakComponent objPriceBreak = priceBreakList.FirstOrDefault(x => x.qty == item.Key);
                    var pricedet = item.Value.Replace(ConstantHelper.Dollar, "");
                    if (objPriceBreak != null)
                    {
                        if ((Helper.Helper.GetCurrentDate()).Date != objPriceBreak.timeStamp.Date)
                        {
                            PriceBreakComponent priceBreak = new PriceBreakComponent();
                            priceBreak.price = decimal.Parse(pricedet);
                            priceBreak.timeStamp = (Helper.Helper.GetCurrentDate());
                            priceBreak.UpdatedTimeStamp = (Helper.Helper.GetCurrentUTCDateString());
                            priceBreak.supplierPN = supplierPN;
                            priceBreak.supplierID = supplierID;
                            priceBreak.supplier = supplier;
                            priceBreak.mfgPN = lineitem.mfgPN;
                            priceBreak.isCustomPrice = isCustom;
                            priceBreak.componentID = lineitem.mfgPNID.Value;
                            priceBreak.Packaging = Packaging;
                            priceBreak.qty = item.Key;
                            priceBreak.leadTime = LeadTime;
                            priceBreak.packagingID = packagingID;
                            priceBreak.supplierPartID = supplierPartID;
                            priceBreaks.Add(priceBreak);
                        }
                    }
                    else
                    {
                        PriceBreakComponent priceBreak = new PriceBreakComponent()
                        {
                            mfgPN = lineitem.mfgPN,
                            componentID = lineitem.mfgPNID.Value,
                            supplier = supplier,
                            Packaging = Packaging,
                            timeStamp = (Helper.Helper.GetCurrentDate()),
                            UpdatedTimeStamp = (Helper.Helper.GetCurrentUTCDateString()),
                            price = decimal.Parse(pricedet),
                            qty = item.Key,
                            supplierPN = supplierPN,
                            isCustomPrice = isCustom,
                            packagingID = packagingID,
                            supplierID = supplierID,
                            supplierPartID = supplierPartID,
                            leadTime = LeadTime
                        };
                        priceBreaks.Add(priceBreak);
                    }
                }
            }
            else
            {
                if (PricesByReqQty != null)
                {
                    foreach (var item in PricesByReqQty)
                    {
                        var pricedet = item.Value.Replace(ConstantHelper.Dollar, "");
                        PriceBreakComponent priceBreak = new PriceBreakComponent()
                        {
                            mfgPN = lineitem.mfgPN,
                            componentID = lineitem.mfgPNID.Value,
                            supplier = supplier,
                            Packaging = Packaging,
                            timeStamp = (Helper.Helper.GetCurrentDate()),
                            UpdatedTimeStamp = (Helper.Helper.GetCurrentUTCDateString()),
                            price = decimal.Parse(pricedet),
                            qty = item.Key,
                            supplierPN = supplierPN,
                            isCustomPrice = isCustom,
                            packagingID = packagingID,
                            supplierID = supplierID,
                            supplierPartID = supplierPartID,
                            leadTime = LeadTime
                        };
                        priceBreaks.Add(priceBreak);
                    }
                }
            }
            _IDigikeyPricingRepository.SavePriceBreakComponent(priceBreaks);
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose :update component detail
        /// </summary>
        /// <param name="ComponentModel">AutoPricingSeller</param>
        public int UpdateComponent(AutoPricingSeller ComponentModel, string mfgPN, DateTime? LTBDate, int? rohsstatusID, string status, string supplier, int? componentID, int? supplierID, string mfgDescription, int? packagingID)
        {
            CommonIDModel partStatusID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(aliasTable.component_partstatusmst.ToString(), status, ConstantHelper.partStatusField);
            CommonIDModel mountingTypeID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(aliasTable.rfq_mountingtypemst.ToString(), ComponentModel.mountingType, ConstantHelper.mountingField);
            CommonIDModel connectorTypeID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(aliasTable.rfq_connectertypemst.ToString(), ComponentModel.connectorTypetext, ConstantHelper.connectorField);
            CommonIDModel functionalCategoryID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCommonID(aliasTable.rfq_parttypemst.ToString(), ComponentModel.categoryText, ConstantHelper.partTypeField);
            if (ComponentModel.connectorTypetext != string.Empty)
            {
                if (connectorTypeID == null)
                {
                    connectorTypeID = new CommonIDModel();
                }
                connectorTypeID.id = connectorTypeID != null ? connectorTypeID.id : ConstantHelper.None_Status;
            }
            else
            {
                ComponentModel.connectorTypetext = null;
            }
            if (string.IsNullOrEmpty(ComponentModel.mountingType))
            {
                if (mountingTypeID == null)
                {
                    mountingTypeID = new CommonIDModel();
                }
                mountingTypeID.id = ConstantHelper.None_Status;
                ComponentModel.mountingType = ConstantHelper.TBD;
            }
            if (string.IsNullOrEmpty(ComponentModel.RoHS))
            {
                rohsstatusID = ConstantHelper.None_Status;
                ComponentModel.RoHS = ConstantHelper.TBD;
            }
            if (string.IsNullOrEmpty(ComponentModel.categoryText))
            {
                if (functionalCategoryID == null)
                {
                    functionalCategoryID = new CommonIDModel();
                }
                functionalCategoryID.id = ConstantHelper.None_Status;
                ComponentModel.categoryText = ConstantHelper.TBD;
            }
            var pricedet = (ComponentModel.PricesByReqQty.FirstOrDefault()).Value.Replace(ConstantHelper.Dollar, "");
            ComponentModel model = new Model.ComponentModel()
            {
                ltbDate = LTBDate,
                RoHSStatusID = rohsstatusID,
                leadTime = ComponentModel.APILeadTime,
                packaging = ComponentModel.Packaging,
                noOfPosition = ComponentModel.NoOfPosition,
                minimum = ((int)(ComponentModel.MinimumBuy)).ToString(),
                mult = ((int)(ComponentModel.Multiplier)).ToString(),
                rohsText = ComponentModel.RoHS,
                dataSheetLink = ComponentModel.dataSheetLink,
                eolDate = ComponentModel.eolDate,
                tolerance = ComponentModel.tolerance,
                minOperatingTemp = ComponentModel.minOperatingTemp,
                maxOperatingTemp = ComponentModel.maxOperatingTemp,
                weight = ComponentModel.weight,
                heightText = ComponentModel.heightText != null ? (ComponentModel.heightText.Replace("''", "feet")).Replace("'", "in") : null,
                partStatusText = status,
                feature = ComponentModel.feature,
                functionalCategoryText = ComponentModel.categoryText,
                updatedAtApi = GetCurrentDate(),
                distPN = ComponentModel.Sku,
                mfgPN = mfgPN,
                noOfRows = ComponentModel.noOfRows,
                voltage = ComponentModel.volatage,
                value = ComponentModel.partValue,
                partStatusID = (partStatusID != null ? partStatusID.id : null),
                powerRating = ComponentModel.powerRating,
                pitchMating = ComponentModel.pitchMating,
                pitch = ComponentModel.pitch,
                sizeDimension = ComponentModel.sizeDimension,
                operatingTemp = ComponentModel.operatingTemp,
                mountingTypeID = (mountingTypeID != null ? mountingTypeID.id : null),
                mountingType = ComponentModel.mountingType,
                connectorTypeID = (connectorTypeID != null ? connectorTypeID.id : null),
                connectorTypeText = ComponentModel.connectorTypetext,
                functionalCategoryID = (functionalCategoryID != null ? functionalCategoryID.id : null),
                partPackage = ComponentModel.partPackage,
                temperatureCoefficient = string.IsNullOrEmpty(ComponentModel.tempratureCoefficient) ? null : ComponentModel.tempratureCoefficient,
                temperatureCoefficientValue = ComponentModel.tempratureCoefficientValue,
                temperatureCoefficientUnit = ComponentModel.tempratureCoefficientValue != null ? ConstantHelper.TempratureCoefficientUnit : null,
                componentID = componentID,
                SupplierID = supplierID,
                color = ComponentModel.color,
                imageURL = ComponentModel.imageURL,
                mfgPnDescription = mfgDescription,
                ComponentImages = ComponentModel.ComponentImages,
                packagingID = packagingID,
                DataSheets = ComponentModel.DataSheets,
                UnitPrice = pricedet != null ? double.Parse(pricedet) : 0,
                noOfPositionText = ComponentModel.noOfPositionText ?? string.Empty,
                noOfRowsText = ComponentModel.noOfRowsText ?? string.Empty,
                detailDescription = ComponentModel.detailDescription
            };
            var returnint = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.UpdateComponentDetail(model, supplier, true, true);
            return 1;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : get pricing list related to partnumber keyword 
        /// </summary>
        /// <param name="baseUri">string</param>
        /// <param name="accessToken">string</param>
        /// <param name="clientId">string</param>
        /// <param name="response">dynamic</param>
        public dynamic GetCspPricingsV3(string baseUri, string accessToken, string clientId, dynamic response, string CustomerID, int packagesCount)
        {
            if (response == null || response.ProductsCount == 0 || response.ExactManufacturerProducts == null || (response.ExactManufacturerProducts.Count == 0 && response.ExactDigiKeyProduct == null))
                return response;
            List<dynamic> AllParts = ((IEnumerable)response.Products).Cast<dynamic>().ToList();
            List<dynamic> exactParts = ((IEnumerable)response.ExactManufacturerProducts).Cast<dynamic>().ToList();
            if (response.ExactDigiKeyProduct != null && exactParts.Count() == 0)
            {
                exactParts = AllParts;
            }
            List<dynamic> parts = new List<dynamic>();
            foreach (var item in exactParts)
            {
                var partObject = AllParts.Where(x => x.ManufacturerPartNumber == item.ManufacturerPartNumber).FirstOrDefault();
                if (partObject != null)
                {
                    //item.MediaLinks = partObject.MediaLinks;
                    item.index = (item.Packaging.Value == ConstantHelper.CutTape || item.Packaging.Value == ConstantHelper.DigiReel) ? 2 : 1;
                    //int index = item.index;
                }

                parts.Add(item);
                dynamic alternateMainObj = new ExpandoObject();
                alternateMainObj = JsonConvert.DeserializeObject<dynamic>(JsonConvert.SerializeObject(item));
                // dynamic detail = JsonConvert.DeserializeObject(item);
                foreach (var alternate in item.AlternatePackaging)
                {
                    if (alternateMainObj.ManufacturerPartNumber == alternate.ManufacturerPartNumber)
                    {
                        var digikeyObj = AllParts.Where(x => alternate.DigiKeyPartNumber == x.DigiKeyPartNumber).FirstOrDefault();
                        dynamic alternateObj = new ExpandoObject();
                        alternateObj = JsonConvert.DeserializeObject<dynamic>(JsonConvert.SerializeObject(item));
                        alternateObj.index = (alternate.Packaging.Value == ConstantHelper.CutTape || alternate.Packaging.Value == ConstantHelper.DigiReel) ? 2 : 1;
                        alternateObj.Packaging = alternate.Packaging;
                        alternateObj.QuantityAvailable = alternate.QuantityAvailable;
                        alternateObj.ManufacturerPartNumber = alternate.ManufacturerPartNumber;
                        alternateObj.DigiKeyPartNumber = alternate.DigiKeyPartNumber;
                        alternateObj.QuantityOnOrder = alternate.QuantityOnOrder;
                        alternateObj.MinimumOrderQuantity = alternate.MinimumOrderQuantity;
                        alternateObj.StandardPricing = digikeyObj != null ? digikeyObj.StandardPricing : null;
                        alternateObj.UnitPrice = alternate.UnitPrice;
                        alternateObj.Manufacturer = alternate.Manufacturer;
                        parts.Add(alternateObj);
                    }
                }
            }
            List<dynamic> cspParts = new List<dynamic>();
            parts = parts.OrderBy(x => x.index).ToList();
            foreach (var part in parts)
            {
                string digiKeyPartNumber = part.DigiKeyPartNumber;
                var data = DigikeyPartSearchV3(baseUri, accessToken, clientId, digiKeyPartNumber, packagesCount, CustomerID);
                var cspResponse = JsonConvert.DeserializeObject<dynamic>(data);
                /* If Rate Limit exceeded then wait for 1 min and retry same request */
                if (cspResponse != null &&
                    cspResponse.StatusCode != null)
                {
                    Thread.Sleep(Helper.ConstantHelper.DigikeyTimeoutMiliSeconds);

                    data = DigikeyPartSearchV3(baseUri, accessToken, clientId, digiKeyPartNumber, packagesCount, CustomerID);
                    cspResponse = JsonConvert.DeserializeObject<dynamic>(data);

                }
                if (cspResponse != null && cspResponse.StatusCode != ConstantHelper.INVALID_ARG && cspResponse.StatusCode != ConstantHelper.INVALID_RETURN)
                {
                    cspParts.Add(cspResponse);
                }
                else if (cspResponse != null && cspResponse.StatusCode == ConstantHelper.INVALID_ARG && cspResponse.StatusCode != ConstantHelper.INVALID_RETURN)
                {
                    cspParts.Add(part);
                }
            }
            if (cspParts.Any())
            {
                response.Parts = JToken.FromObject(cspParts);
            }
            return response;
        }


        //update datasheet link download file
        public void downloaddataSheetLinks()
        {
            var dataList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getDataSheetList();
            foreach (DataSheetComponentModel item in dataList)
            {
                sendDataSheetDownLoad(item);
                Thread.Sleep(1000);
            }
        }

        public void sendDataSheetDownLoad(DataSheetComponentModel item)
        {
            try
            {
                Uri uri = new Uri(item.datasheetURL);
                string filename = String.Empty;

                using (var client = new WebClient())
                {
                    client.Headers.Add("accept", "*/*");
                    byte[] filedata = client.DownloadData(item.datasheetURL);

                    GenericFilePathStatus genericFilePathStatus = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getFilePathByGenricOwnerType(EntityIDs.Component.GetEnumStringValue(), item.refComponentID);
                    using (MemoryStream ms = new MemoryStream(filedata))
                    {
                        genericFilePathStatus.newDocumentPath = genericFilePathStatus.newDocumentPath.Replace("/", "\\");
                        string root = string.Concat(ConfigurationManager.AppSettings["PartDataSheetUploadPath"].ToString(), genericFilePathStatus.newDocumentPath, "\\", ConstantHelper.DataSheets);
                        // If directory does not exist, don't even try   
                        if (!Directory.Exists(root))
                        {
                            //Directory dose not exist
                            Directory.CreateDirectory(root);
                        }

                        var urlData = item.datasheetURL.Split('/');
                        if (item.datasheetURL.Contains(".pdf"))
                        {
                            // logic for overcome duplicate '.pdf' extension 
                            // e.g https://multimedia.3m.com/mws/media/805581O/3m-heat-shrink-tubing-product-selection-guide-low-res-pdf.pdf

                            var fileNameDetail = (urlData[urlData.Length - 1]).Split('.');
                            filename = String.Format("{0}.pdf", fileNameDetail[0]);
                        }
                        else
                        {
                            filename = String.Format("{0}.pdf", urlData[urlData.Length - 2]);
                        }
                        // used trim to handle empty stace issue in file name for part "DP190-GRAY" sheet name ""
                        filename = filename.Trim();
                        using (FileStream decompressedFileStream = File.Create(root + "\\" + filename))
                        {
                            byte[] bytes = new byte[ms.Length];
                            ms.Read(bytes, 0, (int)ms.Length);
                            decompressedFileStream.Write(bytes, 0, bytes.Length);
                            ms.Close();

                            _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateDataSheetDownloaded(item.id);
                            _Irfq_consolidated_mfgpn_lineitem_alternateRepository.addDataSheetLocalDownloadFile(filename, item.refComponentID, item.saRoleID);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    rfqAssyID = item.refComponentID,
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.DataSheets,
                    supplier = ConstantHelper.DataSheets,
                    timeStamp = DateTime.UtcNow
                };
                _IRabbitMQ.SendRequest(objErrorLog);
            };
        }

        //get arrow api result
        public dynamic ArrowApiGetResponse(string apikey, string loginkey, string partNumber)
        {
            string arrowpartUrlEndpoint = ConstantHelper.arrowpartUrlEndpoint;
            var client = new RestClient(ConstantHelper.ArrowBaseURI);
            var req = new RestRequest(arrowpartUrlEndpoint, Method.GET)
                    .AddParameter(ConstantHelper.LoginKey, loginkey)
                    .AddParameter(ConstantHelper.ArrowApiKey, apikey)
                    .AddParameter(ConstantHelper.SearchToken, partNumber.Replace(" ", ""))
                    .AddParameter(ConstantHelper.Rows, 10);

            string _requestString = " ";
            req.Parameters.ForEach(x => _requestString += x.Name + " : " + x.Value + " ");
            var data = client.Execute(req).Content;
            return data;
        }

        //get Avnet api result
        public dynamic AvnetApiGetResponse(string mfgPN, string avnetStoreId, string avnetWCToken, string avnetWCTrustedToken, string avnetPath, string avnetSubscriptionAPI)
        {
            // tlsv1.2 only protocol supported by avnet
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var client = new RestClient(ConstantHelper.AvnetBaseURI + "" + string.Format("{0}?STORE_ID={1}&searchTerm={2}&searchType=MFPARTNUMBER&infoLevel=COMPLETE", avnetPath, avnetStoreId, HttpUtility.UrlEncode(mfgPN)));
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader(ConstantHelper.AvnetSubscriptionKey, avnetSubscriptionAPI);
            request.AddHeader(ConstantHelper.AvnetAccept, ConstantHelper.AvnetHeaderAccept);
            var data = client.Execute(request).Content;
            // all protocol supported by other supplier api
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | SecurityProtocolType.Ssl3;
            return data;
        }


        //get TTI api result
        public dynamic TTIApiGetResponse(string mfgPN, string apiAccessToken, string apiHeader)
        {
            var client = new RestClient(string.Format(ConstantHelper.TTIPricingApi, mfgPN, apiAccessToken));
            var request = new RestRequest(Method.GET);
            request.AddHeader(ConstantHelper.CacheControl, ConstantHelper.NoCache);
            client.UserAgent = apiHeader;
            var response = client.Execute(request);
            return response;
        }

        public ExternalPartVerificationRequestLog savePartFromMongoDB(List<ComponentModel> componentModel, ExternalPartVerificationRequestLog objExtVerification)
        {
            List<ComponentModel> ComponentList = new List<ComponentModel>();
            bool isIssue = false;
            foreach (ComponentModel component in componentModel)
            {
                var objVerification = getBOMVerificationIssueList(component, objExtVerification.partNumber, objExtVerification);
                component.uomID = objVerification.ComponentModel.uomID;
                component.partStatusID = objVerification.ComponentModel.partStatusID;
                component.packagingID = objVerification.ComponentModel.packagingID;
                component.RoHSStatusID = objVerification.ComponentModel.RoHSStatusID;
                component.mountingTypeID = objVerification.ComponentModel.mountingTypeID;
                component.costCategoryID = objVerification.ComponentModel.costCategoryID;
                component.functionalCategoryID = objVerification.ComponentModel.functionalCategoryID;
                component.connectorTypeID = objVerification.ComponentModel.connectorTypeID;
                component.PIDCode = objVerification.ComponentModel.PIDCode;
                component.mfgcodeID = objVerification.ComponentModel.mfgcodeID;
                if (objVerification.bomStatusList.Count() > 0)
                {
                    isIssue = true;
                    int result = _IDigikeyPricingRepository.saveBOMIssues(objVerification.bomStatusList);
                }
                else if (objExtVerification.isAlreadySaved)
                {
                    // Bug 42508: [Main branch] : Deadlock error found when trying to get lock
                    // int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(component);
                }

            }
            objExtVerification.isAlreadySaved = objExtVerification.isAlreadyFound ? objExtVerification.isAlreadySaved : isIssue ? false : true;
            objExtVerification.isAlreadyFound = true;
            if (objExtVerification.cleanType == CleanType.Part.ToString())
            {
                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(objExtVerification.transactionID, isIssue ? 1 : 2, objExtVerification.supplier, null, objExtVerification.partNumber, objExtVerification.type);

                objExtVerification.externalIssue = isIssue;
                if (objExtVerification.supplier == UpdateComponentSupplier.TTI.GetEnumStringValue())
                {
                    ApiCallforExternalPartUpdate(objExtVerification);
                }
                //web-socket call for part master update
            }
            else
            {
                var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(objExtVerification.partNumber.ToUpper(), isIssue ? 1 : 2, objExtVerification.supplier, objExtVerification.type, objExtVerification.partID.Value, null);
                if (remainApi.apiStatus)
                {
                    objExtVerification.externalIssue = remainApi.extStatusApi;
                    objExtVerification.status = remainApi.bomStatus;
                    if (objExtVerification.supplier == UpdateComponentSupplier.TTI.GetEnumStringValue())
                    {
                        ApiCallforExternalPartBOMUpdate(objExtVerification);
                    }
                    //call for web socket
                }
                if (objExtVerification.supplier == UpdateComponentSupplier.TTI.GetEnumStringValue())
                {
                    ApiCallforBomProgressStatus(objExtVerification); // added for bom progress status
                }
            }
            return objExtVerification;
        }

        /// <summary>
        /// Remove Non Numeric characters from Operation temperature
        /// </summary>
        /// <param name="strOperatingTemperature"></param>
        /// <param name="isFahrenheit"></param>
        /// <returns>double?</returns>
        public double? OperatingTemparatureRemoveNonNumericCharacters(string strOperatingTemperature, bool isFahrenheit)
        {
            try
            {
                //bool isFahrenheit = false;
                if (strOperatingTemperature != null && strOperatingTemperature.Trim() != "")
                {
                    var valuesToRemove = ConstantHelper.OperatingTemperatureNonNumericValues;
                    strOperatingTemperature = strOperatingTemperature.ToUpper();
                    //isFahrenheit = strOperatingTemperature.Contains(ConstantHelper.TemperatureFahrenheitSign);
                    foreach (string nonNumericValue in ConstantHelper.OperatingTemperatureNonNumericValues)
                    {
                        strOperatingTemperature = strOperatingTemperature.Replace(nonNumericValue, "");
                    }
                    strOperatingTemperature = strOperatingTemperature.Trim();
                    if (strOperatingTemperature != "" && strOperatingTemperature.Split(' ').Length > 0)
                    {
                        double temperature;
                        if (double.TryParse(strOperatingTemperature.Split(' ')[0], out temperature))
                        {
                            if (isFahrenheit == true)
                            {
                                double? temperatureCelsius = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.convertTemperatureFromFahrenheitToCelsius(temperature);
                                return temperatureCelsius;
                            }
                            else
                            {
                                return temperature;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return null;
        }


        public void sendEmailforPartAttribute()
        {
            List<SchedulePartAttributeUpdate> lstAttribute = _IDigikeyPricingRepository.getPartAttribute();
            if (lstAttribute.Count > 0)
            {

                var csv = new StringBuilder();
                csv.AppendLine("PID Code" + "," + "Attribute Name" + "," + "Old Value" + "," + "New Value" + "," + "Modified Date" + "," + "Modified By");
                string Auto = ConstantHelper.Auto;
                foreach (var item in lstAttribute)
                {

                    csv.AppendLine("\"" + item.pidCode + "\",\"" + item.attributeName + "\",\"" + item.oldValue + "\",\"" + item.newValue + "\",\"" + item.updatedOn.ToString("MM/dd/yyyy hh:mm tt") + "\",\"" + Auto + "\"");
                }
                csv.AppendLine();
                byte[] bytes = Encoding.UTF8.GetBytes(csv.ToString());
                string emailID = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getCustomerEmail();
                List<AttachmentDetailModel> attachmentlist = new List<AttachmentDetailModel>();


                var attachmentcsv = new AttachmentDetailModel();
                attachmentcsv.AttachmentName = string.Format("Parts Updated On {0}.csv", DateTime.UtcNow.ToString("MM-dd-yyyy"));
                attachmentcsv.BackupAttachment = bytes;
                attachmentlist.Add(attachmentcsv);

                EmailModel message = new EmailModel()
                {
                    To = emailID,
                    attachmentDetail = attachmentlist,
                    Body = "Find details in attachments",
                    Subject = "Parts attribute update details"
                };
                _IBOSendPartUpdateEmail.commonSendEmailDetail(message);

                // Dev Team will receive Email in case Part Attribute Update
                if (!string.IsNullOrEmpty(UpdatePartAttributeMailConfiguration))
                {
                    EmailModel emailModel = new EmailModel()
                    {
                        To = UpdatePartAttributeMailConfiguration,
                        attachmentDetail = attachmentlist,
                        Body = "Find details in attachments",
                        Subject = "Initiate from Pricing Service: Parts attribute update details"
                    };
                    _IBOSendPartUpdateEmail.commonSendEmailDetail(emailModel);
                }

                //// Remove Old Part Attribute Data Older than One Month
                _IDigikeyPricingRepository.removeOldPartAttribute();
            }
        }


        //get mouser json api result
        public dynamic MouserApiGetResponse(string apikey, string partNumber)
        {
            partNumber = System.Web.HttpUtility.UrlEncode(partNumber);
            string mouserpartUrlEndpoint = string.Format(ConstantHelper.MouserEndPoint, apikey);
            var client = new RestClient(mouserpartUrlEndpoint);
            client.Timeout = -1;
            var req = new RestRequest(Method.POST);
            req.AddHeader(ConstantHelper.Content, ConstantHelper.ApplicationJson);
            req.AddParameter(ConstantHelper.ApplicationJson, "{\r\n  \"SearchByPartRequest\": {\r\n  \"mouserPartNumber\": \"" + partNumber + "\"\r\n  }\r\n}", ParameterType.RequestBody);
            var data = client.Execute(req).Content;
            return data;
        }

        //get mouser json api result
        public dynamic HeilindApiGetResponse(string partnerKey, string AccessToken, string partNumber)
        {
            string heilindpartUrlEndpoint = string.Format(ConstantHelper.heilindEndPoint, partnerKey, partNumber);
            var client = new RestClient(heilindpartUrlEndpoint);
            client.Timeout = -1;
            var req = new RestRequest(Method.GET);
            req.AddHeader(ConstantHelper.heilindAuth, string.Format("Basic {0}", AccessToken)); var data = client.Execute(req).Content;
            return data;
        }

        public int callToNextExternalAPI(ExternalPartVerificationRequestLog objExtVerification, List<ComponentModel> componentList, bool isUpdate, bool isInsert, string QueueName, string nextSupplierName)
        {
            ExternalPartVerificationRequestLog newObjExtVerification = new ExternalPartVerificationRequestLog()
            {
                id = objExtVerification.id,
                lineID = objExtVerification.lineID,
                partID = objExtVerification.partID,
                partNumber = objExtVerification.partNumber,
                partStatus = objExtVerification.partStatus,
                supplier = objExtVerification.supplier,
                type = objExtVerification.type,
                status = objExtVerification.status,
                errorMsg = objExtVerification.errorMsg,
                externalIssue = objExtVerification.externalIssue,
                modifiedDate = objExtVerification.modifiedDate,
                description = objExtVerification.description,
                mfgName = objExtVerification.mfgName,
                cleanType = objExtVerification.cleanType,
                transactionID = objExtVerification.transactionID,
                isPartUpdate = objExtVerification.isPartUpdate,
                isAlreadyFound = objExtVerification.isAlreadyFound,
                userID = objExtVerification.userID,
                employeeID = objExtVerification.employeeID
            };
            if (isUpdate)
            {
                if (newObjExtVerification.cleanType != CleanType.Part.ToString())
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateBOMPart(newObjExtVerification.partID, newObjExtVerification.supplier, newObjExtVerification.type, newObjExtVerification.partNumber);
                }
                else
                {
                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(newObjExtVerification.transactionID, 1, newObjExtVerification.supplier, null, newObjExtVerification.partNumber, newObjExtVerification.type);
                }
            }
            if (isInsert)
            {
                _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(newObjExtVerification.partID, nextSupplierName, newObjExtVerification.type, newObjExtVerification.partNumber, newObjExtVerification.transactionID);
            }
            newObjExtVerification.supplier = nextSupplierName;
            CommonModel model = new CommonModel()
            {
                ExternalPartVerificationRequestLog = newObjExtVerification,
                componentList = componentList
            };
            _IRabbitMQSendMessageRequestHandler.SendRequest(model, QueueName);
            return 1;
        }
        public ManufacturerViewModel setNextSupplierDetail(ManufacturerViewModel supplierDetail, string cleanType)
        {
            switch (supplierDetail.id)
            {
                case (int)PricingSupplierID.DigiKey:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue();
                    break;
                case (int)PricingSupplierID.Mouser:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.Mouser.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? MouserScheduleQueueName : MouserQueueName;
                    break;
                case (int)PricingSupplierID.Avnet:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.Avnet.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? AvnetScheduleQueueName : AvnetQueueName;
                    break;
                case (int)PricingSupplierID.Newark:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.Newark.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? NewarkScheduleQueueName : NewarkQueueName;
                    break;
                case (int)PricingSupplierID.Arrow:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.Arrow.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? ArrowScheduleQueueName : ArrowQueueName;
                    break;
                case (int)PricingSupplierID.TTI:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.TTI.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? TTIScheduleQueueName : TTIQueueName;
                    break;
                case (int)PricingSupplierID.Heilind:
                    supplierDetail.supplierName = Helper.Helper.UpdateComponentSupplier.HEILIND.GetEnumStringValue();
                    supplierDetail.supplierQueueName = cleanType == CleanType.Part.ToString() ? HeilindScheduleQueueName : HeilindQueueName;
                    break;
            }
            return supplierDetail;
        }

        public void savedeclainedStatus(List<ComponentModel> componentList, string supplierName)
        {
            foreach (var ComponentModel in componentList)
            {
                if (!string.IsNullOrEmpty(supplierName))
                {
                    ComponentModel.supplierName = supplierName;
                    var supplierObj = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(ComponentModel.supplierName, "DIST");
                    ComponentModel.SupplierID = supplierObj.id;
                }
                if (!string.IsNullOrEmpty(ComponentModel.PIDCode))
                {
                    int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(ComponentModel);
                    PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = ComponentModel.mfgPN };
                    savePriceBreak(ComponentModel.PricesByReqQty, objPricingModel, ComponentModel.savePriceSupplier, ComponentModel.packaging, ComponentModel.distPN, false, ComponentModel.leadTime, ComponentModel.packagingID);
                }
            }
        }

        public void SaveIssueForAPIs(List<ComponentModel> listComponent, bool isIssue, ExternalPartVerificationRequestLog lineItem, List<ManufacturerViewModel> mfgList)
        {
            if (lineItem.type != ConstantHelper.FJTSchedulePartUpdate || !string.IsNullOrEmpty(lineItem.transactionID))
            {//check part already added or not
                int isAdded = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getPartNumber(lineItem.partNumber);
                if (isAdded > 0 || lineItem.isAlreadyFound)
                {
                    isIssue = false;
                }
                else
                {
                    List<bomStatus> bomStatusList = new List<bomStatus>();
                    if (listComponent.Count() == 0)
                    {
                        var objSupplier = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(lineItem.supplier, "DIST");
                        isIssue = true;
                        string suppliers = string.Empty;
                        foreach (ManufacturerViewModel item in mfgList)
                        {
                            suppliers = string.Format("{0}, {1}", suppliers, item.mfgCode);
                        }
                        suppliers = suppliers.Trim(new char[] { ' ', ',' });
                        string stringErrorMsg = string.Format(ConstantHelper.INVALIDPART_NEW, lineItem.partNumber, string.Format("({0})", suppliers));
                        bomStatus objbomStatus = new bomStatus()
                        {
                            partID = lineItem.partID,
                            lineID = lineItem.lineID,
                            errorType = ErrorType.PARTINVALID.ToString(),
                            errorMsg = stringErrorMsg,
                            Source = ConstantHelper.AllAPI,
                            partNumber = lineItem.partNumber,
                            DataField = lineItem.partNumber,
                            description = lineItem.description,
                            bomMFG = lineItem.mfgName,
                            SourceSupplierName = ConstantHelper.AllAPI,
                            transactionID = lineItem.transactionID,
                            supplierAPI = suppliers
                        };
                        bomStatusList.Add(objbomStatus);
                        int result = _IDigikeyPricingRepository.saveBOMIssues(bomStatusList);
                    }
                }
                if (lineItem.cleanType == CleanType.Part.ToString())
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalPartClean(lineItem.transactionID, isIssue ? 1 : 2, lineItem.supplier, lineItem.errorMsg, lineItem.partNumber.ToUpper(), lineItem.type);
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = lineItem.isPartUpdate ? false : remainApi.bomStatus;
                        var PendingErrorCount = _IDigikeyPricingRepository.CheckPendingErrorCount(lineItem.transactionID, lineItem.partID);
                        if (PendingErrorCount == 0)
                        {
                            _IDigikeyPricingRepository.RemovePartUpdatedPIDCode(lineItem.transactionID, lineItem.partID);
                        }

                        ApiCallforExternalPartUpdate(lineItem);
                    }
                    //lineItem.externalIssue = isIssue;
                    ApiCallforPartMasterProgressStatus(lineItem);
                }
                else
                {
                    var remainApi = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.updateExternalBomClean(lineItem.partNumber.ToUpper(), isIssue ? 1 : 2, lineItem.supplier, lineItem.type, lineItem.partID.Value, lineItem.errorMsg);
                    var PendingErrorCount = _IDigikeyPricingRepository.CheckPendingErrorCount(lineItem.transactionID, lineItem.partID);
                    if (PendingErrorCount == 0)
                    {
                        _IDigikeyPricingRepository.RemovePartUpdatedPIDCode(lineItem.transactionID, lineItem.partID);
                    }
                    if (remainApi.apiStatus)
                    {
                        lineItem.externalIssue = remainApi.extStatusApi;
                        lineItem.status = remainApi.bomStatus;
                        ApiCallforExternalPartBOMUpdate(lineItem);
                        //call for web socket
                    }
                    ApiCallforBomProgressStatus(lineItem); // added for bom progress status
                }
            }
        }

        // Sync Pending Elastic Data which add/update from Trigger
        public async Task SyncPendingElasticData()
        {
            try
            {
                HttpClient client = CreateGetHttpClient();
                await Task.Run(async () =>
                 {
                     var responseTask = await client.GetAsync(ConstantHelper.PendingDataInElastic);
                     if (responseTask.IsSuccessStatusCode)
                     {
                         string response = responseTask.Content.ReadAsStringAsync().Result;
                     }
                 });
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.ElasticSearch,
                    timeStamp = DateTime.UtcNow
                };
                _IRabbitMQ.SendRequest(objErrorLog);
            };
        }

        // common method to get API call
        public List<ManufacturerViewModel> checkNextSupplierDetail(ExternalPartVerificationRequestLog Item, int supplierID)
        {
            List<ComponentModel> compList = new List<ComponentModel>();
            List<ManufacturerViewModel> mfgList = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetAvailableSupplierList();
            var newMfgList = mfgList.FindAll(a => a.id != supplierID);
            foreach (ManufacturerViewModel supplierObject in newMfgList)
            {
                if (supplierObject != null && supplierObject.id != 0)
                {
                    ManufacturerViewModel suppObject = setNextSupplierDetail(supplierObject, Item.cleanType);
                    var isexist = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.getAlreadyExistsPartDetail(suppObject.supplierName, Item.partNumber, Item.transactionID);
                    if (!string.IsNullOrEmpty(suppObject.supplierQueueName) && !string.IsNullOrEmpty(suppObject.supplierName) && isexist == 0)
                    {
                        ExternalSupplierStatus objExternalSupplierStatus = new ExternalSupplierStatus()
                        {
                            supplier = suppObject.supplierName,
                            type = Item.type,
                            transactionID = Item.transactionID,
                            partID = Item.partID,
                            status = false,
                            cleanType = Item.cleanType,
                            partNumber = Item.partNumber
                        };
                        _IDigikeyPricingRepository.saveExternalAPIStatus(objExternalSupplierStatus);
                        _Irfq_consolidated_mfgpn_lineitem_alternateRepository.insertBOMPart(Item.partID, suppObject.supplierName, Item.type, Item.partNumber, Item.transactionID);
                        callToNextExternalAPI(Item, compList, false, false, suppObject.supplierQueueName, suppObject.supplierName);
                    }
                }
            }
            var newMfg = mfgList.Find(a => a.id == supplierID);
            if (newMfg != null)
            {
                ManufacturerViewModel suppObject = setNextSupplierDetail(newMfg, Item.cleanType);
                ExternalSupplierStatus objExternalSupplierStatus = new ExternalSupplierStatus()
                {
                    supplier = suppObject.supplierName,
                    type = Item.type,
                    transactionID = Item.transactionID,
                    partID = Item.partID,
                    status = false,
                    cleanType = Item.cleanType,
                    partNumber = Item.partNumber
                };
                _IDigikeyPricingRepository.saveExternalAPIStatus(objExternalSupplierStatus);
            }
            return mfgList;
        }


        public int callToNextApi(ExternalPartVerificationRequestLog objExtVerification, List<ManufacturerViewModel> mfgList)
        {
            ExternalSupplierStatus objExternalSupplierStatus = new ExternalSupplierStatus()
            {
                type = objExtVerification.type,
                partNumber = objExtVerification.partNumber,
                cleanType = objExtVerification.cleanType,
                supplier = objExtVerification.supplier,
                status = true,
                transactionID = objExtVerification.transactionID,
                partID = objExtVerification.partID
            };
            List<ExternalSupplierStatus> lstExternalSupplierStatus = _IDigikeyPricingRepository.updateExternalAPIStatus(objExternalSupplierStatus);
            bomStatus objbomStatus = _IDigikeyPricingRepository.getBOMIssues(objExtVerification.partNumber, objExtVerification.transactionID, objExtVerification.partID);
            List<ComponentModel> lstComponentModel = _IDigikeyPricingRepository.getAllComponentList(objExtVerification.partNumber);
            if (lstExternalSupplierStatus.Count() == 0 && objbomStatus == null)
            {
                if (lstComponentModel.Count() > 0)
                {
                    foreach (var item in mfgList)
                    {
                        var lstComponent = lstComponentModel.FindAll(x => x.supplierName == item.mfgCode).ToList();

                        foreach (var component in lstComponent)
                        {
                            int detailResponse = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.SaveComponentDetails(component);
                            if (detailResponse > 0)
                            {
                                PricingViewModel objPricingModel = new PricingViewModel() { mfgPNID = detailResponse, mfgPN = component.mfgPN };
                                savePriceBreak(component.PricesByReqQty, objPricingModel, PricingAPINames.Arrow.GetEnumStringValue(), component.packaging, component.distPN, false, component.leadTime, component.packagingID);
                            }
                            if (objExtVerification.partID == ConstantHelper.DefaultImportPart && !string.IsNullOrEmpty(objExtVerification.transactionID))
                            {
                                List<MpnMappDet> mpnMappDetList = _IDigikeyPricingRepository.GetMpnMappDet(objExtVerification.partNumber);
                                var componentDet = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDetail(objExtVerification.partNumber);
                                UpdateMpnMappedDet(mpnMappDetList, componentDet);
                            }
                            _IDigikeyPricingRepository.RemoveComponent(component); // remove component from mongodb
                        }
                        /// savedeclainedStatus(lstComponent, null);
                    }
                    SaveIssueForAPIs(lstComponentModel, false, objExtVerification, mfgList);
                }
                else
                {
                    SaveIssueForAPIs(lstComponentModel, false, objExtVerification, mfgList);
                }
            }
            else if (lstExternalSupplierStatus.Count() == 0 && objbomStatus != null)
            {
                SaveIssueForAPIs(lstComponentModel, true, objExtVerification, mfgList);
            }
            else
            {
                if (objExtVerification.cleanType == CleanType.Part.ToString())
                {
                    ApiCallforExternalPartUpdate(objExtVerification);
                }
            }
            return 1;
        }
        public void UpdateMpnMappedDet(List<MpnMappDet> listComponent, ComponentViewModel componetDet)
        {
            foreach (var item in listComponent)
            {
                item.mfrName = componetDet.mfrName;
                item.mfgcodeId = componetDet.mfgcodeID;
                item.componentId = componetDet.id;
                item.mfgPN = componetDet.mfgPN;
                item.supplierName = componetDet.supplierName;
                item.supplierId = componetDet.supplierID;
                item.spn = componetDet.spn;
                item.refSupplierMfgpnComponentID = componetDet.refSupplierMfgpnComponentID;
                item.mfgType = componetDet.mfgType;
                item.createdBy = componetDet.employeeName;
                item.createdAt = componetDet.createdAt;
                item.isVerified = true;
                _IDigikeyPricingRepository.updateMPNMappDet(item);
            }
        }
    }
}
