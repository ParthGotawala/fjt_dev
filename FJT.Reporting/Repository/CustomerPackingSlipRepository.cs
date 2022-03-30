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
    public class CustomerPackingSlipRepository : Repository<SystemConfigrations>, ICustomerPackingSlipRepository
    {
        public CustomerPackingSlipRepository(UnitOfWork unitOfWork)
          : base(unitOfWork.Context)
        {
        }
        public CustomerPackingSlipDetail GetCustomerPackingSlipDetail(CustomerPackingSlipRequestModel customerPackingSlipListModel, string APIProjectURL)
        {

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("cpid", customerPackingSlipListModel.id)
              };

            CustomerPackingSlipDetail customerPackingSlipDetail = new CustomerPackingSlipDetail();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCustomerPackingslipReportDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                customerPackingSlipDetail.CustomerPackingSlipMstResponse = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerPackingSlipMstResponse>(reader).ToList();
                reader.NextResult();
                customerPackingSlipDetail.CustomerPackingSlipDetailResponse = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerPackingSlipDetailResponse>(reader).ToList();

                return customerPackingSlipDetail;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return customerPackingSlipDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }

            throw new NotImplementedException();
        }

        public CustomerPackingSlipDetail GetPackingSlipAssemblyDetails(int partID, int cpID)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("partID",partID),
                 new MySqlParameter("cpID",cpID)
               };
            CustomerPackingSlipDetail customerPackingSlipDetail = new CustomerPackingSlipDetail();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetPackingSlipAssemblyDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                customerPackingSlipDetail.CustomerPackingSlipMstResponse = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerPackingSlipMstResponse>(reader).ToList();
                reader.NextResult();
                customerPackingSlipDetail.CustomerPackingSlipDetailResponse = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerPackingSlipDetailResponse>(reader).ToList();
                reader.NextResult();
                customerPackingSlipDetail.PackingSlipPartCommentList = ((IObjectContextAdapter)Context).ObjectContext.Translate<PackingSlipPartCommentList>(reader).ToList();

                return customerPackingSlipDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public CustomerPackingSlipDetail GetCustomerPackingSlipUMIDSubDetail(int refCustomerPackingSlipDetID, int partId)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
               {
                 new MySqlParameter("pCustPackingSlipDetId",refCustomerPackingSlipDetID),
                 new MySqlParameter("pPartId",partId),
               };
            CustomerPackingSlipDetail model = new CustomerPackingSlipDetail();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "sproc_getUmidListForCustomerPackingSlipReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.CustomerPackingSlipUMIDList = ((IObjectContextAdapter)Context).ObjectContext.Translate<CustomerPackingSlipUMIDList>(reader).ToList();
                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}