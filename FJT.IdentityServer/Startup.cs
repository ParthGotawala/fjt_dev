// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.Data;
using FJT.IdentityServer.Data.DataMapper;
using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Data.Seed;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.ManualDbConnection;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Repository;
using FJT.IdentityServer.Repository.Interface;
using FJT.IdentityServer.Services;
using IdentityServer4.Configuration;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;

namespace FJT.IdentityServer
{
    public class Startup
    {
        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Environment = environment;
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var queueSettingsConfig = Configuration.GetSection("QueueSettings");

            // uncomment, if you wan to add an MVC-based UI
            //services.AddMvc().SetCompatibilityVersion(Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_2_1);
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    });
            });

            services.AddControllersWithViews().AddJsonOptions(jsonOptions =>
            {
                //jsonOptions.SerializerSettings.ContractResolver = new DefaultContractResolver();
                jsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null;
            });

            string connectionString = Configuration.GetConnectionString("DefaultConnection");
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddDbContext<FJTIdentityDbContext>(options =>
                options.UseMySql(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly))
            );

            #region  Dependency Injection
            services.AddScoped<IFJTIdentityDbContext, FJTIdentityDbContext>();
            services.AddScoped<IFJTIdentityManualConnection, FJTIdentityManualConnection>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IHttpsResponseRepository, HttpsResponseRepository>();
            services.AddScoped<IDbRepository, DbReository>();
            services.AddScoped<IDataMapper, DataMapper>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ITextAngularValueForDB, TextAngularValueForDB>();
            services.AddScoped<IMongoDBContext, MongoDBContext>();
            services.AddScoped<IDynamicMessageService, DynamicMessageService>();
            #endregion

            #region  appsettings.json
            var pageURLs = Configuration.GetSection(nameof(PageURLs));
            services.Configure<PageURLs>(pageURLs);
            services.Configure<QueueSettings>(Configuration.GetSection(nameof(QueueSettings)));
            services.Configure<ConnectionStrings>(Configuration.GetSection(nameof(ConnectionStrings)));
            services.Configure<MongoDBConfig>(Configuration.GetSection(nameof(MongoDBConfig)));
            #endregion 

            #region Configure IdentityServer & JWT Token Authentication
            bool islocalhost = (bool)Configuration.GetValue(typeof(bool), "isLocalHost");
            services.AddAuthentication("Bearer")
            .AddJwtBearer("Bearer", options =>
            {
                if (islocalhost)
                {
                    options.BackchannelHttpHandler = new HttpClientHandler { ServerCertificateCustomValidationCallback = delegate { return true; } };
                }
                options.Authority = pageURLs.GetValue(typeof(string), "IdentityServerURL").ToString();
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false
                };
            });

            services.AddDefaultIdentity<ApplicationUser>()
                .AddRoles<ApplicationRole>()
                .AddEntityFrameworkStores<FJTIdentityDbContext>();
            var builder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
                options.UserInteraction.LoginUrl = "/Account/Login";
                options.UserInteraction.LogoutUrl = "/Account/Logout";
                options.Authentication = new AuthenticationOptions()
                {
                    CookieLifetime = TimeSpan.FromDays(30),
                    CookieSlidingExpiration = true,
                    CheckSessionCookieName = (string)Configuration.GetValue(typeof(string), "SessionCookieName")
                };

            }).AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = b => b.UseMySql(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
            })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseMySql(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
                    options.EnableTokenCleanup = true;
                })
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<ProfileService>();
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = (string)Configuration.GetValue(typeof(string), "AuthenticationCookieName");
            });
            #endregion

            if (Environment.IsDevelopment())
            {
                builder.AddDeveloperSigningCredential();
            }
            else
            {
                string certificateThumbPrint = Configuration.GetValue(typeof(string), "certificateThumbPrint").ToString();
                builder.AddSigningCredential(CertificateHelper.LoadCertificateByThumbPrint(certificateThumbPrint));
            }
            IdentityModelEventSource.ShowPII = true;
        }

        public void Configure(IApplicationBuilder app)
        {
            // this will do the initial DB population
            bool seed = Configuration.GetSection("Data").GetValue<bool>("Seed");
            if (seed)
            {
                InitializeDatabase(app);
                throw new Exception("Seeding completed. Disable the seed flag in appsettings");
            }

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCookiePolicy();

            // uncomment if you want to support static files
            app.UseStaticFiles();
            app.UseRouting();

            app.UseIdentityServer();
            app.UseCors(MyAllowSpecificOrigins);

            // uncomment, if you wan to add an MVC-based UI
            //app.UseMvcWithDefaultRoute();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();

                var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
                context.Database.Migrate();
                if (!context.Clients.Any())
                {
                    foreach (var client in Config.GetClients())
                    {
                        context.Clients.Add(client.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.IdentityResources.Any())
                {
                    foreach (var resource in Config.GetIdentityResources())
                    {
                        context.IdentityResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.ApiScopes.Any())
                {
                    foreach (var scope in Config.GetApiScopes())
                    {
                        context.ApiScopes.Add(scope.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.ApiResources.Any())
                {
                    foreach (var resource in Config.GetApis())
                    {
                        context.ApiResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }
            }
        }

    }
}
