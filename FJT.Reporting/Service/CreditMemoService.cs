using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;

namespace FJT.Reporting.Service
{
    public class CreditMemoService : BaseService, ICreditMemoService
    {
        private readonly ICreditMemoRepository _iCreditMemoRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public CreditMemoService(ICreditMemoRepository iCreditMemoRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iCreditMemoRepository = iCreditMemoRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public CreditMemoResponseModel GetCreditMemoDetails(CreditMemoRequestModel creditMemoRequestModel)
        {
            return _iCreditMemoRepository.GetCreditMemoDetails(creditMemoRequestModel);
        }

        byte[] ICreditMemoService.CreditMemoReportBytes(CreditMemoResponseModel creditMemoResponseModel, CreditMemoRequestModel creditMemoRequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);


            localReport.EnableHyperlinks = true;

            ReportDataSource CreditMemoMst = new ReportDataSource("CreditMemoMst", creditMemoResponseModel.CreditMemoMst);
            localReport.DataSources.Add(CreditMemoMst);

            ReportDataSource CreditMemoDet = new ReportDataSource("CreditMemoDet", creditMemoResponseModel.CreditMemoDet);
            localReport.DataSources.Add(CreditMemoDet);

            ReportDataSource CreditMemoTotalCharges = new ReportDataSource("CreditMemoTotalCharges", creditMemoResponseModel.CreditMemoTotalCharges);
            localReport.DataSources.Add(CreditMemoTotalCharges);

            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Credit Memo Report.rdlc");
            ReportParameter[] param = new ReportParameter[6];
            param[0] = new ReportParameter("TermsAndCondition", creditMemoRequestModel.termsAndCondition);
            param[1] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[2] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[3] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[4] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[5] = new ReportParameter("InvoiceDisclaimer", creditMemoRequestModel.invoiceDisclaimer);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;

        }
    }
}