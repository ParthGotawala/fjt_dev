using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Text;
using System.Web;

namespace FJT.Reporting.Service
{
    public class ManufacturerService : BaseService, IManufacturerService
    {
        private readonly IManufacturerRepository _iManufacturerRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        private ManufacturerRequestModel objManufacturerListModel = new ManufacturerRequestModel();

        public ManufacturerService(IManufacturerRepository iManufacturerRepository, ICommonBusinessLogic iCommonBusinessLogic)
            : base(iCommonBusinessLogic)
        {
            _iManufacturerRepository = iManufacturerRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }

        public ManufacturerDetail GetManufacturerDetail(ManufacturerRequestModel manufacturerListModel, string APIProjectURL)
        {
            return _iManufacturerRepository.GetManufacturerDetail(manufacturerListModel, APIProjectURL);
        }

        public byte[] GetManufacturerDetailReportBytes(ManufacturerDetail manufacturerDetail, ManufacturerRequestModel manufacturerListModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/ManufacturerCreationReport.rdlc");
            ReportDataSource ManufacturerDetail = new ReportDataSource("ManufacturerDetail", manufacturerDetail.ManufacturerDetailResponse);
            localReport.DataSources.Add(ManufacturerDetail);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", manufacturerDetail.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            ReportParameter[] param = new ReportParameter[2];
            param[0] = new ReportParameter("FromDate", manufacturerListModel.fromdate.ToString());
            param[1] = new ReportParameter("ToDate", manufacturerListModel.todate.ToString());
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);
            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
    }
}