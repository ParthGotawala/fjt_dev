using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace FJT.Reporting.Filters
{
    public class CustomAuthorize : AuthorizeAttribute
    {
        private const string BasicAuthResponseHeader = "WWW-Authenticate";
        private const string BasicAuthResponseHeaderValue = "CustomBasic";


        public CustomAuthorize()
        {
        }
        protected CustomPrincipal CurrentUser
        {
            get { return Thread.CurrentPrincipal as CustomPrincipal; }
            set { Thread.CurrentPrincipal = value as CustomPrincipal; }
        }

        // Check request user credentials
        public static Credentials GetCredentialsFromHeader(AuthenticationHeaderValue authHeader)
        {
            if (authHeader != null && !String.IsNullOrWhiteSpace(authHeader.Parameter) && authHeader.Scheme == "CustomBasic")
            {
                string[] credentials = new string[3];
                if (authHeader.Parameter.IndexOf(" ") > 0)
                {
                    credentials = authHeader.Parameter.Split(new[] { ' ' }, 3);
                }

                if (string.IsNullOrEmpty(credentials[0]) || string.IsNullOrEmpty(credentials[1]))
                    return null;

                return new Credentials() { UserId = credentials[0], Token = credentials[1], Userguid = credentials[2] };
            }
            return null;
        }

        // On authorize request
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            try
            {
                AuthenticationHeaderValue authValue = actionContext.Request.Headers.Authorization;
                if (authValue != null && !string.IsNullOrWhiteSpace(authValue.Parameter) && authValue.Scheme == BasicAuthResponseHeaderValue)
                {
                    //Get Header values
                    Credentials parsedCredentials = GetCredentialsFromHeader(authValue);
                    //parsedCredentials.UserId, parsedCredentials.Token, parsedCredentials.Userguid
                    if (parsedCredentials != null)
                    {
                        //Validate Token from user table
                        bool isAuthenticateUser = true;
                        if (isAuthenticateUser)
                        {
                             return;
                        }
                    }
                }
                else if (authValue != null && !string.IsNullOrWhiteSpace(authValue.Parameter))
                {
                    string Token = WebConfigurationManager.AppSettings["Token"].ToString();
                    if (authValue.Parameter == Token)
                    {
                        return;
                    }
                }

                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                actionContext.Response.Headers.Add(BasicAuthResponseHeader, BasicAuthResponseHeaderValue);
                return;

            }
            catch (Exception ex)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                actionContext.Response.Headers.Add(BasicAuthResponseHeader, BasicAuthResponseHeaderValue);
                return;
            }
        }
        public class Credentials
        {
            public string UserId { get; set; }
            public string Token { get; set; }
            public string Userguid { get; set; }
        }

        public class CustomPrincipal : IPrincipal
        {
            public IIdentity Identity { get; private set; }
            public bool IsInRole(string role)
            {
                return true;
            }

            public CustomPrincipal(int UserId)
            {
                this.Identity = new GenericIdentity(UserId.ToString());
            }
        }
    }
}