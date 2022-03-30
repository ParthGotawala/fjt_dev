using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service
{
    public class CustomerPackingSlipService : BaseService, ICustomerPackingSlipService
    {
        private readonly ICustomerPackingSlipRepository _iCustomerPackingSlipRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        private CustomerPackingSlipRequestModel objManufacturerListModel = new CustomerPackingSlipRequestModel();

        public CustomerPackingSlipService(ICustomerPackingSlipRepository iCustomerPackingSlipRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iCustomerPackingSlipRepository = iCustomerPackingSlipRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }

        public CustomerPackingSlipDetail GetCustomerPackingSlipDetail(CustomerPackingSlipRequestModel customerPackingSlipListModel, string APIProjectURL)
        {
            return _iCustomerPackingSlipRepository.GetCustomerPackingSlipDetail(customerPackingSlipListModel, APIProjectURL);
        }
        public CustomerPackingSlipDetail GetPackingSlipAssemblyReportDetails(int partID, int cpID)
        {
            return _iCustomerPackingSlipRepository.GetPackingSlipAssemblyDetails(partID, cpID);
        }

        public CustomerPackingSlipDetail GetCustomerPackingSlipUMIDSubDetail(int cpDetId, int partID)
        {
            return _iCustomerPackingSlipRepository.GetCustomerPackingSlipUMIDSubDetail(cpDetId, partID);
        }
        public byte[] GetCustomerPackingSlipDetailReportBytes(CustomerPackingSlipDetail customerPackingSlipDetail, CustomerPackingSlipRequestModel customerPackingSlipListModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);

            ReportDataSource CustomerPackingSlipDetailResponse = new ReportDataSource("CustomerPackingSlipDet", customerPackingSlipDetail.CustomerPackingSlipDetailResponse);
            localReport.DataSources.Add(CustomerPackingSlipDetailResponse);

            ReportDataSource CustomerPackingSlipMstResponse = new ReportDataSource("CustomerPackingSlipMst", customerPackingSlipDetail.CustomerPackingSlipMstResponse);
            localReport.DataSources.Add(CustomerPackingSlipMstResponse);

            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportAssemblyDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReportUMIDList);
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Packing Slip Report.rdlc");
            ReportParameter[] param = new ReportParameter[7];
            param[0] = new ReportParameter("COFCReportDisclaimer", customerPackingSlipListModel.COFCReportDisclaimer);
            param[1] = new ReportParameter("PACKINGSLIPReportDisclaimer", customerPackingSlipListModel.PACKINGSLIPReportDisclaimer);
            param[2] = new ReportParameter("DECLARATIONOFRoHSCOMPLIANCE", customerPackingSlipListModel.DECLARATIONOFRoHSCOMPLIANCE);
            param[3] = new ReportParameter("RoHSReportDisclaimer", customerPackingSlipListModel.RoHSReportDisclaimer);
            var TermsandCondition = _iCommonBusinessLogic.getTermsandCondition();
            param[4] = new ReportParameter("TermsAndCondition", TermsandCondition);
            param[5] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[6] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }

        void SubreportAssemblyDetails(object sender, SubreportProcessingEventArgs e)
        {
            int cpID = int.Parse((e.Parameters["cpID"]).Values[0].ToString());
            int partID = int.Parse((e.Parameters["partId"]).Values[0].ToString());
            CustomerPackingSlipDetail CustomerPackingSlipDetail = GetPackingSlipAssemblyReportDetails(partID, cpID);
            e.DataSources.Add(new ReportDataSource("CustomerPackingSlipDet", CustomerPackingSlipDetail.CustomerPackingSlipDetailResponse));
            e.DataSources.Add(new ReportDataSource("CustomerPackingSlipMst", CustomerPackingSlipDetail.CustomerPackingSlipMstResponse));
            e.DataSources.Add(new ReportDataSource("PackingSlipPartCommentList", CustomerPackingSlipDetail.PackingSlipPartCommentList));
        }
        void SubReportUMIDList(object sender, SubreportProcessingEventArgs e)
        {
            int cpDetId = int.Parse((e.Parameters["refCustomerPackingSlipDetID"]).Values[0].ToString());
            int partID = int.Parse((e.Parameters["partId"]).Values[0].ToString());
            CustomerPackingSlipDetail CustomerPackingSlipDetail = GetCustomerPackingSlipUMIDSubDetail(cpDetId,partID);
            e.DataSources.Add(new ReportDataSource("CustomerPackingSlipUMIDList", CustomerPackingSlipDetail.CustomerPackingSlipUMIDList));
        }

    }
}