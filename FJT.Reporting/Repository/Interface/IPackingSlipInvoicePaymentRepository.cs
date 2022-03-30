using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;

namespace FJT.Reporting.Repository.Interface
{
    public interface IPackingSlipInvoicePaymentRepository : IRepository<SystemConfigrations>
    {
        CheckPrintAndRemittanceCustRefundReportVM GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel);
    }
}
