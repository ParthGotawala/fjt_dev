using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FJT.ReportDesigner.AppSettings;
using FJT.ReportDesigner.Enums;
using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Models;
using FJT.ReportDesigner.MySqlDBModel;
using FJT.ReportDesigner.Repository;
using FJT.ReportDesigner.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stimulsoft.Report;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Mvc;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Controllers
{
    [CustomAuthorization]
    public class DesignerController : BaseController
    {
        private readonly ConnectionStrings _connectionStrings;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly ILogger<DesignerController> _logger;
        private readonly IUtilityController _utilityController;
        private readonly IDynamicMessageService _dynamicMessageService;

        static DesignerController()
        {
            /* Activate Stimulsoft Report */
            Stimulsoft.Base.StiLicense.LoadFromFile("license.key");
        }
        public DesignerController(FJTSqlDBContext fjtSqlDBContext, IHttpsResponseRepository iHttpsResponseRepository, IOptions<ConstantPath> constantPath, IOptions<ConnectionStrings> connectionStrings, ILogger<DesignerController> logger, IUtilityController utilityController, IDynamicMessageService dynamicMessageService) : base(fjtSqlDBContext, constantPath)
        {
            _constantPath = constantPath.Value;
            _iHttpsResponseRepository = iHttpsResponseRepository;
            _connectionStrings = connectionStrings.Value;
            _logger = logger;
            _utilityController = utilityController;
            _dynamicMessageService = dynamicMessageService;
        }

        /// <summary>
        /// Main Method(Entry Point For Designer). Index View Contain Stimulsoft report like DesignerEvent,GetReport,SaveREport etc..
        /// </summary>
        /// <param name="id">Report GUID</param>
        /// <returns></returns>
        [Authorize]
        public async Task<IActionResult> Index(string id)
        {
            if (id == null)
            {
                return View("Welcome");
            }
            try
            {
                var reportModel = new SaveReportModel();
                var reportData = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.fileName == id && x.isDeleted == false);
                if (reportData == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REPORT_DETAILS) });
                }
                string reportCretatedBy = GetUserId();
                if ((reportCretatedBy == null) || (reportCretatedBy != reportData.createdBy))
                {
                    return RedirectToAction("AccessDenied", "Authorize");
                }

                bool isDraft = reportData.status == ReportStatus.Draft.GetDisplayValue();
                /* AS we don't give permission to user design systemgenerated report. so always pass false in 'CheckStatusOfReportFile' method. */
                // bool isSystemGeneratedReport = reportData.reportGenerationType == ((int)ReportCategory.SystemGeneratedReport).ToString() ? true : false;
                var fileName = (isDraft && reportData.draftFileName != null) ? reportData.draftFileName : reportData.fileName;
                var responseModel = _utilityController.CheckStatusOfReportFile(fileName, reportData.isEndUserReport == true, reportData.reportGenerationType);

                if (responseModel.IsSuccess == false || (bool)responseModel.Model == false)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REPORT_ENTITY) });
                }
                /* Pass GUID, ReportName,... to DesignerView */
                reportModel.ReportGUID = id;
                reportModel.ReportName = reportData.reportName;
                reportModel.PublishVersion = reportData.reportVersion;
                reportModel.ReportStatus = reportData.status == ReportStatus.Draft.GetDisplayValue() ? ReportStatus.Draft.ToString() : ReportStatus.Published.ToString();
                ViewBag.UiPageURL = _constantPath.UiPageUrl;
                ViewBag.printReportDataInHeader = true;

                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                var discardDraftMSG = await _dynamicMessageService.Get(DISCARD_DRAFT_CHANGES);
                var stopActivityMSG = await _dynamicMessageService.Get(CONFIRM_STOP_ACTIVITY);
                ViewBag.somethingWrongMSG = somethingWrongMSG.message;
                ViewBag.discardDraftMSG = discardDraftMSG.message;
                ViewBag.stopActivityMSG = stopActivityMSG.message;
                ViewBag.urlParameter = id;
                return View(reportModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = e.Message });
            }
        }

        /// <summary>
        /// Get Report Based On Passed GUID(as Parameter). => get report data and load report on designer.
        /// </summary>
        /// <param name="id">REPORT GUID</param>
        /// <returns></returns>
        [Authorize]
        public async Task<IActionResult> GetReport(string id)
        {
            try
            {
                var reportData = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.fileName == id && x.isDeleted == false);
                var fileName = ((reportData.status == ReportStatus.Draft.GetDisplayValue()) && reportData.draftFileName != null) ? reportData.draftFileName : reportData.fileName;

                var responseModel = await _utilityController.GetReportByteData(fileName, reportData.isEndUserReport == true, reportData.reportGenerationType);
                ReportByteDataVM reportByteDataVM = (ReportByteDataVM)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModel.Model.ToString())).
                        ToObject(typeof(ReportByteDataVM));
                var reportByteData = reportByteDataVM.ReportByteData;

                /* Create the report object */
                var report = new StiReport();
                report.Load(reportByteData);
                var dictionary = report.Dictionary;

                report.ReportName = reportData.reportName;
                /* Pass Value to Constant Variable. */
                foreach (var variableName in Enum.GetNames(typeof(ConstantReportVariable)))
                {
                    if (report.IsVariableExist(variableName))
                    {
                        ConstantReportVariable reportVariable = (ConstantReportVariable)Enum.Parse(typeof(ConstantReportVariable), variableName);
                        dictionary.Variables[variableName].Value = reportVariable.GetDisplayValue();
                    }
                }

                /* get all database & change Connection String. */
                var dbList = report.Dictionary.Databases.ToList();
                for (int i = 0; i < dbList.Count; i++)
                {
                    ((StiSqlDatabase)dictionary.Databases[i]).ConnectionString = _connectionStrings.ReportConnection;
                }

                /* Set some default variable Value. */
                if (report.IsVariableExist(PARA_REPORT_TITLE))
                {
                    dictionary.Variables[PARA_REPORT_TITLE].Value = reportData.reportTitle;
                }
                if (report.IsVariableExist(PARA_REPORT_VERSION))
                {
                    dictionary.Variables[PARA_REPORT_VERSION].Value = reportData.reportVersion ?? "-";
                }
                if (report.IsVariableExist(Para_ImageFolderPathFor_ROHS))
                {
                    dictionary.Variables[Para_ImageFolderPathFor_ROHS].Value = string.Concat(_constantPath.APIURL, _constantPath.RoHSImagesPath);
                }

                return StiNetCoreDesigner.GetReportResult(this, report);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = e.Message });
            }
        }

        /// <summary>
        /// DesignerEvent - Stimulsoft Report.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public async Task<IActionResult> DesignerEvent()
        {
            return await StiNetCoreDesigner.DesignerEventResultAsync(this);
        }

        /// <summary>
        /// Preview Report.
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> PreviewReport()
        {
            StiReport report = StiNetCoreDesigner.GetActionReportObject(this);
            return await StiNetCoreDesigner.PreviewReportResultAsync(this, report);
        }

        /// <summary>
        /// Save Report Byte Data to Session.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public async Task<IActionResult> SaveReport()
        {
            /* Get Report object */
            var report = StiNetCoreDesigner.GetReportObject(this);
            /* Convert report to ArrayByte */
            var fileByte = report.SaveToByteArray();

            /* Store reportByteData in the session */
            HttpContext.Session.Set("SaveReportTemplate", fileByte);
            return await StiNetCoreDesigner.SaveReportResultAsync(this);
        }

        /// <summary>
        /// Discard All Changes made by user, keep only published report file.
        /// </summary>
        /// <param name="id">REPORT GUID</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ResponseModel> DiscardChanges(string id)
        {
            if (id == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };
            }
            try
            {
                var reportData = await _FJTSqlDBContext.reportmaster.Where(x => x.fileName == id && x.isDeleted == false).FirstOrDefaultAsync();
                if (reportData == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REPORT_DETAILS) };
                }

                reportData.status = ReportStatus.Published.GetDisplayValue();
                reportData.updatedBy = GetUserId();
                reportData.updatedAt = StaticMethods.GetUtcDateTime();
                reportData.updateByRoleId = null;

                /* Delete Draft FileName */
                System.IO.File.Delete(_constantPath.ReportPath + reportData.draftFileName + REPORT_EXTENSION);
                reportData.draftFileName = null;
                await _FJTSqlDBContext.SaveChangesAsync();

                var responseMSG = await _dynamicMessageService.Get(SUCCESSFULLY_DISCARD_CHANGES);
                return new ResponseModel() { IsSuccess = true, StatusCode = (int)APIStatusCode.SUCCESS, Message = responseMSG.message };
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message };
            }
        }

        /// <summary>
        /// Stop Report Editing & All Changes Made by user will not saved.Set End Activity Data & Time in 'report_change_logs' table. and after redirect to ui page.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ResponseModel> StopActivity(string id)
        {
            if (id == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };
            }
            try
            {
                var reportData = await _FJTSqlDBContext.reportmaster.Where(x => x.fileName == id && x.isDeleted == false).FirstOrDefaultAsync();
                if (reportData == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REPORT_DETAILS) };
                }
                reportData.editingBy = null;
                reportData.startDesigningDate = null;

                /* Set End Activity Data & Time in 'report_change_logs' table in database. */
                var reportChangeLog = await _FJTSqlDBContext.report_change_logs.FirstOrDefaultAsync(x => x.reportId == reportData.id && x.endActivityDate == null && x.isDeleted == false);
                if (reportChangeLog == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, START_ACTIVITY_DETAILS) };
                }
                reportChangeLog.endActivityDate = StaticMethods.GetUtcDateTime();
                reportChangeLog.updatedBy = GetUserId();
                reportChangeLog.updatedAt = StaticMethods.GetUtcDateTime();
                reportChangeLog.updateByRoleId = null;
                await _FJTSqlDBContext.SaveChangesAsync();

                var responseMSG = await _dynamicMessageService.Get(STOP_ACTIVITY_SUCCESS);
                return new ResponseModel() { IsSuccess = true, StatusCode = (int)APIStatusCode.SUCCESS, Message = responseMSG.message };
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message };
            }
        }

        /// <summary>
        /// Save Report based on 'Save as Draft' & 'Save And Publish'.
        /// </summary>
        /// <param name="saveModel">Contain report GUID,reportName, saveReportMode, reportVersion from designer.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ResponseModel> SaveReportBySaveMode([FromBody] SaveReportModel saveModel)
        {
            if (saveModel == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };
            }

            /* Get ReportByteData From Session. */
            HttpContext.Session.TryGetValue("SaveReportTemplate", out byte[] reportByteData);
            if (reportByteData == null)
            {
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message };
            }
            saveModel.ReportByteData = reportByteData;

            try
            {
                var reportMaster = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.fileName == saveModel.ReportGUID && x.isDeleted == false);
                var reportVersion = 1;
                if (reportMaster == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REPORT_DETAILS) };
                }
                reportMaster.updatedBy = GetUserId();
                reportMaster.updatedAt = StaticMethods.GetUtcDateTime();
                reportMaster.updateByRoleId = null;
                var reportFolderPath = _constantPath.ReportPath;

                /* Save Report Based on SaveReportMode - 'Save as Draft' or 'Save & Publish'. */
                if (saveModel.SaveReportMode == PUBLISH_MODE)
                {
                    reportMaster.status = ReportStatus.Published.GetDisplayValue();

                    if (!(saveModel.PublishVersion == null || saveModel.PublishVersion == ""))
                    {
                        reportVersion = Int32.Parse(saveModel.PublishVersion) + 1;
                    }
                    reportMaster.reportVersion = reportVersion.ToString();

                    /* save or override data in physical file with particular path */
                    System.IO.File.WriteAllBytes(reportFolderPath + saveModel.ReportGUID + REPORT_EXTENSION, saveModel.ReportByteData);

                    /* Delete Draft FileName if Exists. */
                    System.IO.File.Delete(reportFolderPath + reportMaster.draftFileName + REPORT_EXTENSION);
                    reportMaster.draftFileName = null;
                    await _FJTSqlDBContext.SaveChangesAsync();

                    var publishedMSG = await _dynamicMessageService.Get(SUCCESSFULLY_PUBLISHED);
                    return new ResponseModel() { IsSuccess = true, StatusCode = (int)APIStatusCode.SUCCESS, Message = publishedMSG.message };
                }
                else if (saveModel.SaveReportMode == DRAFT_MODE)
                {
                    reportMaster.status = ReportStatus.Draft.GetDisplayValue();
                    if (reportMaster.draftFileName == null)
                    {
                        reportMaster.draftFileName = System.Guid.NewGuid().ToString();
                    }
                    /* save or override data in physical file with particular path */
                    System.IO.File.WriteAllBytes(reportFolderPath + reportMaster.draftFileName + REPORT_EXTENSION, saveModel.ReportByteData);
                    await _FJTSqlDBContext.SaveChangesAsync();

                    var responseMSG = await _dynamicMessageService.Get(SUCCESSFULLY_SAVE_AS_DRAFT);
                    return new ResponseModel() { IsSuccess = true, StatusCode = (int)APIStatusCode.SUCCESS, Message = responseMSG.message };
                }
                else
                {
                    var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                    return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };

                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message };

            }
        }

        /// <summary>
        /// All Changes made by user will not saved. called Stop Activity And user will redirected to Ui page.
        /// </summary>
        /// <param name="id">Report GUID.</param>
        /// <returns></returns>
        public async Task<IActionResult> ExitDesigner(string id)
        {
            if (id == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message });
            }

            var responseModel = await StopActivity(id);
            if (responseModel.IsSuccess == false)
            {
                return View("Error", new ErrorViewModel { StatusCode = responseModel.StatusCode, Message = responseModel.Message });
            }
            else
            {
                return Redirect(_constantPath.UiPageUrl);
            }
        }

        /// <summary>
        /// Update Report or Create New Report(Create From template report or Clone From existing Reoprt based on user's Inputs(Requirements)).
        /// </summary>
        /// <param name="reportmasterVM">contain some required information from ui page, like id, reportname, templateId, ReportType, UserId, UserRoleId, ReportCreateType, entityid, etc.. </param>
        /// <returns></returns>
        [Route("api/Designer/[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] ReportmasterVM reportmasterVM)
        {
            if (reportmasterVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                var isUpdate = false;
                var newReportFromTemplate = false;
                var templateReportPath = string.Empty;
                var reportName = reportmasterVM.reportName;
                var reportPath = _constantPath.ReportPath;

                int? entityId = reportmasterVM.entityId;
                int? reportCategoryId = reportmasterVM.gencCategoryID;

                if (reportmasterVM.id != 0)
                {
                    isUpdate = true;
                }

                if (reportmasterVM.isDefaultReport)
                {
                    var defaultReport = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.entityId == entityId && x.isDefaultReport == true && x.isDeleted == false);
                    if (defaultReport != null)
                    {
                        defaultReport.isDefaultReport = false;
                    }
                }

                /* Model for return reportId,reportGUID.  */
                ReportIdModel reportIdModel = new ReportIdModel();

                if (isUpdate)
                {
                    /* Check for Unique Report Name. */
                    var reportNameUnique = await _FJTSqlDBContext.reportmaster.AnyAsync(x => x.id != reportmasterVM.id && x.reportName == reportName && x.isDeleted == false);
                    if (reportNameUnique == true)
                    {
                        var uniqueNameMSG = await _dynamicMessageService.Get(MUST_UNIQUE_GLOBAL);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = uniqueNameMSG.messageType, messageCode = uniqueNameMSG.messageCode, message = string.Format(uniqueNameMSG.message, REPORT_NAME) } });
                    }

                    /* flag -  managed update report and below fetched System Generated reports are same. */
                    bool flag = false;
                    var reportmasterData = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.id == reportmasterVM.id && x.isDeleted == false);
                    if (reportmasterData.isDefaultReport == true && !reportmasterVM.isDefaultReport)
                    {
                        var systemGeneratedReport = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.entityId == reportmasterVM.entityId && x.reportGenerationType == ((int)ReportCategory.SystemGeneratedReport).ToString() && x.isDeleted == false);
                        if (systemGeneratedReport != null)
                        {
                            if (systemGeneratedReport.id == reportmasterVM.id) { flag = true; }
                            else
                            {
                                systemGeneratedReport.isDefaultReport = true;
                                systemGeneratedReport.updatedAt = StaticMethods.GetUtcDateTime();
                                systemGeneratedReport.updatedBy = reportmasterVM.userId.ToString();
                                systemGeneratedReport.updateByRoleId = reportmasterVM.userRoleId;
                            }
                        }
                    }

                    if (reportmasterData == null)
                    {
                        var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, REPORT_DETAILS) } });
                    }
                    if (reportmasterData.editingBy != null)
                    {
                        var activityStartedMSG = await _dynamicMessageService.Get(ACTIVITY_ALREADY_STARTED);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = activityStartedMSG.messageType, messageCode = activityStartedMSG.messageCode, message = string.Format(activityStartedMSG.message, GetUserNameById(reportmasterData.editingBy), reportmasterData.startDesigningDate.Value.ToLocalTime()) } });
                    }
                    reportmasterData.reportName = reportName;
                    reportmasterData.reportTitle = reportmasterVM.reportTitle;
                    reportmasterData.entityId = entityId == 0 ? null : entityId;
                    if (reportmasterVM.gencCategoryID == 0)
                    {
                        reportmasterVM.gencCategoryID = null;
                    }
                    reportmasterData.reportCategoryId = reportmasterVM.gencCategoryID;
                    reportmasterData.reportViewType = reportmasterVM.reportType == ((int)ReportType.Detail);
                    reportmasterData.additionalNotes = reportmasterVM.additionalNotes;
                    reportmasterData.isDefaultReport = flag || reportmasterVM.isDefaultReport;
                    reportmasterData.updatedAt = StaticMethods.GetUtcDateTime();
                    reportmasterData.updatedBy = reportmasterVM.userId.ToString();
                    reportmasterData.updateByRoleId = reportmasterVM.userRoleId;
                    await _FJTSqlDBContext.SaveChangesAsync();

                    reportIdModel.Id = reportmasterVM.id;
                    reportIdModel.fileName = reportmasterData.fileName;

                    var resMessage = await _dynamicMessageService.Get(UPDATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, reportIdModel, new UserMessage() { message = string.Format(resMessage.message, REPORT_ENTITY) });
                }
                else
                {
                    /* Check for Unique Report Name. */
                    var reportNameUnique = await _FJTSqlDBContext.reportmaster.AnyAsync(x => x.reportName == reportName && x.isDeleted == false);
                    if (reportNameUnique == true)
                    {
                        var uniqueNameMSG = await _dynamicMessageService.Get(MUST_UNIQUE_GLOBAL);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = uniqueNameMSG.messageType, messageCode = uniqueNameMSG.messageCode, message = string.Format(uniqueNameMSG.message, REPORT_NAME) } });
                    }

                    /* Clone from another Report or Create New Report => reportCreateType => 'true' = 'Clone Report', 'false' = 'new report with template' */
                    /* get report Id,Path of templateReport or cloneReport. */
                    int? templateReportId = null;
                    var templateReportFolderPath = string.Empty;
                    if (reportmasterVM.reportCreateType == (int)ReportCreateType.CloneFromReport)
                    {
                        templateReportFolderPath = reportmasterVM.isEndUserReport ? reportPath : (reportmasterVM.reportGenerationType == ((int)ReportCategory.SystemGeneratedReport).ToString() ? _constantPath.SystemGeneratedReportPath : _constantPath.TemplateReportPath);
                        templateReportId = reportmasterVM.refReportId;
                    }
                    else
                    {
                        templateReportId = reportmasterVM.templateId != 0 ? reportmasterVM.templateId : null;
                        newReportFromTemplate = true;
                        templateReportFolderPath = _constantPath.TemplateReportPath;
                    }

                    if (templateReportId != null)
                    {
                        /* get Report Data of template file or clone report record from database. */
                        var templateReportData = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.id == templateReportId && x.isDeleted == false);
                        if (templateReportData == null)
                        {
                            var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, newReportFromTemplate ? TEMPLATE_DETAILS : COPY_FROM_DETAILS) } });
                        }

                        //entityId = reportmasterVM.reportCreateType == (int)ReportCreateType.FromReport ? templateReportData.entityId : entityId;
                        //reportCategoryId = reportmasterVM.reportCreateType == (int)ReportCreateType.FromReport ? templateReportData.reportCategoryId : reportCategoryId;

                        templateReportPath = templateReportFolderPath + templateReportData.fileName + REPORT_EXTENSION;
                        if (!(System.IO.File.Exists(templateReportPath)))
                        {
                            var notExistsMSG = await _dynamicMessageService.Get("NOT_EXISTS");
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notExistsMSG.messageType, messageCode = notExistsMSG.messageCode, message = string.Format(notExistsMSG.message, newReportFromTemplate ? TEMPLATE : COPY_FROM) } });
                        }
                    }

                    List<reportmasterparameter> reportmasterparameters = new List<reportmasterparameter>();
                    var refReportId = newReportFromTemplate ? null : reportmasterVM.refReportId;
                    if (refReportId != null)
                    {
                        var requiredParameterList = await _FJTSqlDBContext.reportmasterparameter.Where(x => x.reportId == refReportId && x.isDeleted == false).Select(x => new { x.parmeterMappingid, x.isRequired }).ToListAsync();
                        foreach (var item in requiredParameterList)
                        {
                            reportmasterparameter reportmasterparameter = new reportmasterparameter
                            {
                                parmeterMappingid = item.parmeterMappingid,
                                isRequired = item.isRequired,
                                createdBy = reportmasterVM.userId.ToString(),
                                createByRoleId = reportmasterVM.userRoleId,
                                createdAt = StaticMethods.GetUtcDateTime()
                            };
                            reportmasterparameters.Add(reportmasterparameter);
                        }
                    }

                    reportmaster reportMasterObj = new reportmaster
                    {
                        reportName = reportName,
                        rdlcReportFileName = reportName,
                        reportTitle = reportmasterVM.reportTitle,
                        entityId = entityId == 0 ? null : entityId,
                        reportCategoryId = reportCategoryId == 0 ? null : reportCategoryId,
                        reportViewType = reportmasterVM.reportType == (int)ReportType.Detail,
                        isEndUserReport = true,
                        fileName = System.Guid.NewGuid().ToString(),
                        refReportId = refReportId,
                        status = ReportStatus.Draft.GetDisplayValue(),
                        reportGenerationType = reportmasterVM.reportGenerationType == ((int)ReportCategory.TemplateReport).ToString() ? ((int)ReportCategory.TemplateReport).ToString() : ((int)ReportCategory.EndUserReport).ToString(),
                        createdBy = reportmasterVM.userId.ToString(),
                        createByRoleId = reportmasterVM.userRoleId,
                        createdAt = StaticMethods.GetUtcDateTime(),
                        additionalNotes = reportmasterVM.additionalNotes,
                        isDefaultReport = reportmasterVM.isDefaultReport,
                        reportmasterparameters = reportmasterparameters
                    };
                    _FJTSqlDBContext.reportmaster.Add(reportMasterObj);
                    await _FJTSqlDBContext.SaveChangesAsync();

                    reportIdModel.Id = reportMasterObj.id;
                    reportIdModel.fileName = reportMasterObj.fileName;

                    /* If the folder does not exist, it will create. */
                    System.IO.Directory.CreateDirectory(reportPath);
                    var reportWithPath = reportPath + reportMasterObj.fileName + REPORT_EXTENSION;
                    if (templateReportId != null)
                    {
                        /* Copy Templatefile or Reportfile to new Report. */
                        System.IO.File.Copy(templateReportPath, reportWithPath);
                    }
                    else
                    {
                        /* Create Blank Report file. */
                        var report = new StiReport();
                        StiMySqlDatabase db = new StiMySqlDatabase(REPORT_DATABASE_NAME, REPORT_DATABASE_NAME, _connectionStrings.ReportConnection);
                        report.Dictionary.Databases.Add(db);
                        report.Save(reportWithPath);
                    }
                    var resMessage = await _dynamicMessageService.Get(CREATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, reportIdModel, new UserMessage() { message = string.Format(resMessage.message, REPORT_ENTITY) });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(ex);
            }
        }

        public async Task<IActionResult> Error()
        {
            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
            return View(new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message });
        }

        //[Authorize]
        //public IEnumerable<string> RenewToken()
        //{
        //    _logger.LogError(" BT: HIT RenewToken Method at: " + DateTime.Now);
        //    return new string[] { "value1", "value2" };
        //}

        /// <summary>
        /// Delete Report -- In Development.(need this api in future only we have to delete physical report file)
        /// </summary>
        /// <param name="reportmasterVM"></param>
        /// <returns></returns>
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //[HttpPost]
        //public ResponseModel DeleteReport(ReportmasterVM reportmasterVM)
        //{
        //    if (reportmasterVM == null)
        //    {
        //        return new ResponseModel() { IsSuccess = false, Message = INVALID_INPUT };
        //    }

        //    try
        //    {
        //        var id = reportmasterVM.fileName;
        //        var reportFolderPath = _constantPath.ReportPath;

        //        /* Get Report Data from Database from 'reportmaster' table */
        //        var reportData = _FJTSqlDBContext.reportmaster.Where(x => x.fileName == id && x.isDeleted == false).FirstOrDefault();
        //        if (reportData == null)
        //        {
        //            return new ResponseModel() { IsSuccess = false, Model = null, Message = REPORT_RECORD_NOT_FOUND };
        //        }
        //        var draftFileName = reportData.draftFileName;

        //        reportData.isDeleted = true;
        //        reportData.deletedAt = StaticMethod.GetUtcDateTime();
        //        reportData.deletedBy = reportmasterVM.userId.ToString();
        //        reportData.deleteByRoleId = reportmasterVM.userRoleId;
        //        _FJTSqlDBContext.SaveChanges();

        //        var reportPath = reportFolderPath + id + REPORT_EXTENSION;
        //        var draftReportPath = reportFolderPath + draftFileName + REPORT_EXTENSION;


        //        /* Delete report file at Physical location. */
        //        if (System.IO.File.Exists(reportPath))
        //        {
        //            System.IO.File.Delete(reportPath);
        //        }

        //        if (System.IO.File.Exists(draftReportPath))
        //        {
        //            System.IO.File.Delete(draftReportPath);
        //        }

        //        return new ResponseModel() { IsSuccess = true, Message = SUCCESSFULLY_REPORT_DELETED };
        //    }
        //    catch
        //    {
        //        return new ResponseModel() { IsSuccess = false, Model = null, Message = SOMETHING_WENT_WRONG };
        //    }
        //}
    }
}