using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using System;
using FJT.Reporting.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Collections;

namespace FJT.Reporting.Repository
{

    public class CreditMemoRepository : Repository<SystemConfigrations>, ICreditMemoRepository
    {
        public CreditMemoRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public CreditMemoResponseModel GetCreditMemoDetails(CreditMemoRequestModel creditMemoRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("cpID",creditMemoRequestModel.id)
               };
            CreditMemoResponseModel model = new CreditMemoResponseModel();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCreditMemoReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.CreditMemoMst = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CreditMemoMst>(reader).ToList();
                reader.NextResult();
                model.CreditMemoDet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CreditMemoDet>(reader).ToList();
                reader.NextResult();
                model.CreditMemoTotalCharges = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CreditMemoTotalCharges>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}