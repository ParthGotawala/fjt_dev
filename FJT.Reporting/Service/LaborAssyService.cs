using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service
{
    public class LaborAssyService : BaseService, ILaborAssyService
    {
        private readonly ILaborAssyComparisionRepository _ILaborAssyComparisionRepository;
        private readonly ICommonBusinessLogic _ICommonBusinessLogic;
        public LaborAssyService(ILaborAssyComparisionRepository ILaborAssyComparisionRepository, ICommonBusinessLogic ICommonBusinessLogic)
            : base(ICommonBusinessLogic)
        {
            _ILaborAssyComparisionRepository = ILaborAssyComparisionRepository;
            _ICommonBusinessLogic = ICommonBusinessLogic;
        }

        public List<LaborAssyDetailModel> GetLaborAssyDetail(LaborAssyRequestModel laborRequestModel, string APIProjectURL)
        {
            return _ILaborAssyComparisionRepository.GetLaborAssyDetail(laborRequestModel, APIProjectURL);
        }

        public byte[] LaborAssyReportBytes(List<LaborAssyDetailModel> laborAssytDet)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _ICommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/LaborAssyComparisonReport.rdlc");
            ReportDataSource LaborAsssyDetails = new ReportDataSource("LaborAssyComparisionDet", laborAssytDet);
            localReport.DataSources.Add(LaborAsssyDetails);
            
            ReportParameter[] param = new ReportParameter[4];
            param[0] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[1] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[2] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[3] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }

        public LaborComparisonEsimatedvsActualDetail GetLaborComparisonEstimatedvsActualDetail(LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel, string APIProjectURL)
        {
            return _ILaborAssyComparisionRepository.GetLaborComparisonEstimatedvsActualDetail(laborComparisonEstimatedvsActualRequestModel, APIProjectURL);
        }

        public byte[] GetLaborComparisonEstimatedvsActualDetailReportBytes(LaborComparisonEsimatedvsActualDetail laborComparisonEsimatedvsActualDetail, LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _ICommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/LaborComparisonEstimatedvsActualReport.rdlc");
            ReportDataSource LaborComparisonEstimatedvsActual = new ReportDataSource("LaborComparisonEstimatedvsActual", laborComparisonEsimatedvsActualDetail.LaborComparisonEsimatedvsActualDet);
            localReport.DataSources.Add(LaborComparisonEstimatedvsActual);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", laborComparisonEsimatedvsActualDetail.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);

            ReportParameter[] param = new ReportParameter[1];
            param[0] = new ReportParameter("Assy", laborComparisonEstimatedvsActualRequestModel.assyPN);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
    }
}