using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Collections.Generic;

namespace FJT.Reporting.Service
{
    public class PackingSlipInvoicePaymentService : BaseService, IPackingSlipInvoicePaymentService
    {
        private readonly IPackingSlipInvoicePaymentRepository _iPackingSlipInvoicePaymentRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        private readonly IErrorLog _IErrorLog;

        public PackingSlipInvoicePaymentService(IPackingSlipInvoicePaymentRepository iPackingSlipInvoicePaymentRepository, ICommonBusinessLogic iCommonBusinessLogic, IErrorLog IErrorLog)
            : base(iCommonBusinessLogic)
        {
            _iPackingSlipInvoicePaymentRepository = iPackingSlipInvoicePaymentRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
            _IErrorLog = IErrorLog;
        }

        public CheckPrintAndRemittanceCustRefundReportVM GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            return _iPackingSlipInvoicePaymentRepository.GetCheckPrintAndRemittancePaymentDetails(checkPrintAndRemittanceRequestModel);
        }

        public byte[] GetCheckPrintAndRemittanceReportBytes(CheckPrintAndRemittanceCustRefundReportVM checkPrintAndRemittanceCustRefundReportVM, bool isRemittanceReport)
        {
            _IErrorLog.SaveReportLog("Check Report API Get Report Bytes Begin!");
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            _IErrorLog.SaveReportLog("Check Report API Before 'LocalReport localReport = new LocalReport();'");
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            _IErrorLog.SaveReportLog("Check Report API Before 'Server.MapPath'");
            if (!isRemittanceReport)
            {
                localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/CustRefundCheckPrintReport.rdlc");
            }
            else
            {
                localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/CustRefundRemittanceAdviceReport.rdlc");
            }
            _IErrorLog.SaveReportLog("Check Report API Before 'ReportDataSource'");
            
            ReportDataSource PaymentDetails = new ReportDataSource("PaymentDetails", checkPrintAndRemittanceCustRefundReportVM.PaymentDetails);
            localReport.DataSources.Add(PaymentDetails);
            
            ReportDataSource RefundedPaymentCMDetails = new ReportDataSource("RefundedPaymentCMDetails", checkPrintAndRemittanceCustRefundReportVM.RefundedPaymentCMDetails);
            localReport.DataSources.Add(RefundedPaymentCMDetails);
            
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetails", checkPrintAndRemittanceCustRefundReportVM.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            
            _IErrorLog.SaveReportLog("Check Report API Before 'ReportParameter'");
            ReportParameter[] param = new ReportParameter[3];
            param[0] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            var DateFormat = _iCommonBusinessLogic.getDateFormatForPaymentReport();
            param[1] = new ReportParameter("DateFormatForPaymentReport", DateFormat);
            param[2] = new ReportParameter("reportVersion", Constant.Constant.ReportVersion);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            _IErrorLog.SaveReportLog("Check Report API Before 'localReport.Refresh()'");
            localReport.Refresh();
            _IErrorLog.SaveReportLog("Check Report API Before 'localReport.Render(PDF)'");
            byte[] bytes = localReport.Render("PDF");
            _IErrorLog.SaveReportLog("Check Report API After 'localReport.Render(PDF)'");
            return bytes;
        }
    }
}