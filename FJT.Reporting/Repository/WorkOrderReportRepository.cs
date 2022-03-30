using FJT.Reporting.Constant;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
namespace FJT.Reporting.Repository
{
    public class WorkOrderReportRepository : Repository<SystemConfigrations>, IWorkOrderReportRepository
    {
        public WorkOrderReportRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public WorkOrderReportDet GetWorkOrderDetails(WorkOrderRequestModel workOrderRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pid",workOrderRequestModel.id)
               };
            WorkOrderReportDet model = new WorkOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetWorkOrderReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.CompanyDetails=((IObjectContextAdapter)Context)
                .ObjectContext
                .Translate<Company_Detail>(reader).ToList();
                reader.NextResult();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}