using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using System;
using System.Net;

namespace FJT.ReportDesigner.Controllers
{
    [AttributeUsage(AttributeTargets.Class)]
    public class DeveloperAuthorizationAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext filterContext)
        {
            if (Startup.IsDevelopmentMode)
            {
                return;
            }
            else
            {                
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                filterContext.Result = new Microsoft.AspNetCore.Mvc.RedirectToRouteResult(new RouteValueDictionary(new { controller = "Authorize", action = "NotFound" }));
            }
        }
    }
}
