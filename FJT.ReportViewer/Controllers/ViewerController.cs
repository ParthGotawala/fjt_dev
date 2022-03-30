using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Threading.Tasks;
using FJT.ReportViewer.AppSettings;
using FJT.ReportViewer.Enums;
using FJT.ReportViewer.Helper;
using FJT.ReportViewer.Models;
using FJT.ReportViewer.MySqlDBModel;
using FJT.ReportViewer.Repository;
using FJT.ReportViewer.Repository.Interface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stimulsoft.Report;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Mvc;
using static FJT.ReportViewer.Helper.ConstantHelper;

namespace FJT.ReportViewer.Controllers
{
    [CustomAuthorization]
    public class ViewerController : Controller
    {
        private readonly FJTSqlDBContext _FJTSqlDBContext;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly ConstantPath _constantPath;
        private readonly ConnectionStrings _connectionStrings;
        private readonly ILogger<ViewerController> _logger;
        private readonly IDynamicMessageService _dynamicMessageService;

        static ViewerController()
        {
            /* Activate Stimulsoft Report */
            Stimulsoft.Base.StiLicense.LoadFromFile("license.key");
        }
        public ViewerController(FJTSqlDBContext context, IHttpsResponseRepository iHttpsResponseRepository, IOptions<ConstantPath> constantPath, IOptions<ConnectionStrings> connectionStrings, ILogger<ViewerController> logger, IDynamicMessageService dynamicMessageService)
        {
            _FJTSqlDBContext = context;
            _iHttpsResponseRepository = iHttpsResponseRepository;
            _constantPath = constantPath.Value;
            _connectionStrings = connectionStrings.Value;
            _logger = logger;
            _dynamicMessageService = dynamicMessageService;
        }

        /// <summary>
        /// Main Method(Entry Point of Viewer.)
        /// </summary>
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
                var parameterGUID = Guid.Parse(id);
                var reportId = await _FJTSqlDBContext.reportviewerparameter.Where(x => x.parameterGUID == parameterGUID && x.isDeleted == false).Select(x => x.reportId).FirstOrDefaultAsync();

                /* Get ReportName From 'reportMaster' Table. */
                var reportmaster = await _FJTSqlDBContext.reportmaster.Where(x => x.id == reportId && x.isDeleted == false).Select(x => new { x.reportName, x.reportGenerationType, x.fileName, x.status, x.isEndUserReport }).FirstOrDefaultAsync();
                if (reportmaster == null)
                {
                    return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = REPORT_DETAILS });
                }
                var reportApiURL = _constantPath.ReportApiURL + CHECK_STATUS_OF_REPORT_FILE;
                var accessToken = HttpContext.GetTokenAsync("access_token");

                HttpClientHandler handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
                };

                HttpClient client = Startup.islocalhost ? new HttpClient(handler) : new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Result);

                var urlstring = reportApiURL + "?fileName=" + reportmaster.fileName + "&isEndUserReport=" + reportmaster.isEndUserReport + "&reportGenerationType=" + reportmaster.reportGenerationType;
                var response = await client.GetAsync(urlstring);
                response.EnsureSuccessStatusCode();

                /* Save Response(Report Byte Data) in Variable. */
                var responseModelString = await response.Content.ReadAsStringAsync();

                if (string.IsNullOrEmpty(responseModelString))
                {
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message });
                }

                var responseModel = (ResponseModel)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModelString)).
                        ToObject(typeof(ResponseModel));
                if (responseModel.IsSuccess == false || (bool)responseModel.Model == false)
                {
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    var notExistsMSG = await _dynamicMessageService.Get("NOT_EXISTS");
                    return View("Error", new ErrorViewModel { StatusCode = responseModel.IsSuccess ? (int)APIStatusCode.PAGE_NOT_FOUND : (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = responseModel.IsSuccess ? string.Format(notExistsMSG.message, REPORT_ENTITY) : somethingWrongMSG.message });
                }

                /* Pass ReportName to DesignerView for display in header */
                ViewBag.ReportName = reportmaster.reportName;
                ViewBag.urlParameter = id;
                ViewBag.status = reportmaster.status == ReportStatus.Draft.GetDisplayValue() ? ReportStatus.Draft.ToString() : ReportStatus.Published.ToString();

                return View();
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = e.Message });
            }
        }

        /// <summary>
        /// Get Report Data.(From Api Call.)
        /// </summary>
        /// <param name="id">REPORT GUID</param>
        /// <returns></returns>

        [Authorize]
        public async Task<IActionResult> GetReport(string id)
        {
            try
            {
                var parameterGuid = Guid.Parse(id);
                reportviewerparameter reportviewerparameter = await _FJTSqlDBContext.reportviewerparameter.Where(x => x.parameterGUID == parameterGuid && x.isDeleted == false).FirstOrDefaultAsync();
                reportmaster reportmaster = await _FJTSqlDBContext.reportmaster.Where(x => x.id == reportviewerparameter.reportId && x.isDeleted == false).FirstOrDefaultAsync();

                var reportApiURL = _constantPath.ReportApiURL + GET_REPORT_BYTE_DATA;
                var accessToken = HttpContext.GetTokenAsync("access_token");

                HttpClientHandler handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
                };

                HttpClient client = Startup.islocalhost ? new HttpClient(handler) : new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Result);

                var urlstring = reportApiURL + "?fileName=" + reportmaster.fileName + "&isEndUserReport=" + reportmaster.isEndUserReport + "&reportGenerationType=" + reportmaster.reportGenerationType;
                var response = await client.GetAsync(urlstring);
                response.EnsureSuccessStatusCode();

                /* Save Response(Report Byte Data) in Variable. */
                var responseModelString = await response.Content.ReadAsStringAsync();

                var responseModel = (ResponseModel)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModelString)).
                        ToObject(typeof(ResponseModel));
                ReportByteDataVM reportByteDataVM = (ReportByteDataVM)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModel.Model.ToString())).
                        ToObject(typeof(ReportByteDataVM));
                var reportByteData = reportByteDataVM.ReportByteData;
                var companyInfo = await _FJTSqlDBContext.CompanyInfos.Include(x => x.Mfgcodemst).Select(x => new { x.Mfgcodemst.mfgCode }).FirstOrDefaultAsync();

                /* Create the report object */
                var report = new StiReport();
                report.Load(reportByteData);
                report.ReportName = reportviewerparameter.reportName != null ? companyInfo.mfgCode + reportviewerparameter.reportName : reportmaster.reportName;
                StiDictionary dictionary = report.Dictionary;

                /* get all database & change Connection String. */
                var dbList = dictionary.Databases.ToList();
                for (int i = 0; i < dbList.Count; i++)
                {
                    ((StiSqlDatabase)dictionary.Databases[i]).ConnectionString = _connectionStrings.ReportConnection;
                }

                /* Reset all Variable Value */
                var variableList = dictionary.Variables.ToList();
                foreach (var item in variableList)
                {
                    item.Value = null;
                }

                /* Pass Value to Constant Variable. */
                foreach (var variableName in Enum.GetNames(typeof(ConstantReportVariable)))
                {
                    if (report.IsVariableExist(variableName))
                    {
                        ConstantReportVariable reportVariable = (ConstantReportVariable)Enum.Parse(typeof(ConstantReportVariable), variableName);
                        dictionary.Variables[variableName].Value = reportVariable.GetDisplayValue();
                    }
                }

                FilterParameters filterParameters = new FilterParameters();
                if (!String.IsNullOrEmpty(reportviewerparameter.parameterValues))
                {
                    /* Deserialize parameter Values. */
                    filterParameters = (FilterParameters)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(reportviewerparameter.parameterValues)).
                                                                ToObject(typeof(FilterParameters));
                }

                /* Convert filterParameters model column in row. */
                PropertyInfo[] filterParametersProperties = filterParameters.GetType().GetProperties();

                //PropertyInfo[] reportMasterProperties = reportmaster.GetType().GetProperties();
                var reportmasterparameterList = await _FJTSqlDBContext.reportmasterparameter.Where(x => x.reportId == reportmaster.id && x.isDeleted == false).Select(x => x.parmeterMappingid).ToListAsync();
                var param_DbColumnList = await _FJTSqlDBContext.report_parameter_setting_mapping.Where(x => reportmasterparameterList.Any(paramId => x.id == paramId)).Select(x => new { x.reportParamName, x.dbColumnName }).ToListAsync();

                foreach (var item in param_DbColumnList)
                {
                    var valueObj = filterParametersProperties.Where(x => x.Name == item.dbColumnName).Select(x => x.GetValue(filterParameters)).FirstOrDefault();
                    var paramValue = string.Empty;
                    if (valueObj != null)
                    {
                        paramValue = valueObj.ToString();
                    }
                    var stiVariable = dictionary.Variables[item.reportParamName];
                    if (report.IsVariableExist(item.reportParamName))
                    {
                        dictionary.Variables[item.reportParamName].Value = paramValue;
                    }
                    else
                    {
                        dictionary.Variables.Add("", item.reportParamName, item.reportParamName, paramValue);
                    }
                }

                /* Set some default variable Value. */
                if (report.IsVariableExist(PARA_REPORT_TITLE))
                {
                    dictionary.Variables[PARA_REPORT_TITLE].Value = reportmaster.reportTitle;
                }
                if (report.IsVariableExist(PARA_REPORT_VERSION))
                {
                    dictionary.Variables[PARA_REPORT_VERSION].Value = reportmaster.reportVersion ?? "-";
                }
                if (report.IsVariableExist(Para_ROHS_ImageFolderPath))
                {
                    dictionary.Variables[Para_ROHS_ImageFolderPath].Value = string.Concat(_constantPath.APIURL, _constantPath.RoHSImagesPath);
                }

                await report.RenderAsync();
                return StiNetCoreViewer.GetReportResult(this, report);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var report = new StiReport();
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ErrorReport.mrt"));
                report.Dictionary.Variables["Para_Error"].Value = e.Message;
                report.ReportName = "Error";
                return StiNetCoreViewer.GetReportResult(this, report);
            }
        }

        /// <summary>
        /// ViewerEvent -Stimulsoft Report.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public async Task<IActionResult> ViewerEvent()
        {
            return await StiNetCoreViewer.ViewerEventResultAsync(this);
        }

        /// <summary>
        /// Download Report as Pdf.
        /// </summary>
        /// <param name="downlodReportVM"></param>
        /// <returns></returns>
        [Route("api/[controller]/[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> DownloadReport([FromBody] DownlodReportVM downlodReportVM)
        {
            if (downlodReportVM == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                ApiResponse badRequestRes = new ApiResponse()
                {
                    userMessage = new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } }
                };
                return BadRequest(badRequestRes);
            }
            try
            {
                var parameterGuid = Guid.Parse(downlodReportVM.ParameterGuid);
                reportviewerparameter reportviewerparameter = await _FJTSqlDBContext.reportviewerparameter.FirstOrDefaultAsync(x => x.parameterGUID == parameterGuid && x.isDeleted == false);
                reportmaster reportmaster = await _FJTSqlDBContext.reportmaster.FirstOrDefaultAsync(x => x.id == reportviewerparameter.reportId && x.isDeleted == false);
                if (reportmaster == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    ApiResponse notFoundRes = new ApiResponse()
                    {
                        userMessage = new UserMessage { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, REPORT_DETAILS) } }
                    };
                    return NotFound(notFoundRes);
                }

                var reportApiURL = _constantPath.ReportApiURL + CHECK_STATUS_OF_REPORT_FILE;
                string authorizationToken = HttpContext.Request.Headers["Authorization"];
                string[] authorsList = authorizationToken.Split(" ");

                HttpClientHandler handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
                };

                HttpClient client = Startup.islocalhost ? new HttpClient(handler) : new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorsList[1]);

                var urlstring = reportApiURL + "?fileName=" + reportmaster.fileName + "&isEndUserReport=" + reportmaster.isEndUserReport + "&reportGenerationType=" + reportmaster.reportGenerationType;
                var response = await client.GetAsync(urlstring);
                response.EnsureSuccessStatusCode();
                var responseModelString = await response.Content.ReadAsStringAsync();

                var responseModel = (ResponseModel)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModelString)).
                        ToObject(typeof(ResponseModel));
                if (responseModel.IsSuccess == false || (bool)responseModel.Model == false)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    ApiResponse apiResponse = new ApiResponse()
                    {
                        userMessage = new UserMessage { messageContent = new MessageContent { messageType = responseModel.IsSuccess ? notFoundMSG.messageType : somethingWrongMSG.messageType, messageCode = responseModel.IsSuccess ? notFoundMSG.messageCode : somethingWrongMSG.messageCode, message = responseModel.IsSuccess ? string.Format(notFoundMSG.message, "Report file") : somethingWrongMSG.message } }
                    };
                    return StatusCode(responseModel.IsSuccess ? 404 : 500, apiResponse);
                }

                var getByteDataURL = _constantPath.ReportApiURL + GET_REPORT_BYTE_DATA;
                urlstring = getByteDataURL + "?fileName=" + reportmaster.fileName + "&isEndUserReport=" + reportmaster.isEndUserReport + "&reportGenerationType=" + reportmaster.reportGenerationType;
                response = await client.GetAsync(urlstring);
                response.EnsureSuccessStatusCode();
                responseModelString = await response.Content.ReadAsStringAsync();
                responseModel = (ResponseModel)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModelString)).
                        ToObject(typeof(ResponseModel));
                if (responseModel.IsSuccess == false)
                {
                    ApiResponse apiResponse = new ApiResponse()
                    {
                        userMessage = new UserMessage { message = responseModel.Message }
                    };
                    return StatusCode(responseModel.StatusCode, apiResponse);
                }
                ReportByteDataVM reportByteDataVM = (ReportByteDataVM)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModel.Model.ToString())).
                        ToObject(typeof(ReportByteDataVM));
                var reportByteData = reportByteDataVM.ReportByteData;
                var companyInfo = await _FJTSqlDBContext.CompanyInfos.Include(x => x.Mfgcodemst).Select(x => new { x.Mfgcodemst.mfgCode }).FirstOrDefaultAsync();

                /* Create the report object */
                var report = new StiReport();
                report.Load(reportByteData);
                report.ReportName = reportviewerparameter.reportName != null ? companyInfo.mfgCode + reportviewerparameter.reportName : reportmaster.reportName;
                StiDictionary dictionary = report.Dictionary;

                /* get all database & change Connection String. */
                var dbList = dictionary.Databases.ToList();
                for (int i = 0; i < dbList.Count; i++)
                {
                    ((StiSqlDatabase)dictionary.Databases[i]).ConnectionString = _connectionStrings.ReportConnection;
                }

                /* Reset all Variable Value */
                var variableList = dictionary.Variables.ToList();
                foreach (var item in variableList)
                {
                    item.Value = null;
                }

                /* Pass Value to Constant Variable. */
                foreach (var variableName in Enum.GetNames(typeof(ConstantReportVariable)))
                {
                    if (report.IsVariableExist(variableName))
                    {
                        ConstantReportVariable reportVariable = (ConstantReportVariable)Enum.Parse(typeof(ConstantReportVariable), variableName);
                        dictionary.Variables[variableName].Value = reportVariable.GetDisplayValue();
                    }
                }

                /* Deserialize parameter Values. */
                FilterParameters filterParameters = (FilterParameters)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(reportviewerparameter.parameterValues)).
                                                            ToObject(typeof(FilterParameters));

                /* Extra - only for Testing */
                //var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(reportviewerparameter.parameterValues);
                /**/

                /* Convert filterParameters model column in row. */
                PropertyInfo[] filterParametersProperties = filterParameters.GetType().GetProperties();

                var reportmasterparameterList = await _FJTSqlDBContext.reportmasterparameter.Where(x => x.reportId == reportmaster.id && x.isDeleted == false).Select(x => x.parmeterMappingid).ToListAsync();
                var param_DbColumnList = await _FJTSqlDBContext.report_parameter_setting_mapping.Where(x => reportmasterparameterList.Any(paramId => x.id == paramId)).Select(x => new { x.reportParamName, x.dbColumnName }).ToListAsync();

                foreach (var item in param_DbColumnList)
                {
                    var valueObj = filterParametersProperties.Where(x => x.Name == item.dbColumnName).Select(x => x.GetValue(filterParameters)).FirstOrDefault();
                    var paramValue = string.Empty;
                    if (valueObj != null)
                    {
                        paramValue = valueObj.ToString();
                    }
                    if (report.IsVariableExist(item.reportParamName))
                    {
                        dictionary.Variables[item.reportParamName].Value = paramValue;
                    }
                    else
                    {
                        dictionary.Variables.Add("", item.reportParamName, item.dbColumnName, paramValue);
                    }
                }
                /* Set some default variable Value. */
                if (report.IsVariableExist(PARA_REPORT_TITLE))
                {
                    dictionary.Variables[PARA_REPORT_TITLE].Value = reportmaster.reportTitle;
                }
                if (report.IsVariableExist(PARA_REPORT_VERSION))
                {
                    dictionary.Variables[PARA_REPORT_VERSION].Value = reportmaster.reportVersion ?? "-";
                }
                if (report.IsVariableExist(Para_ROHS_ImageFolderPath))
                {
                    dictionary.Variables[Para_ROHS_ImageFolderPath].Value = string.Concat(_constantPath.APIURL, _constantPath.RoHSImagesPath);
                }

                return StiNetCoreReportResponse.ResponseAsPdf(report);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                ApiResponse response = new ApiResponse()
                {
                    userMessage = new UserMessage { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message, err = new ErrorVM { message = e.Message, stack = e.StackTrace } } }
                };
                return StatusCode((int)APIStatusCode.INTERNAL_SERVER_ERROR, response);
            }
        }

        /// <summary>
        /// Save report filter parameter data in Database.
        /// </summary>
        /// <param name="reportviewerparameterVM"></param>
        /// <returns></returns>
        [Route("api/[controller]/[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> SaveReportViewerParameter([FromBody] RequestFilterParameterVM reportviewerparameterVM)
        {
            if (reportviewerparameterVM == null || reportviewerparameterVM.id == 0)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                reportviewerparameter reportviewerparameter = new reportviewerparameter
                {
                    parameterGUID = Guid.NewGuid(),
                    reportId = reportviewerparameterVM.id,
                    reportName = reportviewerparameterVM.reportName,
                    parameterValues = reportviewerparameterVM.parameterValueJson,
                    createdBy = reportviewerparameterVM.createdBy,
                    updatedBy = reportviewerparameterVM.updatedBy,
                    createdAt = StaticMethods.GetUtcDateTime(),
                    updatedAt = StaticMethods.GetUtcDateTime(),
                    createByRoleId = reportviewerparameterVM.createByRoleId,
                    updateByRoleId = reportviewerparameterVM.updateByRoleId,
                    deleteByRoleId = reportviewerparameterVM.deleteByRoleId
                };
                _FJTSqlDBContext.reportviewerparameter.Add(reportviewerparameter);
                await _FJTSqlDBContext.SaveChangesAsync();

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, reportviewerparameter.parameterGUID, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        public async Task<IActionResult> Error()
        {
            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
            return View(new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message });
        }
    }
}