using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Repository;
using FJT.ReportDesigner.Repository.Interface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static FJT.ReportDesigner.Helper.ConstantHelper;
using IdentityModel.Client;
using Microsoft.AspNetCore.Http;

namespace FJT.ReportDesigner.Controllers
{
    public class CustomAuthorizationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            CustomClaim("OnActionExecuted", filterContext.RouteData);
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext filterContext, ActionExecutionDelegate next)
        {
            // assign Token via cookies
            var accessToken = await filterContext.HttpContext.GetTokenAsync("access_token");
            bool isApiCall = false;

            if (accessToken == null)
            {
                var urlPath = string.Empty;
                // assign Token via header
                string authorizationToken = filterContext.HttpContext.Request.Headers["Authorization"];
                // Check it is Api call or not.
                if (filterContext.HttpContext.Request.Path.HasValue)
                {
                    urlPath = filterContext.HttpContext.Request.Path.Value;
                    if (urlPath.Contains("api"))
                    {
                        isApiCall = true;
                    }
                }

                if (authorizationToken == null)
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = filterContext.RouteData.Values["controller"],
                        action = filterContext.RouteData.Values["action"],
                        id = filterContext.RouteData.Values["id"]
                    }));
                }
                else
                {
                    string[] authorsList = authorizationToken.Split(" ");
                    accessToken = authorsList[1];
                }
            }

            if (accessToken != null) //to handle when redirection is not achieved above when token is null
            {
                var userId = filterContext.HttpContext.User.Claims.Count() != 0 ? filterContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value : null;

                // need to make confdioyaion
                HttpClientHandler handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
                };

                HttpClient client = Startup.islocalhost ? new HttpClient(handler) : new HttpClient();

                //var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var urlstring = Startup.IdentityServerURL + ConstantHelper.VALIDATE_CLIENT_USER_MAPPING_URL;
                var obj = new { UserId = userId, Claim = Startup.ClientId };

                var json = JsonConvert.SerializeObject(obj);
                StringContent data = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(urlstring, data);
                var responseModelString = await response.Content.ReadAsStringAsync();
                var apiResponse = (ApiResponse)((Newtonsoft.Json.Linq.JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(responseModelString)).
                        ToObject(typeof(ApiResponse));

                if (apiResponse.status == ConstantHelper.APIState.SUCCESS.ToString())
                {
                    if (apiResponse.apiStatusCode == APIStatusCode.UNAUTHORIZED && !isApiCall)
                    {
                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "LogOut", action = "LogOut" }));
                    }
                    else
                    {
                        if (!isApiCall)
                        {
                            var lastLoginUserId = filterContext.HttpContext.Session.GetString("lastLoginUserId");
                            if (!string.IsNullOrEmpty(lastLoginUserId) && lastLoginUserId != userId)
                            {
                                filterContext.HttpContext.Session.SetInt32("isUserOverridden", 1);
                            }
                            filterContext.HttpContext.Session.SetString("lastLoginUserId", userId);
                        }

                        CustomClaim("OnActionExecuting", filterContext.RouteData);
                        await next();
                    }
                }
                else
                {
                    if (isApiCall)
                    {
                        // Check Error from "checkAutoLogout" Method.
                        if (apiResponse.data != null && apiResponse.data.ToString() == "checkAutoLogout")
                        {
                            CustomClaim("OnActionExecuting", filterContext.RouteData);
                            await next();
                        }
                        else
                        {
                            var dynamicMessageService = (IDynamicMessageService)filterContext.HttpContext.RequestServices.GetService(typeof(IDynamicMessageService));
                            var accessDeniedMSG = await dynamicMessageService.Get(POPUP_ACCESS_DENIED);
                            ApiResponse res = new ApiResponse()
                            {
                                apiStatusCode = APIStatusCode.ERROR,
                                status = APIState.FAILED.GetDisplayValue(),
                                userMessage = new UserMessage { messageContent = new MessageContent { messageType = accessDeniedMSG.messageType, messageCode = accessDeniedMSG.messageCode, message = string.Format(accessDeniedMSG.message, PROJECT_NAME) } }
                            };
                            filterContext.Result = new OkObjectResult(res);
                        }
                    }
                    else
                    {
                        // Check Error from "checkAutoLogout" Method.
                        if (apiResponse.data != null && apiResponse.data.ToString() == "checkAutoLogout")
                        {
                            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "LogOut", action = "LogOut" }));
                        }
                        else
                        {
                            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Authorize", action = "AccessDenied" }));
                        }
                    }
                }
            }
        }

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            CustomClaim("OnResultExecuted", filterContext.RouteData);
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            CustomClaim("OnResultExecuting ", filterContext.RouteData);
        }

        private void CustomClaim(string methodName, RouteData routeData)
        {
            var controllerName = routeData.Values["controller"];
            var actionName = routeData.Values["action"];
            var message = String.Format("{0}- controller:{1} action:{2}", methodName,
                                                                        controllerName,
                                                                        actionName);
        }
    }
}
