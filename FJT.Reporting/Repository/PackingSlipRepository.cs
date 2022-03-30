using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;

namespace FJT.Reporting.Repository
{
   
    public class PackingSlipRepository : Repository<SystemConfigrations>, IPackingSlipRepository
    {
        public PackingSlipRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public SupplierPerformanceDetail GetSupplierPerformanceDetails(SupplierPerformanceRequestModel supplierPerformanceRequestModel, string APIProjectURL)
        {
            string supplierIDs = null;
            string fromDate = null;
            string toDate = null;

            if ((supplierPerformanceRequestModel != null) && !string.IsNullOrEmpty(supplierPerformanceRequestModel.supplierID))
            {
                supplierIDs = supplierPerformanceRequestModel.supplierID;
            }

            if ((supplierPerformanceRequestModel != null) && (supplierPerformanceRequestModel.fromDate != null))
            {
                fromDate = supplierPerformanceRequestModel.fromDate.ToString("yyyy-MM-dd");
            }

            if ((supplierPerformanceRequestModel != null) && (supplierPerformanceRequestModel.toDate != null))
            {
                toDate = supplierPerformanceRequestModel.toDate.ToString("yyyy-MM-dd");
            }

            SupplierPerformanceDetail objSupplierPerformanceDetail = new SupplierPerformanceDetail();
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pSupplierIDs",supplierIDs),
                  new MySqlParameter("pfromDate", fromDate),
                  new MySqlParameter("ptoDate", toDate),
                  new MySqlParameter("pEmployeeID", supplierPerformanceRequestModel.loginUserEmployeeID),
              };

            //List<SupplierPerformanceDet> supplierPerformanceDet = new List<SupplierPerformanceDet>();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_PackingslipAndInovoiceReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                objSupplierPerformanceDetail.SupplierPerformanceDet = ((IObjectContextAdapter)Context).ObjectContext.Translate<SupplierPerformanceDet>(reader).OrderBy(x => x.ReceiptMonthYear).ToList();
                reader.NextResult();
                objSupplierPerformanceDetail.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();

                return objSupplierPerformanceDetail;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return objSupplierPerformanceDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public PartnerPerformanceDetail GetPartnerPerformanceDetails(PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel, string APIProjectURL)
        {
            string supplierIDs = null;
            string fromDate = null;
            string toDate = null;

            if ((partnerPerformanceRequestViewModel != null) && !string.IsNullOrEmpty(partnerPerformanceRequestViewModel.supplierID))
            {
                supplierIDs = partnerPerformanceRequestViewModel.supplierID;
            }

            if ((partnerPerformanceRequestViewModel != null) && (partnerPerformanceRequestViewModel.fromDate != null))
            {
                fromDate = partnerPerformanceRequestViewModel.fromDate.ToString("yyyy-MM-dd");
            }

            if ((partnerPerformanceRequestViewModel != null) && (partnerPerformanceRequestViewModel.toDate != null))
            {
                toDate = partnerPerformanceRequestViewModel.toDate.ToString("yyyy-MM-dd");
            }

            PartnerPerformanceDetail objPartnerPerformanceDetail = new PartnerPerformanceDetail();
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pSupplierIDs",supplierIDs),
                  new MySqlParameter("pfromDate", fromDate),
                  new MySqlParameter("ptoDate", toDate),
                  new MySqlParameter("pEmployeeID", partnerPerformanceRequestViewModel.loginUserEmployeeID)
              };


            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_getPartnerPrtformanceReportDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                objPartnerPerformanceDetail.PartnerPerformanceDet = ((IObjectContextAdapter)Context).ObjectContext.Translate<PartnerPerformanceDet>(reader).OrderBy(x => x.ReceiptMonthYear).ToList();
                reader.NextResult();
                objPartnerPerformanceDetail.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();

                return objPartnerPerformanceDetail;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return objPartnerPerformanceDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
        public DebitMemoReportDet GetDebitMemoDetails(DebitMemoRequestModel debitMemoRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[] {
                  new MySqlParameter("pReceiptID",debitMemoRequestModel.receiptID),
                  new MySqlParameter("pEmployeeID",debitMemoRequestModel.employeeID),
            };

            DebitMemoReportDet debitMemoReportDet = new DebitMemoReportDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_getDebitMemoReportDetail";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                debitMemoReportDet.debitMemoDetail = ((IObjectContextAdapter)Context).ObjectContext.Translate<DebitMemoDetail>(reader).ToList();
                reader.NextResult();

                debitMemoReportDet.debitMemoInfo = ((IObjectContextAdapter)Context).ObjectContext.Translate<DebitMemoInfo>(reader).ToList();
                reader.NextResult();
                
                return debitMemoReportDet;
            }
            catch (Exception ex)
            {
                // HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return debitMemoReportDet;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }


        public CheckPrintAndRemittanceReportDetail GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[] {
                  new MySqlParameter("pPaymentID",checkPrintAndRemittanceRequestModel.paymentId)
            };

            CheckPrintAndRemittanceReportDetail checkPrintAndRemittanceReportDetail = new CheckPrintAndRemittanceReportDetail();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCheckPrintAndRemittanceReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                checkPrintAndRemittanceReportDetail.PaymentDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<CheckPrintAndRemittancePaymentDetails>(reader).ToList();
                reader.NextResult();

                checkPrintAndRemittanceReportDetail.InvoiceDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<CheckPrintAndRemittanceInvoiceDetails>(reader).ToList();
                reader.NextResult();

                checkPrintAndRemittanceReportDetail.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();

                return checkPrintAndRemittanceReportDetail;
            }
            catch (Exception)
            {
                return checkPrintAndRemittanceReportDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}