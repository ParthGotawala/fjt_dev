using System;
using System.Collections.Generic;
using System.Linq;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Repository;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using static FJT.IdentityServer.Helper.Constant;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Net;
using IdentityServer4.EntityFramework.Interfaces;
using Microsoft.EntityFrameworkCore;
using FJT.IdentityServer.Models.ViewModel;
using FJT.IdentityServer.CryptoJS;

namespace FJT.IdentityServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AuthenticationController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IConfigurationDbContext _configurationDbContext;
        private readonly IUserRepository _iUserRepository;
        private readonly IDynamicMessageService _dynamicMessageService;


        public AuthenticationController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IHttpsResponseRepository iHttpsResponseRepository,
            ILogger<AuthenticationController> logger,
            IConfigurationDbContext configurationDbContext,
            IUserRepository iUserRepository,
            IDynamicMessageService dynamicMessageService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _iHttpsResponseRepository = iHttpsResponseRepository;
            _logger = logger;
            _configurationDbContext = configurationDbContext;
            _iUserRepository = iUserRepository;
            _dynamicMessageService = dynamicMessageService;
        }

        /// <summary>
        /// Validate user has permission to access specific client or not.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ValidateClientUserMapping([FromBody] ClientUserMappingStatusVM model)
        {
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
            | SecurityProtocolType.Tls11
            | SecurityProtocolType.Tls12;

            try
            {
                if (model.UserId == null)
                {
                    var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
                }
                else
                {
                    string ClintId = string.Empty;
                    var Clint = await _configurationDbContext.Clients.FirstOrDefaultAsync(x => x.ClientName == model.Claim);

                    if (Clint != null) { ClintId = Clint.ClientId; }

                    if (await _iUserRepository.ClientUserMappingAvailabilityStaus(model.UserId, ClintId))
                    {
                        var responseObj = await CheckAutoLogout() as OkObjectResult;
                        var response = (ApiResponse)responseObj.Value;
                        // purpose - we can check error from "checkAutoLogout" method. 
                        response.data = "checkAutoLogout";
                        return new OkObjectResult(response);
                    }
                    else
                    {
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, null);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Check After Change user password user is not logged out or not.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> CheckAutoLogout()
        {
            try
            {
                string userid = string.Empty;
                string identityUserId = HttpContext.User.Claims.Count() != 0 ? HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value : null;
                if (identityUserId == null)
                {
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                }

                var userTemp = await _userManager.FindByIdAsync(identityUserId);
                if (userTemp.changePasswordAt.HasValue)
                {
                    // get token Creation time and convert that timeStamp into Date.
                    var timeStamp = HttpContext.User.Claims.Count() != 0 ? HttpContext.User.FindFirstValue("nbf") : null;
                    if (timeStamp == null)
                    {
                        var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                    }
                    long.TryParse(timeStamp, out long longTimeStamp);
                    DateTime tokenCreationdate = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                    tokenCreationdate = tokenCreationdate.AddSeconds(longTimeStamp).ToUniversalTime();

                    // Compare toke Creation time and password change time.
                    int isValid = DateTime.Compare(tokenCreationdate, userTemp.changePasswordAt.Value);
                    if (isValid > 0)
                    {
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, null);
                    }
                    else
                    {
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.UNAUTHORIZED, APIState.SUCCESS, null, null);
                    }
                }
                else
                {
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, null);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> SetSuperAdmin(string userId, bool isSuperAdmin)
        {
            if (userId == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                var userTemp = await _userManager.FindByIdAsync(userId);
                if (userTemp == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, USER_ENTITY) } });
                }
                userTemp.isSuperAdmin = isSuperAdmin;
                await _userManager.UpdateAsync(userTemp);

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }
    }
}