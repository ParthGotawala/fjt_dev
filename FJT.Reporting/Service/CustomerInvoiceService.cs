using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;

namespace FJT.Reporting.Service
{
    public class CustomerInvoiceService : BaseService, ICustomerInvoiceService
    {
        private readonly ICustomerInvoiceRepository _iCustomerInvoiceRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public CustomerInvoiceService(ICustomerInvoiceRepository iCustomerInvoiceRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iCustomerInvoiceRepository = iCustomerInvoiceRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        public CustomerInvoiceReportDet GetCustomerInvoiceDetails(CustomerInvoiceRequestModel customerInvoiceRequestModel)
        {
            return _iCustomerInvoiceRepository.GetCustomerInvoiceDetails(customerInvoiceRequestModel);
        }
        public IEnumerable GetCustomerInvoiceOtherChargesSubDetails(int refDetID)
        {
            return _iCustomerInvoiceRepository.GetCustomerInvoiceOtherChargesSubDetails(refDetID);
        }
        public CustomerInvoiceReportDet GetCustomerInvoiceUMIDSubDetail(int cpDetId, int partID)
        {
            return _iCustomerInvoiceRepository.GetCustomerInvoiceUMIDSubDetail(cpDetId, partID);
        }
        byte[] ICustomerInvoiceService.CustomerInvoiceReportBytes(CustomerInvoiceReportDet CustomerInvoiceReportDet, CustomerInvoiceRequestModel customerInvoiceRequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;

            var comapmny_details = _iCommonBusinessLogic.GetCompany_Detail();
            ReportDataSource CompanyDetail = new ReportDataSource("CompanyDetail", comapmny_details);
            localReport.DataSources.Add(CompanyDetail);

            ReportDataSource CustomerInvoiceOtherChargesDet = new ReportDataSource("CustomerInvoiceOtherChargesDet", CustomerInvoiceReportDet.CustomerInvoiceOtherChargesDet);
            localReport.DataSources.Add(CustomerInvoiceOtherChargesDet);

            localReport.EnableHyperlinks = true;
            ReportDataSource CustomerInvoiceMst = new ReportDataSource("CustomerInvoiceMst", CustomerInvoiceReportDet.CustomerInvoiceMst);
            localReport.DataSources.Add(CustomerInvoiceMst);
            ReportDataSource CustomerInvoiceDet = new ReportDataSource("CustomerInvoiceDet", CustomerInvoiceReportDet.CustomerInvoiceDet);
            localReport.DataSources.Add(CustomerInvoiceDet);

            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingOtherChargesDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReportUMIDList);

            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/Customer Invoice Report.rdlc");
            ReportParameter[] param = new ReportParameter[6];
            param[0] = new ReportParameter("TermsAndCondition", customerInvoiceRequestModel.termsAndCondition);
            param[1] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[2] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[3] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[4] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[5] = new ReportParameter("InvoiceDisclaimer", customerInvoiceRequestModel.invoiceDisclaimer);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
        void SubreportProcessingOtherChargesDetails(object sender, SubreportProcessingEventArgs e)
        {
            int refDetID = int.Parse((e.Parameters["refDetID"]).Values[0].ToString());
            IEnumerable shipping = GetCustomerInvoiceOtherChargesSubDetails(refDetID);
            e.DataSources.Add(new ReportDataSource("CustomerInvoiceDet", shipping));
        }

        void SubReportUMIDList(object sender, SubreportProcessingEventArgs e)
        {
            int cpDetId = int.Parse((e.Parameters["refDetID"]).Values[0].ToString());
            int partID = int.Parse((e.Parameters["partId"]).Values[0].ToString());
            CustomerInvoiceReportDet CustomerInvoiceDetail = GetCustomerInvoiceUMIDSubDetail(cpDetId, partID);
            e.DataSources.Add(new ReportDataSource("CustomerInvoiceUMIDList", CustomerInvoiceDetail.CustomerInvoiceUMIDList));
        }
    }
}