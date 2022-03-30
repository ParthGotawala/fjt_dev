using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;

namespace FJT.Reporting.Service
{
    public class PurchaseOrderReportService : BaseService, IPurchaseOrderReportService
    {
        private readonly IPurchaseOrderRepository _iPurchaseOrderRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public PurchaseOrderReportService(IPurchaseOrderRepository iPurchaseOrderRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iPurchaseOrderRepository = iPurchaseOrderRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public PurchaseOrderReportDet GetPurchaseOrderDetails(PurchaseOrderRequestModel purchaseOrderRequestModel)
        {
            return _iPurchaseOrderRepository.GetPurchaseOrderDetails(purchaseOrderRequestModel);
        }
        public IEnumerable GetPurchaseOrderDetSubDetails(int poDetID, PurchaseOrderRequestModel purchaseOrderRequestModel)
        {
            return _iPurchaseOrderRepository.GetPurchaseOrderDetSubDetails(poDetID, purchaseOrderRequestModel);
        }
        public IEnumerable GetPurchaseOrderOtherChargesSubDetails(int poDetID)
        {
            return _iPurchaseOrderRepository.GetPurchaseOrderOtherChargesSubDetails(poDetID);
        }
        public IEnumerable GetPurchaseOrdeRequirementSubDetails(int poDetID)
        {
            return _iPurchaseOrderRepository.GetPurchaseOrdeRequirementSubDetails(poDetID);
        }
        byte[] IPurchaseOrderReportService.PurchaseOrderReportBytes(PurchaseOrderReportDet purchaseOrderReportDet, PurchaseOrderRequestModel purchaseOrderRequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);

            ReportDataSource purchaseOrderOtherCharges = new ReportDataSource("PurchaseOrderTotalChargesDet", purchaseOrderReportDet.PurchaseOrderTotalChargesDet);
            localReport.DataSources.Add(purchaseOrderOtherCharges);

            localReport.EnableHyperlinks = true;
            ReportDataSource purchaseOrderMstDet = new ReportDataSource("PurchaseOrderMstDet", purchaseOrderReportDet.PurchaseOrderMstDets);
            localReport.DataSources.Add(purchaseOrderMstDet);
            ReportDataSource purchaseOrderDet = new ReportDataSource("PurchaseOrderDet", purchaseOrderReportDet.PurchaseOrderDets);
            localReport.DataSources.Add(purchaseOrderDet);

            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingOtherChargesDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingRequirementsDetails);

            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Purchase Order Report.rdlc");
            ReportParameter[] param = new ReportParameter[5];
            param[0] = new ReportParameter("TermsAndCondition", purchaseOrderRequestModel.termsAndCondition);
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
            PurchaseOrderRequestModel purchaseOrderRequestModel = new PurchaseOrderRequestModel();
            int poDetID = int.Parse((e.Parameters["pODetID"]).Values[0].ToString());
            IEnumerable shipping = GetPurchaseOrderDetSubDetails(poDetID, purchaseOrderRequestModel);
            e.DataSources.Add(new ReportDataSource("PurchaseLineReleaseDet", shipping));
        }
        void SubreportProcessingOtherChargesDetails(object sender, SubreportProcessingEventArgs e)
        {
            int poDetID = int.Parse((e.Parameters["pODetID"]).Values[0].ToString());
            IEnumerable shipping = GetPurchaseOrderOtherChargesSubDetails(poDetID);
            e.DataSources.Add(new ReportDataSource("PurchaseOrderDet", shipping));
        }
        void SubreportProcessingRequirementsDetails(object sender, SubreportProcessingEventArgs e)
        {
            int poDetID = int.Parse((e.Parameters["pODetID"]).Values[0].ToString());
            IEnumerable shipping = GetPurchaseOrdeRequirementSubDetails(poDetID);
            e.DataSources.Add(new ReportDataSource("PurchaseOrderLineRequirementDet", shipping));
        }
    }
}