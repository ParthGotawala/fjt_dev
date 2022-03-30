using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace FJT.Reporting.Repository
{
    public class ObsoletePartReportRepository : Repository<SystemConfigrations>, IObsoletePartReportRepository
    {
        public ObsoletePartReportRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public ObsolatePartDet GetObsolatePartDetails(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            string _CustomerID = null;
            string _whereclause = null;
            if (!string.IsNullOrEmpty(obsoletePartRequestModel.customerID))
            {
                _CustomerID = obsoletePartRequestModel.customerID;
            }
            if (!string.IsNullOrEmpty(obsoletePartRequestModel.whereClause))
            {
                _whereclause = obsoletePartRequestModel.whereClause;
            }
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pCustomerID", _CustomerID),
                  new MySqlParameter("pWhereClause", _whereclause),
                  new MySqlParameter("pWithAlternateParts", obsoletePartRequestModel.withAlternateParts),
                  new MySqlParameter("pAssyId", obsoletePartRequestModel.assyID)
              };

            ObsolatePartDet model = new ObsolatePartDet();
            string additionalNote;

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetObsoletePartDetailReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.obsoletePartDetails = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<ObsolatePartDetail>(reader).OrderBy(x => x.Customer).ThenBy(x => x.AssyPN).ToList();

                reader.NextResult();
                model.CompanyDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<Company_Detail>(reader).ToList();

                reader.NextResult();
                model.additionalNotes = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<string>(reader).FirstOrDefault();

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

        public ObsolatePartDet GetObsolatePartCSVDetails(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            string _CustomerID = null;
            string _whereclause = null;
            if (!string.IsNullOrEmpty(obsoletePartRequestModel.customerID))
            {
                _CustomerID = obsoletePartRequestModel.customerID;
            }
            if (!string.IsNullOrEmpty(obsoletePartRequestModel.whereClause))
            {
                _whereclause = obsoletePartRequestModel.whereClause;
            }
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pCustomerID", _CustomerID),
                  new MySqlParameter("pWhereClause", _whereclause),
                  new MySqlParameter("pWithAlternateParts", obsoletePartRequestModel.withAlternateParts),
                  new MySqlParameter("pAssyId", obsoletePartRequestModel.assyID)
              };

            ObsolatePartDet model = new ObsolatePartDet();
            string additionalNote;

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetObsoletePartDetailforCSVReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.obsoletePartDetails = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<ObsolatePartDetail>(reader).OrderBy(x => x.Customer).ThenBy(x => x.AssyPN).ToList();


                reader.NextResult();
                model.RohsPartDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RohsPartDetailViewModel>(reader).ToList();

                reader.NextResult();
                model.additionalNotes = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<string>(reader).FirstOrDefault();

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

        public ObsolatePartDet GetAlternatePartDetails(int pmfgPnId, int pLineItemID, string radioFilterValue)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pmfgPnID",pmfgPnId),
                  new MySqlParameter("plinrItemId",pLineItemID),
                  new MySqlParameter("pradioFilterValue",radioFilterValue)
              };

            ObsolatePartDet obsolatePartDet = new ObsolatePartDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetActiveAlternaterPartsforObsoletepartReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                obsolatePartDet.alternatePartDetForObsoletePartReportDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<alternatePartDetForObsoletePartReportModel>(reader).ToList();
                return obsolatePartDet;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return obsolatePartDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public ObsolatePartDet GetRohsPartDetails(int pmfgPnId, int pLineItemID, string radioFilterValue)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pmfgPnID",pmfgPnId),
                  new MySqlParameter("plinrItemId",pLineItemID),
                  new MySqlParameter("pradioFilterValue",radioFilterValue)
              };

            ObsolatePartDet obsolatePartDet = new ObsolatePartDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetActiveRohsAlternatePartsforObsoletepartReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                obsolatePartDet.rohsPartDetForObsoletePartReportDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<rohsPartDetForObsoletePartReportModel>(reader).ToList();
                return obsolatePartDet;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return obsolatePartDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public ObsolatePartDet GetAssemblyManualPartDetail(int partID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("ppartID",partID)
              };

            ObsolatePartDet obsolatePartDet = new ObsolatePartDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetActiveManualPartDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                obsolatePartDet.assemblyManualPartDetailViewModel = ((IObjectContextAdapter)Context).ObjectContext.Translate<AssemblyManualPartDetailViewModel>(reader).ToList();
                return obsolatePartDet;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return obsolatePartDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        /// <summary>
        /// Fetch Reversal Part Details Report
        /// </summary>
        /// <param name="reversalPartRequestModel"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns>ReversalPartDet</returns>
        public ReversalPartDet GetReversalPartDetails(ReversalPartRequestModel reversalPartRequestModel, string APIProjectURL)
        {
            string _CustomerID = null;
            string _whereclause = null;
            if (!string.IsNullOrEmpty(reversalPartRequestModel.customerID))
            {
                _CustomerID = reversalPartRequestModel.customerID;
            }
            if (!string.IsNullOrEmpty(reversalPartRequestModel.whereClause))
            {
                _whereclause = reversalPartRequestModel.whereClause;
            }
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pCustomerID", _CustomerID),
                  new MySqlParameter("pWhereClause", _whereclause),
                  new MySqlParameter("pWithAlternateParts", reversalPartRequestModel.withAlternateParts)
              };

            ReversalPartDet model = new ReversalPartDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetReversalPartDetailReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.reversalPartDetail = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<ReversalPartDetail>(reader).OrderBy(x => x.Customer).ThenBy(x => x.AssyPN).ToList();

                reader.NextResult();
                model.CompanyDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<Company_Detail>(reader).ToList();

                return model;
            }
            catch (Exception)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        /// <summary>
        /// Get Obsolete Part Details For Company
        /// </summary>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns>ObsoletePartDetForCompany</returns>
        public ObsoletePartDetForCompany GetObsoletePartDetailsForCompany(ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest, string APIProjectURL)
        {
            string _CustomerID = null;
            string _whereclause = null;
            if (!string.IsNullOrEmpty(obsoletePartForCompanyRequest.customerID))
            {
                _CustomerID = obsoletePartForCompanyRequest.customerID;
            }
            if (!string.IsNullOrEmpty(obsoletePartForCompanyRequest.whereClause))
            {
                _whereclause = obsoletePartForCompanyRequest.whereClause;
            }
            var desclaimer = this.Context.SystemConfigrations.Where(a => a.key == "Report-Disclaimer").Select(a => a.values).FirstOrDefault();

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pCustomerID", _CustomerID),
                  new MySqlParameter("pWhereClause", _whereclause),
                  new MySqlParameter("pWithAlternateParts", obsoletePartForCompanyRequest.withAlternateParts),
                  new MySqlParameter("pFromDate", obsoletePartForCompanyRequest.fromdate),
                  new MySqlParameter("pToDate", obsoletePartForCompanyRequest.todate)
              };

            ObsoletePartDetForCompany model = new ObsoletePartDetForCompany();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetObsoletePartDetailForCompanyReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.obsoletePartDetailForCompany = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<ObsoletePartDetailForCompany>(reader).OrderBy(x => x.Customer).ThenBy(x => x.AssyPN).ToList();

                reader.NextResult();
                model.CompanyDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<Company_Detail>(reader).ToList();

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