using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data
{
    public class FJTIdentityDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>, IFJTIdentityDbContext
    {
        public FJTIdentityDbContext(DbContextOptions<FJTIdentityDbContext> options)
            : base(options)
        {
        }


        public DbSet<ClientUsersMapping> ClientUsersMapping { get; set; }
        public DbSet<Feature> Feature { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<ApiScope> ApiScopes { get; set; }
        public DbSet<ClientScope> ClientScopes { get; set; }

        public DbSet<Agreement> Agreement { get; set; }
        public DbSet<AgreementType> AgreementType { get; set; }
        public DbSet<UserAgreement> UserAgreement { get; set; }
        public DbSet<Systemconfigrations> Systemconfigrations { get; set; }

        public async Task CustomSaveChanges()
        {
            await this.SaveChangesAsync();
        }

        public virtual void ExecuteSqlCommand(string sql, params object[] parameters)
        {
            this.Database.ExecuteSqlCommand(sql, parameters);
        }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Systemconfigrations>(entity => {
                entity.HasIndex(e => e.key).IsUnique();
            });

            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
