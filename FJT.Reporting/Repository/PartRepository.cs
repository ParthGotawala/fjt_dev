using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;

namespace FJT.Reporting.Repository
{
    public class PartRepository : Repository<SystemConfigrations>, IPartRepository
    {
        public PartRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public PartUsageDetailMain GetPartUsageDetails(PartUsageRequestModel partUsageRequestModel)
        {
            string _PartID = null;
            if (!string.IsNullOrEmpty(partUsageRequestModel.partID))
            {
                _PartID = partUsageRequestModel.partID;
            }

            
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pPartIDs",_PartID),
                  new MySqlParameter("pChildDetail",false),
                  new MySqlParameter("pfromDate", partUsageRequestModel.fromDate),
                  new MySqlParameter("ptoDate", partUsageRequestModel.toDate),
              };

            PartUsageDetailMain objPartUsageDetailMain = new PartUsageDetailMain();
            
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_getPartUsageReportDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                objPartUsageDetailMain.partUsageDet = ((IObjectContextAdapter)Context).ObjectContext.Translate<PartUsageDet>(reader).ToList();

                //reader.NextResult();
                //objPartUsageDetailMain.assyWisePartUsageDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<AssyWisePartUsageDetail>(reader).ToList();

                //reader.NextResult();
                //objPartUsageDetailMain.monthWisePartUsageDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<MonthWisePartUsageDetail>(reader).ToList();

                return objPartUsageDetailMain;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return objPartUsageDetailMain;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public PartUsageDetailMain GetPartWiseUsageDetails(string ppartID, PartUsageRequestModel partUsageRequestModel)
        {
            string _PartID = null;
            if (!string.IsNullOrEmpty(ppartID))
            {
                _PartID = ppartID;
            }


            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pPartIDs",_PartID),
                  new MySqlParameter("pChildDetail",true),
                  new MySqlParameter("pfromDate", partUsageRequestModel.fromDate),
                  new MySqlParameter("ptoDate", partUsageRequestModel.toDate),
              };

            PartUsageDetailMain objPartUsageDetailMain = new PartUsageDetailMain();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_getPartUsageReportDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                objPartUsageDetailMain.partUsageDet = ((IObjectContextAdapter)Context).ObjectContext.Translate<PartUsageDet>(reader).ToList();

                reader.NextResult();
                objPartUsageDetailMain.assyWisePartUsageDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<AssyWisePartUsageDetail>(reader).ToList();

                reader.NextResult();
                objPartUsageDetailMain.monthWisePartUsageDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<MonthWisePartUsageDetail>(reader).ToList();

                return objPartUsageDetailMain;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return objPartUsageDetailMain;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}