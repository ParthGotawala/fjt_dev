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
    public class PurchaseOrderRepository : Repository<SystemConfigrations>, IPurchaseOrderRepository
    {
        public PurchaseOrderRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public PurchaseOrderReportDet GetPurchaseOrderDetails(PurchaseOrderRequestModel purchaseOrderRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pid",purchaseOrderRequestModel.id)
               };
            PurchaseOrderReportDet model = new PurchaseOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetPurchaseOrderReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.PurchaseOrderMstDets = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<PurchaseOrderMstDet>(reader).ToList();
                reader.NextResult();
                model.PurchaseOrderDets = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<PurchaseOrderDet>(reader).ToList();
                reader.NextResult();
                model.PurchaseOrderTotalChargesDet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<PurchaseOrderTotalChargesDet>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetPurchaseOrderDetSubDetails(int poDetID, PurchaseOrderRequestModel PurchaseOrderRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("poDetID",poDetID),
               };
            PurchaseOrderReportDet model = new PurchaseOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetPurchaseOrderLineReleaseReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.PurchaseLineReleaseDets = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<PurchaseLineReleaseDet>(reader).ToList();
                return model.PurchaseLineReleaseDets;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetPurchaseOrderOtherChargesSubDetails(int poDetID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("poDetID",poDetID),
               };
            PurchaseOrderReportDet model = new PurchaseOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetPurchaseOrderOtherChargesReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.PurchaseOrderDets = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<PurchaseOrderDet>(reader).ToList();
                return model.PurchaseOrderDets;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetPurchaseOrdeRequirementSubDetails(int poDetID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("poDetID",poDetID),
               };
            PurchaseOrderReportDet model = new PurchaseOrderReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetPurchaseOrderLineRequirementReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.PurchaseOrderLineRequirementDet = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<PurchaseOrderLineRequirementDet>(reader).ToList();
                return model.PurchaseOrderLineRequirementDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}