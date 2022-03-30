// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using FJT.IdentityServer.Data;
using FJT.IdentityServer.Data.Seed;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System;

namespace FJT.IdentityServer
{

    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
            var host = CreateWebHostBuilder(args).Build();
            var config = host.Services.GetRequiredService<IConfiguration>();
            var connectionString = config.GetConnectionString("DefaultConnection");
            IConfigurationSection dbNames = config.GetSection("DatabaseNames");

                Log.Logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            //.MinimumLevel.Debug()
            .WriteTo.File("Log/Mylog.txt")
            //.WriteTo.Seq("http://localhost:5341")
            .CreateLogger();
          
                Log.Information("Starting up");
                Console.Title = "IdentityServer4";
              
                bool seed = config.GetSection("Data").GetValue<bool>("Seed");
                if (seed)
                {                    
                    Users.EnsureSeedData(connectionString);
                }

                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    var context = services.GetRequiredService<FJTIdentityDbContext>();
                    // DbInitialize.Initialize(context, dbNames);
                }

                host.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
            }
            finally
            {
                Log.CloseAndFlush();
            }
            Log.Logger.Information("This informational message will be written to MySQL database");

        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                    .UseSerilog()
                    .UseStartup<Startup>()
                    .UseSerilog((context, configuration) =>
                    {
                        configuration
                            .MinimumLevel.Debug()
                            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                            .MinimumLevel.Override("System", LogEventLevel.Warning)
                            .MinimumLevel.Override("Microsoft.AspNetCore.Authentication", LogEventLevel.Information)
                            .Enrich.FromLogContext()
                            .WriteTo.File(@"identityserver4_log.txt")
                            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}", theme: AnsiConsoleTheme.Literate);
                    });
        }
    }
}