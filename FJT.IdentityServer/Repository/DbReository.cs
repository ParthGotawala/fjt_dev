using FJT.IdentityServer.Data;
using FJT.IdentityServer.Data.DataMapper;
using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Models.ViewModel;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository
{
    public class DbReository : IDbRepository
    {
        private readonly IFJTIdentityManualConnection _iFJTIdentityManualConnection;
        private readonly IDataMapper _idataMapper;

        public DbReository(IFJTIdentityManualConnection iFJTIdentityManualConnection, IDataMapper idataMapper)
        {
            _iFJTIdentityManualConnection = iFJTIdentityManualConnection;
            _idataMapper = idataMapper;
        }

        public async Task<AgreementListDetails> AgreementListAsync(string sql, MySqlParameter[] parameters)
        {
            AgreementListDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.AgreementListDetailsMapper, sql, parameters);
            return results;
        }

        public async Task<GetAgreementDetailDetails> GetAgreementDetailsListAsync(string sql, MySqlParameter parameter)
        {
            GetAgreementDetailDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.GetAgreementDetailDetailsMapper, sql, parameter);
            return results;
        }

        public async Task<UserSignUpAgreementListDetails> UserSignUpAgreementListAsync(string sql, MySqlParameter[] parameters)
        {
            UserSignUpAgreementListDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.UserSignUpAgreementListDetailsMapper, sql, parameters);
            return results;
        }

        public async Task<ArchieveVersionDetailsListDetails> ArchieveVersionDetailsListAsync(string sql, MySqlParameter[] parameters)
        {
            ArchieveVersionDetailsListDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.ArchieveVersionDetailsListDetailsMapper, sql, parameters);
            return results;
        }

        public async Task<GetAgreedUserListVMDetails> GetAgreedUserListAsync(string sql, MySqlParameter[] parameters)
        {
            GetAgreedUserListVMDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.GetAgreedUserListVMDetailsMapper, sql, parameters);
            return results;
        }

        public async Task<DownloadAgreementDetailsVMDetails> DownloadAgreementDetailsAsync(string sql, MySqlParameter[] parameters)
        {
            DownloadAgreementDetailsVMDetails results = await _iFJTIdentityManualConnection.ExecuteReaderAsync(_idataMapper.DownloadAgreementDetailsVMDetailsMapper, sql, parameters);
            return results;
        }

    }
}

