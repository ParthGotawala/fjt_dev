using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data.Interface
{
    public interface IFJTIdentityDbContext 
    {
        DbSet<ClientUsersMapping> ClientUsersMapping { get; set; }
        DbSet<ApplicationUser> ApplicationUsers { get; set; } 
        DbSet<ApiScope> ApiScopes { get; set; }
        DbSet<ClientScope> ClientScopes { get; set; }

        DbSet<Agreement> Agreement { get; set; }
        DbSet<AgreementType> AgreementType { get; set; }
        DbSet<UserAgreement> UserAgreement { get; set; }
        DbSet<Systemconfigrations> Systemconfigrations { get; set; }
        Task CustomSaveChanges();
    }
}
