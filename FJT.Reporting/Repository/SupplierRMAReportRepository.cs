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
    public class SupplierRMAReportRepository : Repository<SystemConfigrations>, ISupplierRMAReportRepository
    {
        public SupplierRMAReportRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public SupplierRMAReportDet  GetSupplierRMAReportDetails(SupplierRMARequestModel supplierRMARequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pid",supplierRMARequestModel.id)
               };
            SupplierRMAReportDet model = new SupplierRMAReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetSupplierRMAReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.SupplierRMAMst = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<SupplierRMAMst>(reader).ToList();
                reader.NextResult();
                model.SupplierRMADet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<SupplierRMADet>(reader).ToList();
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