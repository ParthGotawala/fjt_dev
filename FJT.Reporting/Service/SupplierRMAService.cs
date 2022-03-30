using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;

namespace FJT.Reporting.Service
{
    public class SupplierRMAService: BaseService, ISupplierRMAService
    {
        private readonly ISupplierRMAReportRepository _iSupplierRMAReportRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public SupplierRMAService(ISupplierRMAReportRepository iSupplierRMAReportRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iSupplierRMAReportRepository = iSupplierRMAReportRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public SupplierRMAReportDet GetSupplierRMAReportDetails(SupplierRMARequestModel supplierRMARequestModel)
        {
            return _iSupplierRMAReportRepository.GetSupplierRMAReportDetails(supplierRMARequestModel);
        }
        byte[] ISupplierRMAService.SupplierRMAReportBytes(SupplierRMAReportDet SupplierRMAReportDet, SupplierRMARequestModel supplierRMARequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);

            ReportDataSource SupplierRMAMst = new ReportDataSource("SupplierRMAMst", SupplierRMAReportDet.SupplierRMAMst);
            localReport.DataSources.Add(SupplierRMAMst);

            ReportDataSource SupplierRMADet = new ReportDataSource("SupplierRMADet", SupplierRMAReportDet.SupplierRMADet);
            localReport.DataSources.Add(SupplierRMADet);

            localReport.EnableHyperlinks = true;

            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Supplier RMA Report.rdlc");
            ReportParameter[] param = new ReportParameter[5];
            var TermsandCondition = _iCommonBusinessLogic.getTermsandCondition();
            param[0] = new ReportParameter("TermsAndCondition", TermsandCondition);
            param[1] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[2] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[3] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[4] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
    }
}