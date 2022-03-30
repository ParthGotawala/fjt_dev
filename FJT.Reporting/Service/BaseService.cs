using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Linq;

namespace FJT.Reporting.Service
{
    public class BaseService: IBaseService
    {
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        public BaseService(ICommonBusinessLogic iCommonBusinessLogic)
        {
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }
        /// <summary>
        /// set Report Common Parameters
        /// </summary>
        /// <param name="pParams"></param>
        public void SetReportCommonParameters(ref ReportParameter[] pParams)
        {
            var Disclaimer = _iCommonBusinessLogic.getDisclaimer();
            var DateFormat = _iCommonBusinessLogic.getDateFormat();
            var TimeFormat = _iCommonBusinessLogic.getTimeFormat();
            var DateTimeFormat = _iCommonBusinessLogic.getDateTimeFormat();
            CommonReportDesignViewModel objCommonReportDesign = _iCommonBusinessLogic.getReportCommonData();
            ReportParameter[] param = new ReportParameter[13];
            param[0] = new ReportParameter("DateFormat", DateFormat);
            param[1] = new ReportParameter("DateTimeFormat", DateTimeFormat);
            param[2] = new ReportParameter("TimeFormat", TimeFormat);
            param[3] = new ReportParameter("Disclaimer", Disclaimer);
            param[4] = new ReportParameter("FontSize", Constant.Constant.fontSize);
            param[5] = new ReportParameter("FontFamily", Constant.Constant.fontFamily);
            param[6] = new ReportParameter("HeaderFontSize", Constant.Constant.tableHeaderFontSize);
            param[7] = new ReportParameter("HeaderFontWeight", Constant.Constant.headerFontWeight);
            param[8] = new ReportParameter("CompanyLogoURL", objCommonReportDesign.companyLogoURL);
            param[9] = new ReportParameter("ReportDefaultImagesPath", objCommonReportDesign.ReportDefaultImagesPath);
            param[10] = new ReportParameter("HeaderTitleFontSize", objCommonReportDesign.HeaderTitleFontSize);
            param[11] = new ReportParameter("HeaderTitleFontFamily", objCommonReportDesign.HeaderTitleFontFamily);
            param[12] = new ReportParameter("HeaderTitleFontColor", objCommonReportDesign.HeaderTitleFontColor);
            if (pParams.Length > 0)
            {
                pParams = pParams.Union(param).ToArray();
            }
            else
            {
                pParams = param;
            }
        }
    }
}