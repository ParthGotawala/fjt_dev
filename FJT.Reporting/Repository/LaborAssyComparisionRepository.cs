using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System.Data.Entity.Infrastructure;
using System.Data;
using System.Net.Http;
using System.Net;

namespace FJT.Reporting.Repository
{
    public class LaborAssyComparisionRepository : Repository<SystemConfigrations>, ILaborAssyComparisionRepository
    {
        public LaborAssyComparisionRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }
        public List<LaborAssyDetailModel> GetLaborAssyDetail(LaborAssyRequestModel laborAssyRequestModel, string APIProjectURL)
        {
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();
            string partIds = null;

            if (!string.IsNullOrEmpty(laborAssyRequestModel.pPartIds))
            {
                partIds = laborAssyRequestModel.pPartIds;
            }
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pCustomerID", laborAssyRequestModel.customerID),
                  new MySqlParameter("fromDate", laborAssyRequestModel.fromDate),
                  new MySqlParameter("toDate", laborAssyRequestModel.toDate),
                  new MySqlParameter("pPartIds",partIds)
              };
            List<LaborAssyDetailModel> model = new List<LaborAssyDetailModel>();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetLaborAssyComparisonDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<LaborAssyDetailModel>(reader).OrderBy(x => x.quoteInDate).ThenBy(x => x.AssyName).ToList();

                return model;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public LaborComparisonEsimatedvsActualDetail GetLaborComparisonEstimatedvsActualDetail(LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel, string APIProjectURL)
        {
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();
            MySqlParameter[] parameters = new MySqlParameter[] {
                new MySqlParameter("pAssyID", laborComparisonEstimatedvsActualRequestModel.assyID),
                  new MySqlParameter("pEmployeeID", laborComparisonEstimatedvsActualRequestModel.loginUserEmployeeID)
            };
            LaborComparisonEsimatedvsActualDetail model = new LaborComparisonEsimatedvsActualDetail();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetLaborComparisonActualvsEstimatedReportDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.LaborComparisonEsimatedvsActualDet = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<LaborComparisonEsimatedvsActualDet>(reader).OrderBy(x => x.sid).ToList();
                reader.NextResult();
                model.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();

                return model;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}