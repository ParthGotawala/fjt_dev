using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Collections.Generic;
using System.Linq;

namespace FJT.Reporting.Service
{
    public class RFQService : BaseService, IRFQService
    {
        private readonly ISystemConfigrationRepository _iSystemConfigrationsRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;

        public RFQService(ISystemConfigrationRepository iSystemConfigrationsRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iSystemConfigrationsRepository = iSystemConfigrationsRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }

        public QuoteSummaryDet GetQuoteSummaryDetails(QuoteSummaryModel quoteSummaryModel, string APIProjectURL)
        {
            return _iSystemConfigrationsRepository.GetQuoteSummaryDetails(quoteSummaryModel, APIProjectURL);
        }
        public QuoteIsSubjectToFollowingDet GetQuoteisSubjectToFollowingDetails(QuoteSummaryModel quoteSummaryModel)
        {
            return _iSystemConfigrationsRepository.GetQuoteisSubjectToFollowingDetails(quoteSummaryModel);
        }

        public byte[] QuoteSummaryReportBytes(QuoteSummaryDet QuoteSummaryDet, QuoteIsSubjectToFollowingDet quoteIsSubjectToFollowingDet, bool showAvailableStock, string companyCode, bool isCustomPartDetShowInReport, int format)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/QuoteSummaryReport.rdlc");
            ReportDataSource revisedQuoteDet = new ReportDataSource("RevisedQuoteDet", QuoteSummaryDet.RevisedQuoteDetail);
            localReport.DataSources.Add(revisedQuoteDet);
            ReportDataSource assyDetail = new ReportDataSource("AssyDetail", QuoteSummaryDet.AssyDetail);
            localReport.DataSources.Add(assyDetail);
            ReportDataSource quoteDetails = new ReportDataSource("QuoteDetail", QuoteSummaryDet.QuoteDetails);
            localReport.DataSources.Add(quoteDetails);
            ReportDataSource standardClass = new ReportDataSource("StandardClass", QuoteSummaryDet.StandardClass);
            localReport.DataSources.Add(standardClass);
            ReportDataSource rfqSelectedTermsAndConditions = new ReportDataSource("RFQSelectedTermsAndConditions", QuoteSummaryDet.RFQSelectedTermsAndConditions);
            localReport.DataSources.Add(rfqSelectedTermsAndConditions);
            ReportDataSource CustomPartDetails = new ReportDataSource("CustomPartDetails", QuoteSummaryDet.CustomPartDetails);
            localReport.DataSources.Add(CustomPartDetails);
            ReportDataSource NREDetail = new ReportDataSource("NREDetail", QuoteSummaryDet.NREDetails);
            localReport.DataSources.Add(NREDetail);
            ReportDataSource ToolingDetail = new ReportDataSource("ToolingDetail", QuoteSummaryDet.ToolingDetails);
            localReport.DataSources.Add(ToolingDetail);
            ReportDataSource ComapnyDetail = new ReportDataSource("CompanyDetail", QuoteSummaryDet.CompanyDetails);
            localReport.DataSources.Add(ComapnyDetail);
            ReportDataSource rfqPriceGroupDetail = new ReportDataSource("rfqPriceGroupDetail", QuoteSummaryDet.rfqPriceGroupDetail);
            localReport.DataSources.Add(rfqPriceGroupDetail);
            ReportDataSource ExcessMaterialDetails = new ReportDataSource("ExcessMaterialDetail", quoteIsSubjectToFollowingDet.ExcessMaterialDetails);
            localReport.DataSources.Add(ExcessMaterialDetails);
            ReportDataSource CustomerConsignedDetail = new ReportDataSource("CustomerConsignedDetail", quoteIsSubjectToFollowingDet.CustomerConsignedDetail);
            localReport.DataSources.Add(CustomerConsignedDetail);
            ReportDataSource UnquotedItemDetail = new ReportDataSource("UnquotedItemDetail", quoteIsSubjectToFollowingDet.UnquotedItemDetail);
            localReport.DataSources.Add(UnquotedItemDetail);
            ReportDataSource UnquotedLaborDetail = new ReportDataSource("UnquotedLaborDetail", quoteIsSubjectToFollowingDet.UnquotedLaborDetail);
            localReport.DataSources.Add(UnquotedLaborDetail);
            ReportDataSource LongLeadTimeDetail = new ReportDataSource("LongLeadTimeDetail", quoteIsSubjectToFollowingDet.LongLeadTimeDetail.Where(x => !x.isCustom).ToList());
            localReport.DataSources.Add(LongLeadTimeDetail);
            ReportDataSource LowStockAlertDetail = new ReportDataSource("LowStockAlertDetail", quoteIsSubjectToFollowingDet.LowStockAlertDetail);
            localReport.DataSources.Add(LowStockAlertDetail);
            ReportDataSource PartLOADetail = new ReportDataSource("PartLOADetail", quoteIsSubjectToFollowingDet.PartLOADetail);
            localReport.DataSources.Add(PartLOADetail);
            ReportDataSource QuoteObsoletePartDetail = new ReportDataSource("QuoteObsoletePartDetail", quoteIsSubjectToFollowingDet.QuoteObsoletePartDetail);
            localReport.DataSources.Add(QuoteObsoletePartDetail);
            ReportDataSource BOMIssueDetail = new ReportDataSource("BOMIssueDetail", quoteIsSubjectToFollowingDet.BOMIssueDetail);
            localReport.DataSources.Add(BOMIssueDetail);
            ReportDataSource CustomerApprovalCommentDetail = new ReportDataSource("CustomerApprovalCommentDetail", quoteIsSubjectToFollowingDet.CustomerApprovalCommentDetail);
            localReport.DataSources.Add(CustomerApprovalCommentDetail);
            ReportDataSource LongLeadTimeCustomPartDetail = new ReportDataSource("LongLeadTimeCustomPartDetail", quoteIsSubjectToFollowingDet.LongLeadTimeDetail.Where(x => x.isCustom).ToList());
            localReport.DataSources.Add(LongLeadTimeCustomPartDetail);

            ReportParameter[] param = new ReportParameter[8];
            param[0] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[1] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[2] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[3] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[4] = new ReportParameter("currentCompanyCode", companyCode);
            param[5] = new ReportParameter("ShowAvailableStock", showAvailableStock.ToString());
            param[6] = new ReportParameter("isCustomPartDetShowInReport", isCustomPartDetShowInReport.ToString());
            param[7] = new ReportParameter("reportFormat", format.ToString());
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
    }
}
