using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using Microsoft.Data.SqlClient;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository.Interface
{
    public interface IDbRepository
    {
        Task<AgreementListDetails> AgreementListAsync(string sql, MySqlParameter[] parameters);
        Task<GetAgreementDetailDetails> GetAgreementDetailsListAsync(string sql, MySqlParameter parameter);
        Task<UserSignUpAgreementListDetails> UserSignUpAgreementListAsync(string sql, MySqlParameter[] parameters);
        Task<ArchieveVersionDetailsListDetails> ArchieveVersionDetailsListAsync(string sql, MySqlParameter[] parameters);
        Task<GetAgreedUserListVMDetails> GetAgreedUserListAsync(string sql, MySqlParameter[] parameters);
        Task<DownloadAgreementDetailsVMDetails> DownloadAgreementDetailsAsync(string sql, MySqlParameter[] parameters);
    }
}
