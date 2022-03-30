using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Enums;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using FJT.IdentityServer.Quickstart.UI;
using FJT.IdentityServer.Repository;
using FJT.IdentityServer.Repository.Interface;
using IdentityServer4.EntityFramework.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static FJT.IdentityServer.Helper.Constant;

namespace FJT.IdentityServer.Quickstart.Account
{
    public class UtilityController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRepository _iUserRepository;
        private readonly IConfigurationDbContext _configurationDbContext;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly IDynamicMessageService _dynamicMessageService;
        private readonly ILogger<UtilityController> _logger;

        public UtilityController(UserManager<ApplicationUser> userManager, IUserRepository iUserRepository, IConfigurationDbContext configurationDbContext, IHttpsResponseRepository httpsResponseRepository, IDynamicMessageService dynamicMessageService, ILogger<UtilityController> logger)
        {
            _userManager = userManager;
            _iUserRepository = iUserRepository;
            _configurationDbContext = configurationDbContext;
            _iHttpsResponseRepository = httpsResponseRepository;
            _dynamicMessageService = dynamicMessageService;
            _logger = logger;
        }

        /// <summary>
        /// Register all Exsisting User From MainDb To IdentityDb.
        /// </summary>
        /// <param name="userList">contain information about Users.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterExsistingUserFromFJT([FromBody] List<RegisterVM> userList)
        {
            List<string> failedUser = new List<string>();
            List<IdPair> sucessUser = new List<IdPair>();

            try
            {
                foreach (var user in userList)
                {
                    // [PP] : to create user for existing user in FJT database.
                    var newApplicationUser = new ApplicationUser
                    {
                        UserName = user.Username,
                        userPasswordDigest = user.Password,
                        Email = user.Email,

                    };
                    var entryResult = await _userManager.CreateAsync(newApplicationUser);
                    if (!entryResult.Succeeded)
                    {
                        failedUser.Add(user.Username + " - " + user.Email);
                    }
                    else
                    {

                        var objClient = await _configurationDbContext.Clients.Where(x => x.ClientName == ClientConstant.Q2CClients.Q2CUI.GetDisplayValue()).FirstOrDefaultAsync();

                        if (objClient != null)
                        {
                            ClientUserMappingVM newClientUsersMapping = new ClientUserMappingVM()
                            {
                                ClientId = objClient.ClientId,
                                UserId = newApplicationUser.Id
                            };

                            await _iUserRepository.AddClientUserMap(newClientUsersMapping);
                        }

                        IdPair newPair = new IdPair()
                        {
                            userId = user.Id,
                            IdentityId = newApplicationUser.Id

                        };
                        sucessUser.Add(newPair);
                    }
                }
            }
            catch (Exception e)
            {
                return Ok(new
                {
                    entryStatus = true,
                    failedUser,
                    sucessUser,
                    message = "Failed Response",
                });
            }

            return Ok(new
            {
                entryStatus = true,
                failedUser,
                sucessUser,
                message = "Update Response",
            });
        }

        /// <summary>
        /// Manage Client User Mapping - (As we can change User's Permission for access Designer/Viewer From UI)
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ManageClientUserMapping([FromBody] ManageClientUserMappingVM model)
        {
            if (model == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                bool mappingSuccess;

                var objClint = await _configurationDbContext.Clients.Where(x => x.ClientName == model.ClientName).FirstOrDefaultAsync();
                if (objClint == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = notFoundMSG.messageType, messageCode = notFoundMSG.messageCode, message = string.Format(notFoundMSG.message, "Client") } });
                }

                ClientUserMappingVM newClientUsersMapping = new ClientUserMappingVM()
                {
                    ClientId = objClint.ClientId,
                    UserId = model.UserId
                };

                if (model.toAdd)
                {
                    mappingSuccess = await _iUserRepository.AddClientUserMap(newClientUsersMapping);
                }
                else
                {
                    mappingSuccess = await _iUserRepository.RemoveClientUserMap(newClientUsersMapping);
                }

                if (mappingSuccess)
                {
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, null);
                }
                else
                {
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }
    }
}
