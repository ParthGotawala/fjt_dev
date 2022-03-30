using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Collections.Generic;

namespace FJT.Reporting.Service
{
    public class PackingSlipService : BaseService, IPackingSlipService
    {
        private readonly IPackingSlipRepository _iPackingSlipRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        private readonly IErrorLog _IErrorLog;

        public PackingSlipService(IPackingSlipRepository iPackingSlipRepository, ICommonBusinessLogic iCommonBusinessLogic, IErrorLog IErrorLog)
            : base(iCommonBusinessLogic)
        {
            _iPackingSlipRepository = iPackingSlipRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
            _IErrorLog = IErrorLog;
        }

        public SupplierPerformanceDetail GetSupplierPerformanceDetails(SupplierPerformanceRequestModel supplierPerformanceRequestModel, string APIProjectURL)
        {
            return _iPackingSlipRepository.GetSupplierPerformanceDetails(supplierPerformanceRequestModel, APIProjectURL);
        }

        public byte[] GetSupplierPerformanceReportBytes(SupplierPerformanceDetail SupplierPerformanceDetail, SupplierPerformanceRequestModel supplierPerformanceRequestModel)
        {
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/SupplierPerformanceReport.rdlc");
            ReportDataSource SupplierPerformanceDetails = new ReportDataSource("SupplierPerformanceDet", SupplierPerformanceDetail.SupplierPerformanceDet);
            localReport.DataSources.Add(SupplierPerformanceDetails);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", SupplierPerformanceDetail.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            ReportParameter[] param = new ReportParameter[2];
            param[0] = new ReportParameter("FromDate", supplierPerformanceRequestModel.fromDate.ToString());
            param[1] = new ReportParameter("ToDate", supplierPerformanceRequestModel.toDate.ToString());
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }

        public PartnerPerformanceDetail GetPartnerPerformanceDetails(PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel, string APIProjectURL)
        {
            return _iPackingSlipRepository.GetPartnerPerformanceDetails(partnerPerformanceRequestViewModel, APIProjectURL);
        }

        public byte[] GetPartnerPerformanceReportBytes(PartnerPerformanceDetail PartnerPerformanceDetail, PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel)
        {
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/PartnerPerformanceReport.rdlc");
            ReportDataSource PartnerPerformanceDetails = new ReportDataSource("PartnerPerformanceDet", PartnerPerformanceDetail.PartnerPerformanceDet);
            localReport.DataSources.Add(PartnerPerformanceDetails);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", PartnerPerformanceDetail.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);

            ReportParameter[] param = new ReportParameter[2];
            param[0] = new ReportParameter("FromDate", partnerPerformanceRequestViewModel.fromDate.ToString());
            param[1] = new ReportParameter("ToDate", partnerPerformanceRequestViewModel.toDate.ToString());
            //ReportParameter[] param = new ReportParameter[0];
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
        public DebitMemoReportDet GetDebitMemoDetails(DebitMemoRequestModel debitMemoRequestModel)
        {
            return _iPackingSlipRepository.GetDebitMemoDetails(debitMemoRequestModel);
        }
        public byte[] GetDebitMemoReportBytes(DebitMemoReportDet debitMemoReportDet)
        {
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/DebitMemoDetailReport.rdlc");
            ReportDataSource DebitMemoDetail = new ReportDataSource("DebitMemoDetail", debitMemoReportDet.debitMemoDetail);
            localReport.DataSources.Add(DebitMemoDetail);
            ReportDataSource DebitMemoInfo = new ReportDataSource("DebitMemoInfo", debitMemoReportDet.debitMemoInfo);
            localReport.DataSources.Add(DebitMemoInfo);

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetails);

            ReportParameter[] param = new ReportParameter[0];
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }

        public CheckPrintAndRemittanceReportDetail GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            return _iPackingSlipRepository.GetCheckPrintAndRemittancePaymentDetails(checkPrintAndRemittanceRequestModel);
        }

        public byte[] GetCheckPrintAndRemittanceReportBytes(CheckPrintAndRemittanceReportDetail checkPrintAndRemittanceReportDetail, bool isRemittanceReport)
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
                localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/CheckPrintReport.rdlc");
            }
            else
            {
                localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/RemittanceAdviceReport.rdlc");
            }
            _IErrorLog.SaveReportLog("Check Report API Before 'ReportDataSource'");
            ReportDataSource DebitMemoDetail = new ReportDataSource("PaymentDetails", checkPrintAndRemittanceReportDetail.PaymentDetails);
            localReport.DataSources.Add(DebitMemoDetail);
            ReportDataSource DebitMemoInfo = new ReportDataSource("InvoiceDetails", checkPrintAndRemittanceReportDetail.InvoiceDetails);
            localReport.DataSources.Add(DebitMemoInfo);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", checkPrintAndRemittanceReportDetail.CompanyDetails);
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