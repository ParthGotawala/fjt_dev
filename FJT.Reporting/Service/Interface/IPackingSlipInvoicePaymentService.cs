using FJT.Reporting.ViewModels;

namespace FJT.Reporting.Service.Interface
{
    public  interface IPackingSlipInvoicePaymentService
    {
        CheckPrintAndRemittanceCustRefundReportVM GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel);
        byte[] GetCheckPrintAndRemittanceReportBytes(CheckPrintAndRemittanceCustRefundReportVM checkPrintAndRemittanceCustRefundReportVM, bool isRemittanceReport);
    }
}
