using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace FJT.Reporting.Repository
{

    public class PackingSlipInvoicePaymentRepository : Repository<SystemConfigrations>, IPackingSlipInvoicePaymentRepository
    {
        public PackingSlipInvoicePaymentRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public CheckPrintAndRemittanceCustRefundReportVM GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[] {
                  new MySqlParameter("pPaymentID",checkPrintAndRemittanceRequestModel.paymentId)
            };

            CheckPrintAndRemittanceCustRefundReportVM checkPrintAndRemittanceCustRefundReportVM = new CheckPrintAndRemittanceCustRefundReportVM();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetCheckPrintAndRemittanceCustRefundReport";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                checkPrintAndRemittanceCustRefundReportVM.PaymentDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<CheckPrintAndRemittancePaymentDetails>(reader).ToList();
                reader.NextResult();

                checkPrintAndRemittanceCustRefundReportVM.RefundedPaymentCMDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<CheckPrintAndRemittancePaymentCMDetails>(reader).ToList();
                reader.NextResult();

                checkPrintAndRemittanceCustRefundReportVM.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();

                return checkPrintAndRemittanceCustRefundReportVM;
            }
            catch (Exception)
            {
                return checkPrintAndRemittanceCustRefundReportVM;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}