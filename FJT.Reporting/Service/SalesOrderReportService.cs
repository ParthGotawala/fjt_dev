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
    public class SalesOrderReportService : BaseService, ISalesOrderReportService
    {
        private readonly ISalesOrderReportRepository _iSalesOrderReportRepository;
        private readonly ISalesOrderReport _iSalesOrderReport;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public SalesOrderReportService(ISalesOrderReportRepository iSalesOrderReportRepository, ISalesOrderReport iSalesOrderReport, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iSalesOrderReport = iSalesOrderReport;
            _iSalesOrderReportRepository = iSalesOrderReportRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public SalesOrderReportDet GetSalesOrderReportDetDetails(SalesOrderRequestModel salesOrderRequestModel)
        {
            return _iSalesOrderReportRepository.GetSalesOrderDetails(salesOrderRequestModel);
        }
        public IEnumerable GetSalesOrderShippingReportDetDetails(int sDetID, SalesOrderRequestModel salesOrderRequestModel)
        {
            return _iSalesOrderReportRepository.GetSalesOrderSubDetails(sDetID, salesOrderRequestModel);
        }
        public IEnumerable GetSalesOrderOtherChargesSubDetails(int sDetID)
        {
            return _iSalesOrderReportRepository.GetSalesOrderOtherChargesSubDetails(sDetID);
        }
        byte[] ISalesOrderReportService.SalesOrderReportBytes(SalesOrderReportDet salesOrderReportDet, SalesOrderRequestModel salesOrderRequestModel)
        {   
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);

            ReportDataSource salesOrderOtherCharges = new ReportDataSource("SalesOrderTotalChargesDet", salesOrderReportDet.SalesOrderTotalChargesDet);
            localReport.DataSources.Add(salesOrderOtherCharges);

            localReport.EnableHyperlinks = true;
            ReportDataSource SalesOrderMstDet = new ReportDataSource("SalesOrderMstDet", salesOrderReportDet.SalesOrderMstDets);
            localReport.DataSources.Add(SalesOrderMstDet);
            ReportDataSource SalesOrderDet = new ReportDataSource("SalesOrderDet", salesOrderReportDet.SalesOrderDets);
            localReport.DataSources.Add(SalesOrderDet);

            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingOtherChargesDetails);
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Sales Order Report.rdlc");
            ReportParameter[] param = new ReportParameter[5];
            param[0] = new ReportParameter("TermsAndCondition", salesOrderRequestModel.termsAndCondition);
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
        void SubreportProcessingDetails(object sender, SubreportProcessingEventArgs e)
        {
            SalesOrderRequestModel salesOrderRequestModel = new SalesOrderRequestModel();
            int sDetID = int.Parse((e.Parameters["sDetID"]).Values[0].ToString());
            IEnumerable shipping = GetSalesOrderShippingReportDetDetails(sDetID, salesOrderRequestModel);
            e.DataSources.Add(new ReportDataSource("SalesShippingMstDet", shipping));
        }
        void SubreportProcessingOtherChargesDetails(object sender, SubreportProcessingEventArgs e)
        {
            int sDetID = int.Parse((e.Parameters["sDetID"]).Values[0].ToString());
            IEnumerable shipping = GetSalesOrderOtherChargesSubDetails(sDetID);
            e.DataSources.Add(new ReportDataSource("SalesOrderDet", shipping));
        }
    }
}