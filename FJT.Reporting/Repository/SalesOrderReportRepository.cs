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
    public class SalesOrderReportRepository : Repository<SystemConfigrations>, ISalesOrderReportRepository
    {
        public SalesOrderReportRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public SalesOrderReportDet GetSalesOrderDetails(SalesOrderRequestModel salesOrderRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pid",salesOrderRequestModel.id)
               };
            SalesOrderReportDet model = new SalesOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetSalesOrderReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.SalesOrderMstDets = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<SalesOrderMstDet>(reader).ToList();
                reader.NextResult();
                model.SalesOrderDets = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<SalesOrderDet>(reader).ToList();
                reader.NextResult();
                model.SalesOrderTotalChargesDet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<SalesOrderTotalChargesDet>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetSalesOrderSubDetails(int pSDetID, SalesOrderRequestModel salesOrderRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pSDetID",pSDetID),
               };
            SalesOrderReportDet model = new SalesOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetSalesOrderShippingReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.SalesShippingMstDets = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<SalesShippingMstDet>(reader).ToList();
                return model.SalesShippingMstDets;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetSalesOrderOtherChargesSubDetails(int pSDetID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pSDetID",pSDetID),
               };
            SalesOrderReportDet model = new SalesOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetSalesOrderOtherChargesReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.SalesOrderDets = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<SalesOrderDet>(reader).ToList();
                return model.SalesOrderDets;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}