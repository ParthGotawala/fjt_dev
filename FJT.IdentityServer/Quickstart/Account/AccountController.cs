// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using FJT.IdentityServer;
using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.CryptoJS;
using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Enums;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using FJT.IdentityServer.MongoDbModel;
using FJT.IdentityServer.Quickstart.UI;
using FJT.IdentityServer.Repository;
using FJT.IdentityServer.Repository.Interface;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using static FJT.IdentityServer.Helper.Constant;

namespace IdentityServerHost.Quickstart.UI
{
    /// <summary>
    /// </summary>
    [SecurityHeaders]
    [AllowAnonymous]
    // [EnableCors("_myAllowSpecificOrigins")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IEventService _events;
        private readonly IFJTIdentityDbContext _fjtDBContext;
        private readonly IConfigurationDbContext _configurationDbContext;
        private readonly IUserRepository _iUserRepository;
        private readonly IHttpsResponseRepository _iHttpsResponseRepository;
        private readonly PageURLs _pageURLs;
        private readonly ILogger<AccountController> _logger;
        private readonly IDynamicMessageService _dynamicMessageService;
        private readonly IEmailService _emailService;
        private readonly ITextAngularValueForDB _textAngularValueForDB;

        private string _agreementContent;
        private int? _version;
        private DateTime? _effective;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            IAuthenticationSchemeProvider schemeProvider,
            IEventService events,
            IUserRepository iUserRepository,
            IFJTIdentityDbContext fjtDBContext,
            IHttpsResponseRepository iHttpsResponseRepository,
            IConfigurationDbContext configurationDbContext,
            IOptions<PageURLs> pageURLs,
            ILogger<AccountController> logger,
            IDynamicMessageService dynamicMessageService,
            IEmailService emailService,
            ITextAngularValueForDB textAngularValueForDB)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _interaction = interaction;
            _clientStore = clientStore;
            _schemeProvider = schemeProvider;
            _events = events;
            _fjtDBContext = fjtDBContext;
            _configurationDbContext = configurationDbContext;
            _iUserRepository = iUserRepository;
            _iHttpsResponseRepository = iHttpsResponseRepository;
            _pageURLs = pageURLs.Value;
            _logger = logger;
            _dynamicMessageService = dynamicMessageService;
            _emailService = emailService;
            _textAngularValueForDB = textAngularValueForDB;
        }

        //Delete it
        [HttpGet]
        public IActionResult Index()
        {
            return RedirectToAction("Login");
        }

        /// <summary>
        /// Entry point into the login workflow
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl)
        {
            if (returnUrl == null)
            {
                return Redirect(_pageURLs.UIURL);
            }
            var isAuthenticatedUser = User?.Identity.IsAuthenticated;
            if (isAuthenticatedUser == true)
            {
                var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
                string redirectUri = context.RedirectUri.Contains(_pageURLs.UIURL) ? (context.RedirectUri.Split("#!"))[0] : (context.RedirectUri + "/");
                return Redirect(redirectUri);
            }
            // build a model so we know what to show on the login page
            var vm = await BuildLoginViewModelAsync(returnUrl);

            if (vm.IsExternalLoginOnly)
            {
                // we only have one option for logging in and it's an external provider
                return RedirectToAction("Challenge", "External", new { provider = vm.ExternalLoginScheme, returnUrl });
            }

            return View(vm);
        }

        /// <summary>
        /// Handle postback from username/password login
        /// </summary>
        [HttpPost]
        // [ValidateAntiForgeryToken]     // Temp. comment - for second time login user got 400 Error because of invalid AntiForgeryToken.
        public async Task<IActionResult> Login(LoginInputModel model)
        {
            /* , string button */
            // check if we are in the context of an authorization request
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);
            // the user clicked the "cancel" button
            //if (button != "login")
            //{
            //    if (context != null)
            //    {
            //        // if the user cancels, send a result back into IdentityServer as if they 
            //        // denied the consent (even if this client does not require consent).
            //        // this will send back an access denied OIDC error response to the client.
            //        await _interaction.GrantConsentAsync(context, ConsentResponse.Denied);

            //        //we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non - null
            //        if (await _clientStore.IsPkceClientAsync(context.ClientId))
            //        {
            //            // if the client is PKCE then we assume it's native, so this change in how to
            //            // return the response is for better UX for the end user.
            //            return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
            //        }
            //        return Redirect(model.ReturnUrl);
            //    }
            //    else
            //    {
            //        // since we don't have a valid context, then we just go back to the home page
            //        return Redirect("~/");
            //    }
            //}

            //ViewBag.loginAgreementMSG = await _dynamicMessageService.Get("LOGIN_AGRREMENT_SIGN");
            //ViewBag.provideSignatureMSG = await _dynamicMessageService.Get("PROVIDE_SIGNATURE");

            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Username);
                var result = await _signInManager.UserManager.CheckPasswordAsync(user, model.Password);
                if (result && user.isDeleted == false)
                {
                    if (context != null)
                    {
                        if (await _clientStore.IsPkceClientAsync(context.Client.ClientId))
                        {
                            //var objClint = await _configurationDbContext.Clients.Where(x => x.ClientName == context.Client.ClientId).FirstOrDefaultAsync();
                            //int clientID = objClint != null ? objClint.Id : 0;
                            //int clientID = context.Client != null ? Int32.Parse(context.Client.ClientId) : 0;
                            var clientUSerMapping = await _fjtDBContext.ClientUsersMapping.FirstOrDefaultAsync(x => x.UserId == user.Id && x.ClientId == context.Client.ClientId && x.isDeleted == false);// x.Clients.ClientName == context.ClientId);
                            if (clientUSerMapping == null)
                            {
                                var accessDeniedMSG = await _dynamicMessageService.Get(POPUP_ACCESS_DENIED);
                                await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, string.Format(accessDeniedMSG.message, REQUESTED)));
                                //ModelState.AddModelError(string.Empty, AccountOptions.ClientUserMappingErrorMessage);

                                var loginVM = await BuildLoginViewModelAsync(model);
                                var dynamicMessages = new DynamicMessage() { messageType = ERROR_MSG, message = AccountOptions.ClientUserMappingErrorMessage };
                                ViewBag.dynamicMessage = dynamicMessages;
                                return View(loginVM);
                            }

                            int lastUserSignedAgreementId = await _fjtDBContext.UserAgreement.Where(x => x.userID == clientUSerMapping.UserId && x.isDeleted == false).OrderByDescending(x => x.userAgreementID).Select(x => x.agreementID).FirstOrDefaultAsync();
                            var agreemenTypeId = await _fjtDBContext.AgreementType.Where(x => x.agreementType == USER_SIGNUP_AGREEMENT_TYPE_NAME && x.isDeleted == false).Select(x => x.agreementTypeID).FirstOrDefaultAsync();
                            int letestPublishedAgreementId = await GetLetestPublishedAgreementId(agreemenTypeId);
                            if (lastUserSignedAgreementId != 0 && (lastUserSignedAgreementId == letestPublishedAgreementId))
                            {
                                var userSignIn = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberLogin, lockoutOnFailure: true);
                                await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName));
                                return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                            }
                            else
                            {
                                if (model.AcceptAgreement == true)
                                {
                                    try
                                    {
                                        UserAgreement userAgreement = new UserAgreement()
                                        {
                                            userID = user.Id,
                                            agreementID = letestPublishedAgreementId,
                                            agreedDate = DateTime.UtcNow,
                                            isDeleted = false,
                                            createdBy = user.UserName,
                                            updatedBy = user.UserName,
                                            createdAt = DateTime.UtcNow,
                                            updatedAt = DateTime.UtcNow,
                                            signaturevalue = model.FinalSignature
                                        };
                                        _fjtDBContext.UserAgreement.Add(userAgreement);
                                        await _fjtDBContext.CustomSaveChanges();

                                        var userSignIn = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberLogin, lockoutOnFailure: true);
                                        await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName));
                                        return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                                    }
                                    catch (Exception e)
                                    {
                                        _logger.LogError(e.ToString());
                                        // var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                                        return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = e.Message } });
                                    }
                                }

                                // Bind Dynamic Message.
                                var dynamicMessages = await _dynamicMessageService.Get(LOGIN_AGRREMENT_SIGN);
                                ViewBag.dynamicMessage = dynamicMessages;
                                ViewBag.deleteConfirmMSG = await _dynamicMessageService.Get(DELETE_CONFIRM_MESSAGE);
                                ViewBag.provideSignatureMSG = await _dynamicMessageService.Get(PROVIDE_SIGNATURE);
                                ViewBag.leavePageConfirmationMSG = await _dynamicMessageService.Get(WITHOUT_SAVING_ALERT_BODY_MESSAGE);
                                await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, dynamicMessages.message));
                                model.ShowAcceptAgreementPopUp = true;

                                if (_version == null)
                                {
                                    Agreement agreement = await RetrivePublishedAgreementById(letestPublishedAgreementId);
                                    if (agreement != null)
                                    {
                                        _version = agreement.version;
                                        _agreementContent = agreement.agreementContent;
                                        _effective = agreement.publishedDate;
                                    }
                                }
                                /*here load agreement content*/
                                var loginVM = await BuildLoginViewModelAsync(model);
                                return View(loginVM);
                            }
                        }
                        // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                        return Redirect(model.ReturnUrl);
                    }

                    // request for a local page
                    if (Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else if (string.IsNullOrEmpty(model.ReturnUrl))
                    {
                        return Redirect("~/");
                    }
                    else
                    {
                        // user might have clicked on a malicious link - should be logged
                        throw new Exception(INVALID_RETURN_URL);
                    }
                }
                else
                {
                    // [PP] :Temporary for checking for first time user login 
                    var userTemp = await _userManager.FindByNameAsync(model.Username);
                    if (userTemp != null && !userTemp.passwordHashUpdated)
                    {
                        // [PP] : to verify password for exsisting user in fjt database.
                        bool verifyPasswordDigest = BCrypt.Net.BCrypt.Verify(model.Password, userTemp.userPasswordDigest);
                        if (verifyPasswordDigest)
                        {
                            // [PP] : to genertar password for exsisting user in fjt database.
                            var token = await _userManager.GeneratePasswordResetTokenAsync(userTemp);
                            var resultTest = await _userManager.ResetPasswordAsync(userTemp, token, model.Password);
                            if (resultTest.Succeeded)
                            {
                                userTemp.passwordHashUpdated = true;
                                await _userManager.UpdateAsync(userTemp);
                                // await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials"));
                                await Login(model);
                                //  ModelState.AddModelError(string.Empty, "Please login again due to update in security");
                                return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
                            }
                        }
                    }
                }
                ViewBag.dynamicMessage = await _dynamicMessageService.Get(USER_USERNAME_PASSWORD_INCORRECT);
                await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, AccountOptions.InvalidCredentialsErrorMessage));
                //ModelState.AddModelError(string.Empty, AccountOptions.InvalidCredentialsErrorMessage);
                //var dynamicMessage = new DynamicMessage() { messageType = ERROR_MSG, message = AccountOptions.InvalidCredentialsErrorMessage };
                //ViewBag.dynamicMessage = dynamicMessage;
            }
            var vm = await BuildLoginViewModelAsync(model);
            return View(vm);
        }

        /// <summary>
        /// Show logout page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            // build a model so the logout page knows what to display
            var vm = await BuildLogoutViewModelAsync(logoutId);
            return await Logout(vm);
        }

        /// <summary>
        /// Handle logout page postback
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout(LogoutInputModel model)
        {
            // build a model so the logged out page knows what to display
            var vm = await BuildLoggedOutViewModelAsync(model.LogoutId);

            if (User?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                await HttpContext.SignOutAsync(IdentityServerConstants.DefaultCookieAuthenticationScheme);

                // await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
                await _signInManager.SignOutAsync();

                // raise the logout event
                await _events.RaiseAsync(new UserLogoutSuccessEvent(User.GetSubjectId(), User.GetDisplayName()));
            }

            // check if we need to trigger sign-out at an upstream identity provider
            if (vm.TriggerExternalSignout)
            {
                // build a return URL so the upstream provider will redirect back
                // to us after the user has logged out. this allows us to then
                // complete our single sign-out processing.
                string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

                // this triggers a redirect to the external provider for sign-out
                return SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);
            }

            if (!string.IsNullOrEmpty(vm.PostLogoutRedirectUri))
            {
                ViewBag.returnURL = vm.PostLogoutRedirectUri;
            }
            else
            {
                var referer = Request.Headers["Referer"];
                if (!string.IsNullOrEmpty(referer))
                {
                    var refererString = referer.ToString();
                    PropertyInfo[] propertyInfos = _pageURLs.GetType().GetProperties();
                    ViewBag.returnURL = propertyInfos.Where(x => refererString.Contains(x.GetValue(_pageURLs).ToString())).Select(x => x.GetValue(_pageURLs).ToString()).FirstOrDefault();
                }
                else
                {
                    // Manage case when got referer null. Default Redirect on UI application.
                    ViewBag.returnURL = _pageURLs.UIURL;
                }
            }
            return View("LoggedOut", vm);
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            ForgotPassword forgotPassword = new ForgotPassword();
            return View(forgotPassword);
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPasswordAsync(ForgotPassword forgotPassword)
        {
            try
            {
                MailTemplateVM mailTemplateVM = new MailTemplateVM()
                {
                    AgreementTypeID = (int)AgreementTypeId.ForgotPassword
                };
                List<string> emailList = new List<string>();
                string token = string.Empty;
                string userName = string.Empty;
                bool isUserHaveEmail = false;

                var userByEmail = await _userManager.Users.Where(x => x.Email == forgotPassword.EmailOrUserId && x.isDeleted == false).FirstOrDefaultAsync();
                if (userByEmail == null)
                {
                    var userByUserName = await _userManager.Users.Where(x => x.UserName == forgotPassword.EmailOrUserId && x.isDeleted == false).FirstOrDefaultAsync();
                    if (userByUserName == null)
                    {
                        // ModelState.AddModelError(string.Empty, INVALID_USERNAME_OR_EMAILID);
                        ViewBag.dynamicMessage = await _dynamicMessageService.Get("INVALID_USERNAME_OR_EMAILID");
                        return View(forgotPassword);
                    }

                    token = await _userManager.GeneratePasswordResetTokenAsync(userByUserName);

                    if (userByUserName.Email.IsNullOrEmpty())
                    {
                        userName = userByUserName.UserName;
                        emailList = await _userManager.Users.Where(x => x.isSuperAdmin == true && x.isDeleted == false).Select(x => x.Email).ToListAsync();
                    }
                    else
                    {
                        isUserHaveEmail = true;
                        userName = string.Format(FORGOT_PASSWORD_MAIL_USERNAME_FORMAT, userByUserName.UserName, userByUserName.Email);
                        emailList.Add(userByUserName.Email);
                    }
                }
                else
                {
                    isUserHaveEmail = true;
                    token = await _userManager.GeneratePasswordResetTokenAsync(userByEmail);
                    userName = string.Format(FORGOT_PASSWORD_MAIL_USERNAME_FORMAT, userByEmail.UserName, userByEmail.Email);
                    emailList.Add(userByEmail.Email);
                }

                var tokenEncrypted = CryptoJs.Encrypt(token);
                var encryptedUserName = CryptoJs.Encrypt(userName);
                mailTemplateVM.UserName = userName;
                mailTemplateVM.ToSendEmailsAddress = emailList.ToArray();
                mailTemplateVM.LinkURL = string.Format(FORGOT_PASSWORD_CALLBACK_LINK, _pageURLs.IdentityServerURL, encryptedUserName, tokenEncrypted);

                ResponseVM responseVM = await SendMailTemplate(mailTemplateVM);

                if (responseVM.status == State.SUCCESS.ToString())
                {
                    forgotPassword.SuccessSendEmail = true;
                    forgotPassword.IsUserHaveEmail = isUserHaveEmail;
                    return View(forgotPassword);
                }
                else
                {
                    //ModelState.AddModelError(string.Empty, responseVM.message);
                    var dynamicMessage = new DynamicMessage() { messageType = ERROR_MSG, message = responseVM.message };
                    ViewBag.dynamicMessage = dynamicMessage;
                    return View(forgotPassword);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                // var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                //ModelState.AddModelError(string.Empty, e.Message);
                var dynamicMessage = new DynamicMessage() { messageType = ERROR_MSG, message = e.Message };
                ViewBag.dynamicMessage = dynamicMessage;
                return View(forgotPassword);
            }
        }

        [HttpGet]
        public async Task<IActionResult> ResetUserPassword(string userName, string token)
        {
            if (userName == null || token == null)
            {
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = somethingWrongMSG.message } });
            }
            try
            {
                var usernameWithoutSpace = userName.Replace(" ", "+");
                var decryptedUserName = CryptoJs.DecryptStringAES(usernameWithoutSpace);
                var userNameArray = decryptedUserName.Split(" ");  // we may have Email with USerName So.
                if (userNameArray.Length > 0)
                {
                    userName = userNameArray[0];
                }
                var user = await _userManager.FindByNameAsync(userName);

                var resetPasswordToken = token.Replace(" ", "+");
                var deCreptedToken = CryptoJs.DecryptStringAES(resetPasswordToken);
                var isValidToken = await _userManager.VerifyUserTokenAsync(user, TokenOptions.DefaultProvider, UserManager<ApplicationUser>.ResetPasswordTokenPurpose, deCreptedToken);
                if (!isValidToken)
                {
                    var linkExpiredMSG = await _dynamicMessageService.Get(PASSWORD_RESET_LINK_EXPIRED);
                    return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = linkExpiredMSG.message } });
                }

                ResetUserPasswordVM resetUserPasswordVM = new ResetUserPasswordVM()
                {
                    User = userName,
                    UserToken = deCreptedToken
                };
                return View(resetUserPasswordVM);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                // var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = e.Message } });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ResetUserPassword(ResetUserPasswordVM resetUserPasswordVM)
        {
            if (resetUserPasswordVM == null)
            {
                ViewBag.dynamicMessage = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return View(resetUserPasswordVM);
            }
            try
            {
                var newPassword = resetUserPasswordVM.NewPassword;
                var confirmPassword = resetUserPasswordVM.ConfirmPassword;
                if (newPassword != confirmPassword)
                {
                    //ModelState.AddModelError(string.Empty, PASSWORD_DOSENOT_MATCH);
                    var dynamicMessage = new DynamicMessage() { messageType = ERROR_MSG, message = PASSWORD_DOSENOT_MATCH };
                    ViewBag.dynamicMessage = dynamicMessage;
                    return View(resetUserPasswordVM);
                }

                var user = await _userManager.FindByNameAsync(resetUserPasswordVM.User);
                user.changePasswordAt = Helper.GetDateTime();
                var resultTest = await _userManager.ResetPasswordAsync(user, resetUserPasswordVM.UserToken, resetUserPasswordVM.NewPassword);

                if (!resultTest.Succeeded)
                {
                    // var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = resultTest.Errors.FirstOrDefault().Code } });
                }
                return Redirect(_pageURLs.UIURL);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                // var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return View("Error", new ErrorViewModel() { Error = new ErrorMessage() { Error = "BT_ERR2:" + e.Message } });
            }
        }

        /// <summary>
        /// Update User's Password
        /// </summary>
        [Route("api/[controller]/[action]")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateUserPassword([FromBody] UserPasswordUpdateVM model)
        {
            var decrptNewPassword = CryptoJs.DecryptStringAES(model.NewPassword);
            var decrptConfirmNewPassword = CryptoJs.DecryptStringAES(model.ConfirmNewPassword);
            var decrptuserId = CryptoJs.DecryptStringAES(model.userId);
            var decrptOldPassword = "";
            if (!model.OldPassword.IsNullOrEmpty())
            {
                decrptOldPassword = CryptoJs.DecryptStringAES(model.OldPassword);
            }

            try
            {
                if (decrptNewPassword != decrptConfirmNewPassword)
                {
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { message = PASSWORD_DOSENOT_MATCH });
                }
                else
                {
                    var user = await _userManager.FindByIdAsync(decrptuserId);
                    if (!decrptOldPassword.IsNullOrEmpty())
                    {
                        var authenticateUser = await _signInManager.UserManager.CheckPasswordAsync(user, decrptOldPassword);
                        if (!authenticateUser)
                        {
                            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                        }
                    }
                    user.changePasswordAt = Helper.GetDateTime();
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var resultTest = await _userManager.ResetPasswordAsync(user, token, decrptNewPassword);

                    if (!resultTest.Succeeded)
                    {
                        // Dharam: Pending Need to test and change error message
                        var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                    }

                    var passwwordUpdatedMSG = await _dynamicMessageService.Get(EMPLOYEE_CREDENTIAL_UPDATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = passwwordUpdatedMSG.message });
                }

            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Update User's Password
        /// </summary>
        [Route("api/[controller]/[action]")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateOtherUserPassword([FromBody] OtherUserPasswordUpdateVM model)
        {
            var decrptNewPassword = CryptoJs.DecryptStringAES(model.NewPassword);
            var decrptConfirmNewPassword = CryptoJs.DecryptStringAES(model.ConfirmNewPassword);
            var decrptuserId = CryptoJs.DecryptStringAES(model.userId);
            try
            {
                if (decrptNewPassword != decrptConfirmNewPassword)
                {
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { message = PASSWORD_DOSENOT_MATCH });
                }
                else
                {
                    var user = await _userManager.FindByIdAsync(decrptuserId);
                    user.changePasswordAt = Helper.GetDateTime();
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var resultTest = await _userManager.ResetPasswordAsync(user, token, decrptNewPassword);

                    if (!resultTest.Succeeded)
                    {
                        var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                    }
                    var passwwordUpdatedMSG = await _dynamicMessageService.Get(EMPLOYEE_CREDENTIAL_UPDATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = passwwordUpdatedMSG.message });
                }

            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Add new User
        /// </summary>
        [Route("api/[controller]/[action]")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Register([FromBody] RegisterVM model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ApplicationUser existUser = null;
                    if (!String.IsNullOrEmpty(model.Username))
                    {
                        existUser = await _userManager.FindByNameAsync(model.Username);
                    }
                    if (!String.IsNullOrEmpty(model.Email) && existUser == null)
                    {
                        existUser = await _userManager.FindByEmailAsync(model.Email);
                    }

                    if (existUser == null)
                    {
                        bool existEmail = false;
                        if (model.Email != null)
                        {
                            existEmail = await _fjtDBContext.ApplicationUsers.AnyAsync(x => x.Email == model.Email);
                        }

                        if (!existEmail)
                        {
                            var user = new ApplicationUser
                            {
                                UserName = model.Username,
                                Email = model.Email,
                                passwordHashUpdated = true,
                            };

                            var result = await _userManager.CreateAsync(user, model.Password);
                            if (result.Succeeded)
                            {
                                var objApplicationUser = await _fjtDBContext.ApplicationUsers.FirstOrDefaultAsync(x => x.UserName == model.Username);
                                var userIdentityServerID = objApplicationUser.Id;

                                // Give right to access UI for all registered user
                                var ClientId = await _configurationDbContext.Clients.Where(x => x.ClientId == ClientConstant.Q2CClients.Q2CUI.GetDisplayValue() && x.Enabled == true).Select(x => x.ClientId).FirstOrDefaultAsync();

                                ClientUserMappingVM newClientUsersMapping = new ClientUserMappingVM()
                                {
                                    ClientId = ClientId,
                                    UserId = userIdentityServerID
                                };

                                var mappingSuccess = await _iUserRepository.AddClientUserMap(newClientUsersMapping);

                                var encryptId = CryptoJs.Encrypt(userIdentityServerID);

                                var resObj = new { userID = encryptId };

                                var createdMSG = await _dynamicMessageService.Get(CREATED);
                                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, resObj, new UserMessage() { message = string.Format(createdMSG.message, USER_ENTITY) });
                            }
                            else
                            {
                                var resMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = resMSG.messageType, messageCode = resMSG.messageCode, message = resMSG.message } });
                            }
                        }
                        var existsMSG = await _dynamicMessageService.Get(ALREADY_EXISTS);
                        return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = existsMSG.messageType, messageCode = existsMSG.messageCode, message = string.Format(existsMSG.message, EMAIL) } });
                    }
                    else
                    {
                        if (existUser.isDeleted)
                        {
                            existUser.UserName = model.Username;
                            existUser.Email = model.Email;
                            existUser.passwordHashUpdated = true;
                            existUser.isDeleted = false;

                            var result = await _userManager.UpdateAsync(existUser);
                            var token = await _userManager.GeneratePasswordResetTokenAsync(existUser);
                            var resultTest = await _userManager.ResetPasswordAsync(existUser, token, model.Password);
                            var userIdentityServerID = existUser.Id;


                            ClientUserMappingVM newClientUsersMapping = new ClientUserMappingVM()
                            {
                                ClientId = CLIENT_ID,
                                UserId = userIdentityServerID
                            };

                            var mappingSuccess = await _iUserRepository.AddClientUserMap(newClientUsersMapping);
                            var encryptId = CryptoJs.Encrypt(userIdentityServerID);
                            var resObj = new { userID = encryptId };

                            var userResoteMSG = await _dynamicMessageService.Get(FILE_FOLDER_RESTORE);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, resObj, new UserMessage() { message = string.Format(userResoteMSG.message, USER_ENTITY) });
                        }
                        else
                        {
                            var existsMSG = await _dynamicMessageService.Get(ALREADY_EXISTS);
                            return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = existsMSG.messageType, messageCode = existsMSG.messageCode, message = string.Format(existsMSG.message, existUser.UserName == model.Username ? USER_NAME : EMAIL) } });
                        }
                    }
                }
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        [Route("api/[controller]/[action]")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateUser([FromBody] RegisterVM model)
        {
            if (model == null)
            {
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, null);
            }
            try
            {
                var user = await _userManager.Users.Where(x => x.UserName == model.Username && x.isDeleted == false).FirstOrDefaultAsync();
                var token = await _userManager.GenerateChangeEmailTokenAsync(user, model.Email);
                var result = await _userManager.ChangeEmailAsync(user, model.Email, token);

                if (result.Succeeded)
                {
                    var updatedMSG = await _dynamicMessageService.Get(UPDATED);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = string.Format(updatedMSG.message, USER_ENTITY) });
                }

                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });

            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

        /// <summary>
        /// Remove User
        /// </summary>
        [Route("api/[controller]/[action]")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RemoveUser([FromBody] RemoveUserVM model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
                }
                var result = await _iUserRepository.RemoveUser(model.UserIds);

                if (!result)
                {
                    var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                    return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message } });
                }
                var deletedMSG = await _dynamicMessageService.Get(DELETED);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, null, new UserMessage() { message = string.Format(deletedMSG.message, USER_ENTITY) });
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }


        /*****************************************/
        /* helper APIs for the AccountController */
        /*****************************************/

        /// <summary>
        /// inDEvelopment
        /// </summary>
        /// <param name="mailTemplateVM"></param>
        /// <returns></returns>
        public async Task<ResponseVM> SendMailTemplate(MailTemplateVM mailTemplateVM)
        {
            try
            {
                Agreement agreement = await _fjtDBContext.Agreement.Where(x => x.agreementTypeID == mailTemplateVM.AgreementTypeID && x.isPublished == true && x.isDeleted == false).OrderByDescending(x => x.version).FirstOrDefaultAsync();
                if (agreement == null)
                {
                    var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
                    return new ResponseVM() { status = State.FAILED.ToString(), message = string.Format(notFoundMSG.message, AGREEMENT_ENTITY) };
                }
                var companyLogo = await _fjtDBContext.Systemconfigrations.Where(x => x.key == COMPANY_LOGO_KEY).Select(x => x.values).FirstOrDefaultAsync();

                var mailBody = agreement.agreementContent.Replace(SYSTEM_VARIABLE_USERNAME_HTMLTAG, mailTemplateVM.UserName)
                    .Replace(SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG, COMPANY_NAME)
                    .Replace(SYSTEM_VARIABLE_LINKURL_HTMLTAG, mailTemplateVM.LinkURL)
                    .Replace(SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG, companyLogo)
                    .Replace(SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG, mailTemplateVM.AssemblyName)
                    .Replace(SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG, mailTemplateVM.CustomerCompanyName);

                var mailSubject = agreement.agreementSubject.Replace(SYSTEM_VARIABLE_USERNAME_HTMLTAG, mailTemplateVM.UserName)
                    .Replace(SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG, COMPANY_NAME)
                    .Replace(SYSTEM_VARIABLE_LINKURL_HTMLTAG, mailTemplateVM.LinkURL)
                    .Replace(SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG, companyLogo)
                    .Replace(SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG, mailTemplateVM.AssemblyName)
                    .Replace(SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG, mailTemplateVM.CustomerCompanyName);

                foreach (var email in mailTemplateVM.ToSendEmailsAddress)
                {
                    SendEmailModel emailModel = new SendEmailModel()
                    {
                        To = email,
                        Subject = mailSubject,
                        Body = mailBody,
                        CC = mailTemplateVM.CC,
                        BCC = mailTemplateVM.BCC
                    };
                    _emailService.SendEmail(emailModel);
                }

                return new ResponseVM() { status = State.SUCCESS.ToString() };
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                //  var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return new ResponseVM() { status = State.FAILED.ToString(), message = e.Message };
            }
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            if (context?.IdP != null)
            {
                // this is meant to short circuit the UI and only trigger the one external IdP
                return new LoginViewModel
                {
                    EnableLocalLogin = false,
                    ReturnUrl = returnUrl,
                    Username = context?.LoginHint,
                    ExternalProviders = new ExternalProvider[] { new ExternalProvider { AuthenticationScheme = context.IdP } }
                };
            }

            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null ||
                            (x.Name.Equals(AccountOptions.WindowsAuthenticationSchemeName, StringComparison.OrdinalIgnoreCase))
                )
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;
            if (context?.Client.ClientId != null)
            {
                var client = await _clientStore.FindEnabledClientByIdAsync(context.Client.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;

                    if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
                    {
                        providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
                    }
                }
            }

            return new LoginViewModel
            {
                AllowRememberLogin = AccountOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint,
                ExternalProviders = providers.ToArray()
            };
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            if (model.ShowAcceptAgreementPopUp)
            {
                vm.ShowAcceptAgreementPopUp = model.ShowAcceptAgreementPopUp;
                vm.Password = model.Password;
                vm.Version = _version;
                vm.AgreementContent = _agreementContent;
                vm.Effective = _effective;
            }
            return vm;
        }

        private async Task<LogoutViewModel> BuildLogoutViewModelAsync(string logoutId)
        {
            var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

            if (User?.Identity.IsAuthenticated != true)
            {
                // if the user is not authenticated, then just show logged out page
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            var context = await _interaction.GetLogoutContextAsync(logoutId);
            if (context?.ShowSignoutPrompt == false)
            {
                // it's safe to automatically sign-out
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            // show the logout prompt. this prevents attacks where the user
            // is automatically signed out by another malicious web page.
            return vm;
        }

        private async Task<LoggedOutViewModel> BuildLoggedOutViewModelAsync(string logoutId)
        {
            // get context information (client name, post logout redirect URI and iframe for federated signout)
            var logout = await _interaction.GetLogoutContextAsync(logoutId);

            var vm = new LoggedOutViewModel
            {
                AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
                PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
                ClientName = string.IsNullOrEmpty(logout?.ClientName) ? logout?.ClientId : logout?.ClientName,
                SignOutIframeUrl = logout?.SignOutIFrameUrl,
                LogoutId = logoutId
            };

            if (User?.Identity.IsAuthenticated == true)
            {
                var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
                if (idp != null && idp != IdentityServer4.IdentityServerConstants.LocalIdentityProvider)
                {
                    var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
                    if (providerSupportsSignout)
                    {
                        if (vm.LogoutId == null)
                        {
                            // if there's no current logout context, we need to create one
                            // this captures necessary info from the current logged in user
                            // before we signout and redirect away to the external IdP for signout
                            vm.LogoutId = await _interaction.CreateLogoutContextAsync();
                        }

                        vm.ExternalAuthenticationScheme = idp;
                    }
                }
            }

            return vm;
        }

        /// <summary>
        /// Get Latest Published Agreement Id by agreement TypeId.
        /// </summary>
        /// <param name="agreementTypeID"></param>
        /// <returns></returns>
        public async Task<int> GetLetestPublishedAgreementId(int agreementTypeID)
        {
            int letestPublishedAgreementId = await _fjtDBContext.Agreement.Where(x => x.agreementTypeID == agreementTypeID && x.isPublished == true && x.isDeleted == false).OrderByDescending(x => x.version).Select(x => x.agreementID).FirstOrDefaultAsync();
            return letestPublishedAgreementId;
        }

        /// <summary>
        /// get latest published agreement by agreement id.
        /// </summary>
        /// <param name="agreementID"></param>
        /// <returns></returns>
        public async Task<Agreement> RetrivePublishedAgreementById(int agreementID)
        {
            try
            {
                Agreement agreement = await _fjtDBContext.Agreement.Where(x => x.agreementID == agreementID).FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(agreement.agreementContent))
                {
                    agreement.agreementContent = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementContent);
                    if (agreement.agreementContent == null)
                    {
                        return new Agreement() { };
                    }
                }
                if (!string.IsNullOrEmpty(agreement.agreementSubject))
                {
                    agreement.agreementSubject = _textAngularValueForDB.GetTextAngularValueForDB(agreement.agreementSubject);
                    if (agreement.agreementSubject == null)
                    {
                        return new Agreement() { };
                    }
                }
                return agreement;
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return new Agreement() { };
            }
        }

        [Route("api/[controller]/[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> ValidatePassword([FromBody] RequestUseridPasswordParameterVM model)
        {
            if (model == null)
            {
                var invalidParameterMSG = await _dynamicMessageService.Get(INVALID_PARAMETER);
                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.ERROR, APIState.FAILED, null, new UserMessage() { messageContent = new MessageContent { messageType = invalidParameterMSG.messageType, messageCode = invalidParameterMSG.messageCode, message = invalidParameterMSG.message } });
            }
            try
            {
                bool isMatchPassword = false;
                var userId = CryptoJs.DecryptStringAES(model.userId);
                var password = CryptoJs.DecryptStringAES(model.password);
                var user = await _userManager.FindByIdAsync(userId);
                var result = await _signInManager.UserManager.CheckPasswordAsync(user, password);
                if (result)
                {
                    isMatchPassword = true;
                }

                CommonResponse commonResponse = new CommonResponse()
                {
                    isMatchPassword = isMatchPassword
                };

                return _iHttpsResponseRepository.ReturnResult(APIStatusCode.SUCCESS, APIState.SUCCESS, commonResponse, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return await _iHttpsResponseRepository.ReturnExceptionResponse(e);
            }
        }

    }
}
