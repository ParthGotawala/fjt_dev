using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;
using System.Collections.Generic;

namespace FJT.Reporting.Service
{
    public class WorkOrderReportService : IWorkOrderReportService
    {
        private readonly IWorkOrderReportRepository _iWorkOrderReportRepository;
        private readonly IWorkOrderReport _iWorkOrderReport;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public WorkOrderReportService(IWorkOrderReportRepository iWorkOrderReportRepository, IWorkOrderReport iWorkOrderReport, ICommonBusinessLogic iCommonBusinessLogic)
        {
            _iWorkOrderReport = iWorkOrderReport;
            _iWorkOrderReportRepository = iWorkOrderReportRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public WorkOrderReportDet GetWorkOrderReportDetDetails(WorkOrderRequestModel workOrderRequestModel)
        {
            return _iWorkOrderReportRepository.GetWorkOrderDetails(workOrderRequestModel);
        }
        /*changes to call commom parameter method was not done, because this API is not in use as it was just for POC, as discussed with VS on 06-01-2020 6:55pm*/
        byte[] IWorkOrderReportService.WorkOrderReportBytes(WorkOrderReportDet workOrderReportDet, WorkOrderRequestModel workOrderRequestModel)
        {
            CommonReportDesignViewModel objCommonReportDesign = _iCommonBusinessLogic.getReportCommonData();
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", workOrderReportDet.CompanyDetails);
            localReport.DataSources.Add(CompanyDetail);
            localReport.EnableHyperlinks = true;

            var Disclaimer = _iCommonBusinessLogic.getDisclaimer();
            var DateFormat = _iCommonBusinessLogic.getDateFormat();
            var TimeFormat = _iCommonBusinessLogic.getTimeFormat();
            var DateTimeFormat = _iCommonBusinessLogic.getDateTimeFormat();
            ReportParameter[] param = new ReportParameter[18];
            param[0] = new ReportParameter("pDateFormat", DateFormat);
            param[1] = new ReportParameter("DateTimeFormat", DateTimeFormat);
            param[2] = new ReportParameter("TimeFormat", TimeFormat);
            param[3] = new ReportParameter("Disclaimer", Disclaimer);
            param[4] = new ReportParameter("TermsAndCondition", workOrderRequestModel.termsAndCondition);
            param[5] = new ReportParameter("FontSize", objCommonReportDesign.fontSize);
            param[6] = new ReportParameter("FontFamily", objCommonReportDesign.fontFamily);
            param[7] = new ReportParameter("HeaderFontSize", objCommonReportDesign.tableHeaderFontSize);
            param[8] = new ReportParameter("HeaderFontWeight", objCommonReportDesign.headerFontWeight);
            param[9] = new ReportParameter("CompanyLogoURL", objCommonReportDesign.companyLogoURL);
            param[10] = new ReportParameter("RoHSImagePath", objCommonReportDesign.RoHSImagesURL);
            param[11] = new ReportParameter("ReportDefaultImagesPath", objCommonReportDesign.ReportDefaultImagesPath);
            param[12] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[13] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[14] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[15] = new ReportParameter("HeaderTitleFontSize", objCommonReportDesign.HeaderTitleFontSize);
            param[16] = new ReportParameter("HeaderTitleFontFamily", objCommonReportDesign.HeaderTitleFontFamily);
            param[17] = new ReportParameter("HeaderTitleFontColor", objCommonReportDesign.HeaderTitleFontColor);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
    }
}