using FJT.ReportDesigner.AppSettings;
using FJT.ReportDesigner.Enums;
using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Models;
using FJT.ReportDesigner.MySqlDBModel;
using FJT.ReportDesigner.Repository.Interface;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Threading.Tasks;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Repository
{
    public class UtilityController : Controller, IUtilityController
    {
        protected readonly FJTSqlDBContext _FJTSqlDBContext;
        protected ConstantPath _constantPath;
        protected IdentityserverConfig _identityserverConfig;
        private readonly IDynamicMessageService _dynamicMessageService;
        private readonly ILogger<UtilityController> _logger;

        public UtilityController(FJTSqlDBContext fjtSqlDBContext, IOptions<ConstantPath> constantPath, IOptions<IdentityserverConfig> identityserverConfig, IDynamicMessageService dynamicMessageService, ILogger<UtilityController> logger)
        {
            _FJTSqlDBContext = fjtSqlDBContext;
            _constantPath = constantPath.Value;
            _identityserverConfig = identityserverConfig.Value;
            _dynamicMessageService = dynamicMessageService;
            _logger = logger;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ResponseModel CheckStatusOfReportFile(string fileName, bool isEndUserReport, string reportGenerationType)
        {
            if (fileName == null)
            {
                var invalidParameterMSG = _dynamicMessageService.Get(INVALID_PARAMETER).Result;
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };
            }
            try
            {
                var isReportFileAvailable = false;
                var reportFolderPath = isEndUserReport ? _constantPath.ReportPath : (reportGenerationType == ((int)ReportCategory.SystemGeneratedReport).ToString() ? _constantPath.SystemGeneratedReportPath : _constantPath.TemplateReportPath);
                var reportPath = reportFolderPath + fileName + ConstantHelper.REPORT_EXTENSION;

                if (System.IO.File.Exists(reportPath))
                {
                    isReportFileAvailable = true;
                }

                return new ResponseModel() { IsSuccess = true, Model = isReportFileAvailable, StatusCode = (int)APIStatusCode.SUCCESS, Message = null };
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return new ResponseModel() { IsSuccess = false, Model = null, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = e.Message };
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ResponseModel> GetReportByteData(string fileName, bool isEndUserReport, string reportGenerationType)
        {
            if (fileName == null)
            {
                var invalidParameterMSG = _dynamicMessageService.Get(INVALID_PARAMETER).Result;
                return new ResponseModel() { IsSuccess = false, StatusCode = (int)APIStatusCode.BAD_REQUEST, Message = invalidParameterMSG.message };
            }
            try
            {
                var reportFolderPath = isEndUserReport ? _constantPath.ReportPath : (reportGenerationType == ((int)ReportCategory.SystemGeneratedReport).ToString() ? _constantPath.SystemGeneratedReportPath : _constantPath.TemplateReportPath);
                var reportPath = reportFolderPath + fileName + ConstantHelper.REPORT_EXTENSION;

                ReportByteDataVM reportByteDataVM = new ReportByteDataVM
                {
                    ReportByteData = await System.IO.File.ReadAllBytesAsync(reportPath)
                };
                var reportByteDataVMString = Newtonsoft.Json.JsonConvert.SerializeObject(reportByteDataVM);

                return new ResponseModel() { IsSuccess = true, Model = reportByteDataVMString, StatusCode = (int)APIStatusCode.SUCCESS, Message = null };
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return new ResponseModel() { IsSuccess = false, Model = null, StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = e.Message };
            }
        }

        public async Task<double> RenewToken()
        {
            try
            {
                var authInfo = await HttpContext.AuthenticateAsync(_identityserverConfig.AuthenticationScheme);
                if (authInfo == null) { return 0; }

                var refreshToken = authInfo.Properties.GetTokenValue("refresh_token");
                var accessToken = authInfo.Properties.GetTokenValue("access_token");
                if (refreshToken == null || accessToken == null) { return 0; }
                var decodedAccessToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);

                var now = DateTime.UtcNow;
                var timeElapsed = now.Subtract(decodedAccessToken.Payload.ValidFrom);
                var timeRemaining = decodedAccessToken.Payload.ValidTo.Subtract(now);
                var tokenLifeTime = decodedAccessToken.Payload.ValidTo.Subtract(decodedAccessToken.Payload.ValidFrom).TotalMilliseconds;
                var setIntervalTime = Math.Floor(tokenLifeTime / 3);

                if (timeElapsed > timeRemaining)
                {
                    HttpClientHandler handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
                    };
                    HttpClient client = Startup.islocalhost ? new HttpClient(handler) : new HttpClient();

                    var response = await client.RequestRefreshTokenAsync(new RefreshTokenRequest
                    {
                        Address = _constantPath.IdentityserverURL + ConstantHelper.TOKEN_PATH,
                        ClientId = _identityserverConfig.ClientId,
                        ClientSecret = _identityserverConfig.ClientSecret,
                        RefreshToken = refreshToken
                    });

                    if (!response.IsError)
                    {
                        authInfo.Properties.UpdateTokenValue("access_token", response.AccessToken);
                        authInfo.Properties.UpdateTokenValue("refresh_token", response.RefreshToken);
                        authInfo.Properties.UpdateTokenValue("id_token", response.IdentityToken);
                    }
                    else
                    {
                        _logger.LogError("Error in Silent Renew call:" + response.Error + ". " + response.ErrorDescription);
                    }
                    return response.IsError ? 0 : setIntervalTime;
                }
                return setIntervalTime;
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return 0;
            }
        }
    }
}
