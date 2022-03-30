using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FJT.ReportViewer.AppSettings;
using FJT.ReportViewer.Helper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FJT.ReportViewer.Controllers
{
    [AllowAnonymous]
    public class LogOutController : Controller
    {
        private readonly IdentityserverConfig _identityserverConfig;
        public LogOutController(IOptions<IdentityserverConfig> identityserverConfig)
        {
            _identityserverConfig = identityserverConfig.Value;
        }
        public IActionResult LogOut()
        {
            return new SignOutResult(new[] { _identityserverConfig.AuthenticationScheme, ConstantHelper.AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME });
        }

        public IActionResult SignoutCleanup(string sid)
        {
            var claims = User as ClaimsPrincipal;
            var sidClaim = claims.FindFirst("sid");
            if (sidClaim != null && sidClaim.Value == sid)
            {
                HttpContext.SignOutAsync(_identityserverConfig.AuthenticationScheme);
                // Request.Authentication.SignOut(ConstantHelper.AUTHENTICATION_DEFAULT_SCHEME);
                foreach (var cookie in Request.Cookies.Keys)
                {
                    Response.Cookies.Delete(cookie);
                }
            }
            HttpContext.Session.Remove("isUserOverridden");
            //return RedirectToAction("UserLoggedOut");
            return Content(string.Empty);
        }
    }
}
