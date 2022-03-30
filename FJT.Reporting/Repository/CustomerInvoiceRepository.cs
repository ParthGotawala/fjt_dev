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
    public class CustomerInvoiceRepository: Repository<SystemConfigrations>, ICustomerInvoiceRepository
    {
        public CustomerInvoiceRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public CustomerInvoiceReportDet GetCustomerInvoiceDetails(CustomerInvoiceRequestModel customerInvoiceRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("cpID",customerInvoiceRequestModel.id)
               };
            CustomerInvoiceReportDet model = new CustomerInvoiceReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCustomerInvoiceReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.CustomerInvoiceMst = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CustomerInvoiceMst>(reader).ToList();
                reader.NextResult();
                model.CustomerInvoiceDet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CustomerInvoiceDet>(reader).ToList();
                reader.NextResult();
                model.CustomerInvoiceOtherChargesDet = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<CustomerInvoiceTotalChargesDet>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public IEnumerable GetCustomerInvoiceOtherChargesSubDetails(int refDetID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("refCustomerPackingSlipDetID",refDetID),
               };
            CustomerInvoiceReportDet model = new CustomerInvoiceReportDet();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCustomerInvoiceOtherChargesReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.CustomerInvoiceDet = ((IObjectContextAdapter)Context)
                  .ObjectContext
                  .Translate<CustomerInvoiceDet>(reader).ToList();
                return model.CustomerInvoiceDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public CustomerInvoiceReportDet GetCustomerInvoiceUMIDSubDetail(int refDetID, int partId)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pCustPackingSlipDetId",refDetID),
                 new MySqlParameter("pPartId",partId),
               };
            CustomerInvoiceReportDet model = new CustomerInvoiceReportDet();
            var cmd2 = this.Context.Database.Connection.CreateCommand();
            cmd2.CommandText = "sproc_getUmidListForCustomerInvoiceReport";
            cmd2.CommandType = CommandType.StoredProcedure;
            cmd2.Parameters.AddRange(parameters);
            try
            {
                cmd2.Connection.Open();
                var reader = cmd2.ExecuteReader();

                model.CustomerInvoiceUMIDList = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerInvoiceUMIDList>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}