using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using FJT.ReportViewer.AppSettings;
using FJT.ReportViewer.Helper;
using FJT.ReportViewer.MySqlDBModel;
using FJT.ReportViewer.Repository;
using FJT.ReportViewer.Repository.Interface;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace FJT.ReportViewer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public static string IdentityServerURL { get; set; }
        public static string ClientId { get; set; }
        public static bool islocalhost { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var constantPath = Configuration.GetSection(nameof(ConstantPath));
            var identityserverConfig = Configuration.GetSection("identityserverConfig");
            Startup.IdentityServerURL = constantPath.GetValue(typeof(string), "identityserverURL").ToString();
            Startup.ClientId = identityserverConfig.GetValue(typeof(string), "ClientId").ToString();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
            services.AddControllersWithViews();

            string mySqlConnectionStr = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContextPool<FJTSqlDBContext>(options => options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr)));

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(5);//You can set Time   
            });

            #region appsettings.json      
            services.Configure<ConstantPath>(Configuration.GetSection(nameof(ConstantPath)));
            services.Configure<ConnectionStrings>(Configuration.GetSection(nameof(ConnectionStrings)));
            services.Configure<MongoDBConfig>(Configuration.GetSection(nameof(MongoDBConfig)));
            services.Configure<IdentityserverConfig>(Configuration.GetSection(nameof(IdentityserverConfig)));
            #endregion

            services.AddScoped<IMongoDBContext, MongoDBContext>();
            services.AddScoped<IDynamicMessageService, DynamicMessageService>();
            services.AddScoped<IHttpsResponseRepository, HttpsResponseRepository>();

            #region IdentityServer Authentication
            Startup.islocalhost = (bool)Configuration.GetValue(typeof(bool), "isLocalHost");
            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    if (islocalhost)
                    {
                        options.BackchannelHttpHandler = new HttpClientHandler { ServerCertificateCustomValidationCallback = delegate { return true; } };
                    }
                    options.Authority = constantPath.GetValue(typeof(string), "identityserverURL").ToString();
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = false
                    };
                });

            var identityserverURL = constantPath.GetValue(typeof(string), "identityserverURL").ToString();
            var clientId = identityserverConfig.GetValue(typeof(string), "ClientId").ToString();
            var clientSecret = identityserverConfig.GetValue(typeof(string), "ClientSecret").ToString();
            var authenticationScheme = identityserverConfig.GetValue(typeof(string), "AuthenticationScheme").ToString();
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = authenticationScheme;
                options.DefaultChallengeScheme = ConstantHelper.AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME;
            }).AddCookie(authenticationScheme, options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(30);
                options.SlidingExpiration = true;
                options.SessionStore = new MemoryCacheTicketStore();
            })
                .AddOpenIdConnect(ConstantHelper.AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME, options =>
                {
                    if (islocalhost)
                    {
                        options.BackchannelHttpHandler = new HttpClientHandler { ServerCertificateCustomValidationCallback = delegate { return true; } };
                    }
                    options.Authority = identityserverURL;
                    options.ClientId = clientId;
                    options.ClientSecret = clientSecret;

                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.ClaimActions.MapUniqueJsonKey("name", "STUARTZZ");

                    options.ResponseType = "code";
                    options.UsePkce = true;
                    options.CallbackPath = "/Viewer/Index"; // default redirect URI
                    options.Scope.Add("openid");
                    options.Scope.Add("profile");
                    options.Scope.Add("Q2CReportViewer");
                    options.Scope.Add("IdentityServerAPI");
                    options.Scope.Add("offline_access");
                    options.SignedOutCallbackPath = "/Viewer/";
                    options.SaveTokens = true;
                    options.Events = new OpenIdConnectEvents
                    {
                        // that event is called after the OIDC middleware received the auhorisation code,
                        // redeemed it for an access token and a refresh token,
                        // and validated the identity token
                        OnTokenValidated = x =>
                        {
                            // store both access and refresh token in the claims - hence in the cookie
                            var identity = (ClaimsIdentity)x.Principal.Identity;
                            identity.AddClaims(new[]
                            {
                                new Claim("access_token", x.TokenEndpointResponse.AccessToken),
                                new Claim("refresh_token", x.TokenEndpointResponse.RefreshToken)
                            });

                            // so that we don't issue a session cookie but one with a fixed expiration
                            x.Properties.IsPersistent = true;
                            return Task.CompletedTask;
                        }
                    };
                });
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Viewer/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseSession();

            app.UseRequestLocalization();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Viewer}/{action=Index}/{id?}");
            });
        }
    }
}
