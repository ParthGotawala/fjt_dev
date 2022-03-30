using System;
using System.Collections.Generic;
using System.Linq;
using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Enums;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using FJT.IdentityServer.Repository;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Authentication;
using FJT.IdentityServer.Appsettings;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using static FJT.IdentityServer.Helper.Constant;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("[controller]/api/[action]")]
    public class AgreementController : Controller
    {
        private readonly IFJTIdentityDbContext _iFJTIdentityDbContext;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly IDbRepository _iDbRepository;
        private readonly PageURLs _pageURLs;
        private readonly ILogger<AgreementController> _logger;
        private readonly IDynamicMessageService _dynamicMessageService;
        private readonly ITextAngularValueForDB _textAngularValueForDB;

        public AgreementController(
            IDbRepository iDbRepository,
            IFJTIdentityDbContext iFJTIdentityDbContext,
            IHttpsResponseRepository iHttpsResponseRepository,
            IOptions<PageURLs> pageURLs,
            ILogger<AgreementController> logger,
            IDynamicMessageService dynamicMessageService,
             ITextAngularValueForDB textAngularValueForDB)
        {
            _iDbRepository = iDbRepository;
            _iFJTIdentityDbContext = iFJTIdentityDbContext;
            _iHttpsResponseRepository = iHttpsResponseRepository;
            _pageURLs = pageURLs.Value;
            _logger = logger;
            _dynamicMessageService = dynamicMessageService;
            _textAngularValueForDB = textAngularValueForDB;
        }

        /// <summary>
        /// Get agreement List on ui page - agreement/agreement
        /// </summary>
        /// <param name="requestSprocParameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetAgreementList([FromBody] RequestSprocParameterVM requestSprocParameterVM)
        {

            if (requestSprocParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                int page = requestSprocParameterVM.Page == 0 ? 1 : requestSprocParameterVM.Page;
                int limit = requestSprocParameterVM.pageSize == 0 ? 50 : requestSprocParameterVM.pageSize;
                string orderBy = string.Empty;
                string whereClause = " 1=1 ";
                List<AgreementListVM> agreementLists = new List<AgreementListVM>();

                if (requestSprocParameterVM.SortColumns.Count > 0)
                {
                    orderBy += OrderBy.GenerateOrderBy(requestSprocParameterVM.SortColumns);
                }
                if (requestSprocParameterVM.SearchColumns.Count > 0)
                {
                    whereClause += WhereClause.GenerateWhereClause(requestSprocParameterVM.SearchColumns);
                }

                MySqlParameter[] parameters = new MySqlParameter[] {
                    new MySqlParameter("@pPageIndex", page),
                    new MySqlParameter("@pRecordPerPage", limit),
                    new MySqlParameter("@pOrderBy", orderBy),
                    new MySqlParameter("@pWhereClause",whereClause),
                    new MySqlParameter("@pTemplateType", requestSprocParameterVM.templateType),
                    new MySqlParameter("@pUserID", requestSprocParameterVM.userID)
                };
                AgreementListDetails agreementListDetails = await _iDbRepository.AgreementListAsync("Sproc_RetrieveAgreementList", parameters);

                var agreementListData = new AgreementListData()
                {
                    TemplateList = agreementListDetails.agreementListVMs.ToList(),
                    Count = agreementListDetails.SpCountVM.Select(x => x.TotalRecord).FirstOrDefault()
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, agreementListData, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// get agreementtype details by agreement typeId.
        /// </summary>
        /// <param name="agreementTypeID"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAgreementDetails(int agreementTypeID)
        {
            if (agreementTypeID == 0)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                MySqlParameter parameter = new MySqlParameter("@agreementTypeID", agreementTypeID);
                GetAgreementDetailDetails getAgreementDetailDetails = await _iDbRepository.GetAgreementDetailsListAsync("Sproc_GetAgreementDetails", parameter);

                GetAgreementDetailData getAgreementDetailsData = new GetAgreementDetailData()
                {
                    data = getAgreementDetailDetails.GetAgreementDetails.ToList()
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, getAgreementDetailsData, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// get agreement details list by agreementTypeId
        /// </summary>
        /// <param name="agreementTypeID"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> RetriveAgreementByTypeId(int agreementTypeID)
        {
            if (agreementTypeID == 0)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                var agreementList = await _iFJTIdentityDbContext.Agreement.Where(x => x.agreementTypeID == agreementTypeID).ToListAsync();
                if (agreementList == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                }

                foreach (var agreement in agreementList)
                {
                    if (!string.IsNullOrEmpty(agreement.agreementContent))
                    {
                        agreement.agreementContent = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementContent);
                        if (agreement.agreementContent == null)
                        {
                            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                        }
                    }

                    if (!string.IsNullOrEmpty(agreement.agreementSubject))
                    {
                        agreement.agreementSubject = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementSubject);
                        if (agreement.agreementSubject == null)
                        {
                            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                        }
                    }
                }

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, agreementList, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Get UserSignUp agreement List for login user in ui page - profile/agreement
        /// </summary>
        /// <param name="requestSprocParameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> RetriveUserSignUpAgreementList([FromBody] RequestSprocParameterVM requestSprocParameterVM)
        {
            if (requestSprocParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                int page = requestSprocParameterVM.Page == 0 ? 1 : requestSprocParameterVM.Page;
                int limit = requestSprocParameterVM.pageSize == 0 ? 50 : requestSprocParameterVM.pageSize;
                string orderBy = string.Empty;
                string whereClause = " 1=1 ";
                List<UserSignUpAgreementList> agreementLists = new List<UserSignUpAgreementList>();

                if (requestSprocParameterVM.SortColumns.Count > 0)
                {
                    orderBy += OrderBy.GenerateOrderBy(requestSprocParameterVM.SortColumns);
                }
                if (requestSprocParameterVM.SearchColumns.Count > 0)
                {
                    whereClause += WhereClause.GenerateWhereClause(requestSprocParameterVM.SearchColumns);
                }

                MySqlParameter[] parameters = new MySqlParameter[] {
                    new MySqlParameter("@pPageIndex", page),
                    new MySqlParameter("@pRecordPerPage", limit),
                    new MySqlParameter("@pOrderBy", orderBy),
                    new MySqlParameter("@pWhereClause",whereClause),
                    new MySqlParameter("@pUserID", requestSprocParameterVM.userID)
                };
                UserSignUpAgreementListDetails userSignUpAgreementListDetails = await _iDbRepository.UserSignUpAgreementListAsync("Sproc_RetrieveUserSignUpAgreementList", parameters);

                UserSignUpAgreementListData userSignUpAgreementListData = new UserSignUpAgreementListData
                {
                    AgreementUserList = userSignUpAgreementListDetails.UserSignUpAgreementLists.ToList(),
                    Count = userSignUpAgreementListDetails.SpCountVM.Select(x => x.TotalRecord).FirstOrDefault()
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, userSignUpAgreementListData, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// publish agreement.
        /// </summary>
        /// <param name="requestParameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> PublishAgreementTemplate([FromBody] RequestParameterVM requestParameterVM)
        {
            if (requestParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                int agreementTypeID = requestParameterVM.agreementTypeID;
                int? maxVersion = await _iFJTIdentityDbContext.Agreement.Where(x => x.agreementTypeID == agreementTypeID).MaxAsync(x => x.version);
                Agreement agreement = await _iFJTIdentityDbContext.Agreement.FirstOrDefaultAsync(x => x.agreementTypeID == agreementTypeID && x.isPublished == false);
                if (agreement == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                }
                agreement.version = maxVersion != null ? maxVersion : 0;
                agreement.isPublished = true;
                agreement.publishedDate = DateTime.UtcNow;
                agreement.updatedBy = requestParameterVM.userName;
                agreement.updateByRole = requestParameterVM.userRoleName;
                agreement.updatedAt = DateTime.UtcNow;
                await _iFJTIdentityDbContext.CustomSaveChanges();

                var agreementPublishMSG = await _dynamicMessageService.Get("AGREEMENT_PUBLISH_SUCCESS");
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = agreementPublishMSG.message });
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// get all previous ArchieveVersionDetails
        /// </summary>
        /// <param name="requestSprocParameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> RetriveArchieveVersionDetails([FromBody] RequestSprocParameterVM requestSprocParameterVM)
        {
            if (requestSprocParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                int page = requestSprocParameterVM.Page == 0 ? 1 : requestSprocParameterVM.Page;
                int limit = requestSprocParameterVM.pageSize == 0 ? 50 : requestSprocParameterVM.pageSize;
                string orderBy = string.Empty;
                string whereClause = " 1=1 ";
                List<ArchieveVersionDetailsList> agreementLists = new List<ArchieveVersionDetailsList>();

                if (requestSprocParameterVM.SortColumns.Count > 0)
                {
                    orderBy += OrderBy.GenerateOrderBy(requestSprocParameterVM.SortColumns);
                }
                if (requestSprocParameterVM.SearchColumns.Count > 0)
                {
                    whereClause += WhereClause.GenerateWhereClause(requestSprocParameterVM.SearchColumns);
                }

                MySqlParameter[] parameters = new MySqlParameter[] {
                    new MySqlParameter("@pPageIndex", page),
                    new MySqlParameter("@pRecordPerPage", limit),
                    new MySqlParameter("@pOrderBy", orderBy),
                    new MySqlParameter("@pWhereClause",whereClause),
                    new MySqlParameter("@pagreementTypeID",requestSprocParameterVM.agreementID),
                    new MySqlParameter("@pUserID", requestSprocParameterVM.userID)
                };
                ArchieveVersionDetailsListDetails archieveVersionDetailsListDetails = await _iDbRepository.ArchieveVersionDetailsListAsync("Sproc_RetrieveArchieveVesrionDetails", parameters);

                var archieveVersionDetailsListData = new ArchieveVersionDetailsListData
                {
                    ArchieveList = archieveVersionDetailsListDetails.ArchieveVersionDetailsLists.ToList(),
                    Count = archieveVersionDetailsListDetails.SpCountVM.Select(x => x.TotalRecord).FirstOrDefault()
                };
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, archieveVersionDetailsListData, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// check if agreement name already exists.
        /// </summary>
        /// <param name="requestParameterVM"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CheckDuplicateAgreementType([FromBody] RequestParameterVM requestParameterVM)
        {
            if (requestParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                bool isDuplicate = false;
                int? agreementTypeID = await _iFJTIdentityDbContext.AgreementType.Where(x => x.agreementTypeID == requestParameterVM.agreementTypeID && x.displayName == requestParameterVM.displayName && x.templateType == requestParameterVM.templateType && x.isDeleted == false).Select(x => x.agreementTypeID).FirstOrDefaultAsync();
                if (!(agreementTypeID == null || agreementTypeID == 0))
                {
                    isDuplicate = true;
                }
                CommonResponse commonResponse = new CommonResponse
                {
                    isDuplicate = isDuplicate
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, commonResponse, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// save agreement name.
        /// </summary>
        /// <param name="requestParameterVM"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> SaveAgreementType([FromBody] RequestParameterVM requestParameterVM)
        {
            if (requestParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                var agreementType = await _iFJTIdentityDbContext.AgreementType.Where(x => x.agreementTypeID == requestParameterVM.agreementTypeID).FirstOrDefaultAsync();
                if (agreementType == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                }
                agreementType.displayName = requestParameterVM.displayName;
                agreementType.updatedBy = requestParameterVM.userName;
                agreementType.updateByRole = requestParameterVM.userRoleName;
                agreementType.updatedAt = DateTime.UtcNow;
                await _iFJTIdentityDbContext.CustomSaveChanges();

                CommonResponse commonResponse = new CommonResponse
                {
                    agreementTypeID = requestParameterVM.agreementTypeID
                };

                var savedMSG = await _dynamicMessageService.Get(SAVED);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, commonResponse, new UserMessage() { message = string.Format(savedMSG.message, AGREEMENT_ENTITY) });
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// get agreed users details list.
        /// </summary>
        /// <param name="requestSprocParameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetAgreedUserList([FromBody] RequestSprocParameterVM requestSprocParameterVM)
        {
            if (requestSprocParameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                int page = requestSprocParameterVM.Page == 0 ? 1 : requestSprocParameterVM.Page;
                int limit = requestSprocParameterVM.pageSize == 0 ? 50 : requestSprocParameterVM.pageSize;
                string orderBy = string.Empty;
                string whereClause = " 1=1 ";
                List<GetAgreedUserListVM> agreementLists = new List<GetAgreedUserListVM>();

                if (requestSprocParameterVM.SortColumns.Count > 0)
                {
                    orderBy += OrderBy.GenerateOrderBy(requestSprocParameterVM.SortColumns);
                }
                if (requestSprocParameterVM.SearchColumns.Count > 0)
                {
                    whereClause += WhereClause.GenerateWhereClause(requestSprocParameterVM.SearchColumns);
                }

                MySqlParameter[] parameters = new MySqlParameter[] {
                    new MySqlParameter("@pPageIndex", page),
                    new MySqlParameter("@pRecordPerPage", limit),
                    new MySqlParameter("@pOrderBy", orderBy),
                    new MySqlParameter("@pWhereClause",whereClause),
                    new MySqlParameter("@pAgreementTypeID", requestSprocParameterVM.agreementTypeID),
                    new MySqlParameter("@pUserID", requestSprocParameterVM.userID)
                };
                GetAgreedUserListVMDetails getAgreedUserListVMDetails = await _iDbRepository.GetAgreedUserListAsync("Sproc_getAgreedUserList", parameters);

                var getAgreedUserListVMData = new GetAgreedUserListVMData()
                {
                    AgreedUserList = getAgreedUserListVMDetails.GetAgreedUserListVMs.ToList(),
                    Count = getAgreedUserListVMDetails.SpCountVM.Select(x => x.TotalRecord).FirstOrDefault()
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, getAgreedUserListVMData, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// save agreement, or save as new template agreement.
        /// </summary>
        /// <param name="agreementID"></param>
        /// <param name="agreementVM"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateUpdateAgreement(int agreementID, [FromBody] AgreementVM agreementVM)
        {
            if (agreementVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                if (!string.IsNullOrEmpty(agreementVM.agreementContent))
                {
                    agreementVM.agreementContent = _textAngularValueForDB.SetTextAngularValueForDB(agreementVM.agreementContent);
                    if (agreementVM.agreementContent == null)
                    {
                        var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                    }
                }

                if (!string.IsNullOrEmpty(agreementVM.agreementSubject))
                {
                    agreementVM.agreementSubject = _textAngularValueForDB.SetTextAngularValueForDB(agreementVM.agreementSubject);
                    if (agreementVM.agreementSubject == null)
                    {
                        var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                    }
                }

                if (agreementID != 0)
                {
                    /* Update Agreement */
                    var agreement = await _iFJTIdentityDbContext.Agreement.FirstOrDefaultAsync(x => x.agreementID == agreementID && x.isDeleted == false);
                    if (agreement == null)
                    {
                        var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                    }
                    agreement.agreementContent = agreementVM.agreementContent;
                    agreement.system_variables = agreementVM.system_variables;
                    agreement.agreementSubject = agreementVM.agreementSubject;
                    agreement.updatedAt = DateTime.UtcNow;
                    agreement.updatedBy = agreementVM.updatedBy;
                    agreement.updateByRole = agreementVM.updateByRole;
                    await _iFJTIdentityDbContext.CustomSaveChanges();

                    var updatedMSG = await _dynamicMessageService.Get(UPDATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = string.Format(updatedMSG.message, AGREEMENT_ENTITY) });
                }
                else
                {
                    /* Create Agreement */
                    var agreement = new Agreement()
                    {
                        agreementTypeID = agreementVM.agreementTypeID,
                        agreementContent = agreementVM.agreementContent,
                        system_variables = agreementVM.system_variables,
                        agreementSubject = agreementVM.agreementSubject,
                        isPublished = false,
                        isDeleted = false,
                        version = agreementVM.version,
                        createByRole = agreementVM.createByRole,
                        createdAt = DateTime.UtcNow,
                        createdBy = agreementVM.createdBy,
                        updateByRole = agreementVM.updateByRole,
                        updatedAt = DateTime.UtcNow,
                        updatedBy = agreementVM.updatedBy
                    };
                    _iFJTIdentityDbContext.Agreement.Add(agreement);
                    await _iFJTIdentityDbContext.CustomSaveChanges();

                    var createdMSG = await _dynamicMessageService.Get(CREATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = string.Format(createdMSG.message, AGREEMENT_ENTITY) });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// get agreement details for download agreement.
        /// </summary>
        /// <param name="parameterVM">filter parameter</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetAgreementTemplateDetails([FromBody] RequestDownloadAgreementParameterVM parameterVM)
        {
            if (parameterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                List<DownloadAgreementDetailsVM> downloadAgreementDetailsVMList = new List<DownloadAgreementDetailsVM>();
                MySqlParameter[] parameters = new MySqlParameter[] {
                    new MySqlParameter("@puserAgreementID", parameterVM.userAgreementID),
                    new MySqlParameter("@pagreementTypeID", parameterVM.agreementTypeID)
                };

                DownloadAgreementDetailsVMDetails downloadAgreementDetailsVMDetails = await _iDbRepository.DownloadAgreementDetailsAsync("Sproc_GetDownloadAgreementDetails", parameters);
                var agreementRecordList = downloadAgreementDetailsVMDetails.DownloadAgreementDetailsVMs.ToList();
                if (agreementRecordList == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                }
                var companyLogo = await _iFJTIdentityDbContext.Systemconfigrations.Where(x => x.key == COMPANY_LOGO_KEY).Select(x => x.values).FirstOrDefaultAsync();
                foreach (var agreement in agreementRecordList)
                {
                    if (!string.IsNullOrEmpty(agreement.agreementContent))
                    {
                        agreement.agreementContent = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementContent);
                        if (agreement.agreementContent == null)
                        {
                            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                        }
                    }

                    // if need then also replace Customer company Name, Assembelyname, etc..
                    agreement.agreementContent = agreement.agreementContent.Replace(SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG, COMPANY_NAME)
                                .Replace(SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG, companyLogo); // i don't have logo.
                }

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, agreementRecordList, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Get all Agreements Types with agreement Content.
        /// </summary>
        /// <param name="templateType"></param>
        /// <returns></returns>
        public async Task<IActionResult> GetAgreementTypes(string templateType)
        {
            try
            {
                List<AgreementType> agreementTypeList = new List<AgreementType>();

                if (templateType == null)
                {
                    agreementTypeList = await _iFJTIdentityDbContext.AgreementType.Where(x => x.isDeleted == false).Include(x => x.agreements).ToListAsync();
                }
                else
                {
                    agreementTypeList = await _iFJTIdentityDbContext.AgreementType.Where(x => x.templateType == templateType && x.isDeleted == false).Include(x => x.agreements).ToListAsync();
                }
                if (agreementTypeList == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) } });
                }

                foreach (var agreementType in agreementTypeList)
                {
                    if (agreementType.agreements.Count > 0)
                    {
                        foreach (var agreement in agreementType.agreements)
                        {
                            if (!string.IsNullOrEmpty(agreement.agreementContent))
                            {
                                agreement.agreementContent = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementContent);
                                if (agreement.agreementContent == null)
                                {
                                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                                }
                            }

                            if (!string.IsNullOrEmpty(agreement.agreementSubject))
                            {
                                agreement.agreementSubject = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementSubject);
                                if (agreement.agreementSubject == null)
                                {
                                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                                }
                            }
                        }
                    }
                }

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, agreementTypeList, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }
    }
}