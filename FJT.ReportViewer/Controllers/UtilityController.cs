using FJT.ReportViewer;
using FJT.ReportViewer.AppSettings;
using FJT.ReportViewer.Helper;
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

namespace FJT.ReportDesigner.Repository
{
    public class UtilityController : Controller
    {
        private readonly ILogger<UtilityController> _logger;
        protected ConstantPath _constantPath;
        protected IdentityserverConfig _identityserverConfig;

        public UtilityController(IOptions<ConstantPath> constantPath, IOptions<IdentityserverConfig> identityserverConfig, ILogger<UtilityController> logger)
        {
            _constantPath = constantPath.Value;
            _identityserverConfig = identityserverConfig.Value;
            _logger = logger;
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
