using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;

namespace FJT.Reporting
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);
            config.Routes.MapHttpRoute(
                name: "DefaultActionApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            string AllowOrigins = ConfigurationManager.AppSettings["AllowOrigins"];
            var cors = new EnableCorsAttribute(AllowOrigins, "*", "*");
            config.EnableCors(cors);
        }
    }
}
