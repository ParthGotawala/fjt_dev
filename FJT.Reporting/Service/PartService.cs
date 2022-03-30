using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System.Text;
using System.Web;
using System.Linq;
using System.Collections.Generic;
using static FJT.Reporting.Constant.Constant;

namespace FJT.Reporting.Service
{
    public class PartService : BaseService, IPartService
    {
        private readonly IObsoletePartReportRepository _iObsoletePartReportRepository;
        private readonly IPartRepository _iPartRepository;
        private readonly ICommonBusinessLogic _iCommonBusinessLogic;
        private PartUsageRequestModel objPartUsageRequestModel = new PartUsageRequestModel();
        public PartService(IObsoletePartReportRepository iObsoletePartReportRepository, ICommonBusinessLogic iCommonBusinessLogic, IPartRepository iPartRepository)
            : base(iCommonBusinessLogic)
        {
            _iObsoletePartReportRepository = iObsoletePartReportRepository;
            _iPartRepository = iPartRepository;
            _iCommonBusinessLogic = iCommonBusinessLogic;
        }

        public ObsolatePartDet GetObsolatePartDetails(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            return _iObsoletePartReportRepository.GetObsolatePartDetails(obsoletePartRequestModel);
        }
        public ObsolatePartDet GetObsolatePartCSVDetails(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            return _iObsoletePartReportRepository.GetObsolatePartCSVDetails(obsoletePartRequestModel);
        }

        public byte[] ObsolatePartReportBytes(ObsolatePartDet obsolatePartDet, ObsoletePartRequestModel obsoletePartRequestModel)
        {
            if (obsoletePartRequestModel.withAlternateParts)
            {
                if (string.IsNullOrEmpty(obsoletePartRequestModel.selectedRadioButtonName))
                {
                    obsoletePartRequestModel.selectedRadioButtonName = Constant.Constant.withAlternateParts;
                }
                else
                {
                    obsoletePartRequestModel.selectedRadioButtonName = Constant.Constant.withAlternateParts + " & " + obsoletePartRequestModel.selectedRadioButtonName;
                }
            }
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(AlternatePartSubreportProcessingDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(RohsPartSubreportProcessingDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(AssemblyManualPartDetail);
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/ObsoletePartDetail.rdlc");
            ReportDataSource ObsoletePartDetails = new ReportDataSource("ObsoletePartDetails", obsolatePartDet.obsoletePartDetails);
            localReport.DataSources.Add(ObsoletePartDetails);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", obsolatePartDet.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            ReportParameter[] param = new ReportParameter[7];
            param[0] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[1] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[2] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[3] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[4] = new ReportParameter("radioFilter", string.IsNullOrEmpty(obsoletePartRequestModel.selectedRadioButtonName) ? null : obsoletePartRequestModel.selectedRadioButtonName);
            param[5] = new ReportParameter("radioFilterValue", obsoletePartRequestModel.selectedRadioButtonValue.ToString());
            param[6] = new ReportParameter("additionalNote", obsolatePartDet.additionalNotes);
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
        public byte[] ObsolatePartCSVBytes(ObsolatePartDet obsolatePartDet, ObsoletePartRequestModel obsoletePartRequestModel)
        {
            ObsolatePartDet obPartdetail = new ObsolatePartDet();
            if (obsoletePartRequestModel.selectedRadioButtonValue != (int)obsoletepartReportRadioButtonFilter.IncludeAlternatesPartsOnly)
            {
                foreach (ObsolatePartDetail item in obsolatePartDet.obsoletePartDetails)
                {
                    List<ObsolatePartDetail> objCSVDetail = new List<ObsolatePartDetail>();
                    if (obPartdetail.obsoletePartDetails != null)
                    {
                        objCSVDetail = obPartdetail.obsoletePartDetails.Where(a => a.rfqalternatePartID == item.rfqalternatePartID).ToList();
                    }
                    else
                    {
                        obPartdetail.obsoletePartDetails = new List<ObsolatePartDetail>();
                    }
                    if (objCSVDetail.Count() == 0)
                    {
                        var resultLineitemobj = obsolatePartDet.obsoletePartDetails.Where(a => a.rfqalternatePartID == item.rfqalternatePartID).ToArray();
                        var result = obsolatePartDet.RohsPartDetail.Where(a => a.rfqalternatePartID == item.rfqalternatePartID).ToArray();
                        if (result.Length > 0)
                        {
                            if (result.Length == 1)
                            {
                                if (obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.IncludeRoHSReplacementPartsOnly)
                                {
                                    item.AlternatePart = null;
                                    item.alternatePartMFG = null;
                                    item.alternateTentativePrice = null;
                                    item.rohsReplacementPart = result[0].rohsalternatePart;
                                    item.rohsReplacementPartMFG = result[0].rohsalternateMFG;
                                    item.rohsalternateTentativePrice = result[0].rohsalternateTentativePrice;
                                    obPartdetail.obsoletePartDetails.Add(item);
                                }
                                else
                                {
                                    if (string.IsNullOrEmpty(result[0].rohsalternatePart))
                                    {
                                        for (int i = 0; i < resultLineitemobj.Length; i++)
                                        {
                                            obPartdetail.obsoletePartDetails.Add(resultLineitemobj[i]);
                                        }
                                    }
                                    else
                                    {
                                        if (obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.ExcludeAlternateswhenRoHSReplacementPartsisAvailable)
                                        {
                                            item.AlternatePart = null;
                                            item.alternatePartMFG = null;
                                            item.alternateTentativePrice = null;
                                        }
                                        item.rohsReplacementPart = result[0].rohsalternatePart;
                                        item.rohsReplacementPartMFG = result[0].rohsalternateMFG;
                                        item.rohsalternateTentativePrice = result[0].rohsalternateTentativePrice;
                                        obPartdetail.obsoletePartDetails.Add(item);
                                    }

                                }
                            }
                            else if (resultLineitemobj.Length >= result.Length)
                            {
                                for (int i = 0; i < result.Length; i++)
                                {
                                    if (obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.IncludeRoHSReplacementPartsOnly ||
                                        obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.ExcludeAlternateswhenRoHSReplacementPartsisAvailable)
                                    {
                                        item.AlternatePart = null;
                                        item.alternatePartMFG = null;
                                        item.alternateTentativePrice = null;
                                        item.rohsReplacementPart = result[i].rohsalternatePart;
                                        item.rohsReplacementPartMFG = result[i].rohsalternateMFG;
                                        item.rohsalternateTentativePrice = result[i].rohsalternateTentativePrice;
                                        obPartdetail.obsoletePartDetails.Add(item);
                                    }
                                    else
                                    {
                                        resultLineitemobj[i].rohsReplacementPart = result[i].rohsalternatePart;
                                        resultLineitemobj[i].rohsReplacementPartMFG = result[i].rohsalternateMFG;
                                        resultLineitemobj[i].rohsalternateTentativePrice = result[i].rohsalternateTentativePrice;
                                        obPartdetail.obsoletePartDetails.Add(resultLineitemobj[i]);
                                    }
                                }
                            }
                            else if (resultLineitemobj.Length < result.Length)
                            {
                                for (int i = 0; i < result.Length; i++)
                                {
                                    if (resultLineitemobj.Length > i)
                                    {
                                        if (obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.IncludeRoHSReplacementPartsOnly ||
                                        obsoletePartRequestModel.selectedRadioButtonValue == (int)obsoletepartReportRadioButtonFilter.ExcludeAlternateswhenRoHSReplacementPartsisAvailable)
                                        {
                                            resultLineitemobj[i].AlternatePart = null;
                                            resultLineitemobj[i].alternatePartMFG = null;
                                            resultLineitemobj[i].alternateTentativePrice = null;
                                            resultLineitemobj[i].rohsReplacementPart = result[i].rohsalternatePart;
                                            resultLineitemobj[i].rohsReplacementPartMFG = result[i].rohsalternateMFG;
                                            resultLineitemobj[i].rohsalternateTentativePrice = result[i].rohsalternateTentativePrice;
                                            obPartdetail.obsoletePartDetails.Add(item);
                                        }
                                        else
                                        {
                                            resultLineitemobj[i].rohsReplacementPart = result[i].rohsalternatePart;
                                            resultLineitemobj[i].rohsReplacementPartMFG = result[i].rohsalternateMFG;
                                            resultLineitemobj[i].rohsalternateTentativePrice = result[i].rohsalternateTentativePrice;
                                            obPartdetail.obsoletePartDetails.Add(resultLineitemobj[i]);
                                        }
                                    }
                                    else
                                    {
                                        ObsolatePartDetail objobpartDet = new ObsolatePartDetail();
                                        objobpartDet = resultLineitemobj[0];
                                        objobpartDet.AlternatePart = null;
                                        objobpartDet.alternatePartMFG = null;
                                        objobpartDet.alternateTentativePrice = null;
                                        objobpartDet.rohsReplacementPart = result[i].rohsalternatePart;
                                        objobpartDet.rohsReplacementPartMFG = result[i].rohsalternateMFG;
                                        objobpartDet.rohsalternateTentativePrice = result[i].rohsalternateTentativePrice;
                                        obPartdetail.obsoletePartDetails.Add(objobpartDet);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                obPartdetail = obsolatePartDet;
            }
            var csv = new StringBuilder();
            csv.AppendLine("Customer" + "," + "AssyPN" + "," + "LineID" + "," + "QPA" + "," + "CPN" + "," + "CPN Rev" + "," + "MFR" + "," + "MFR PN" + "," + "LTB Date" + "," + "EOL Date" + "," + "Part Status" + "," + "Tentative Price" + "," + "Suggested Alternate MFR" + "," + "Suggested Alternate MFR PN" + "," + "Tentative Price" + "," + "RoHS Replacement MFR" + "," + "RoHS Replacement MFR PN" + "," + "Tentative Price" + "," + "Customer Comment");
            foreach (var item in obPartdetail.obsoletePartDetails)
            {
                csv.AppendLine("\"" + item.Customer + "\",\"" + item.AssyPN + "\"," + item.LineID + "," + item.QPA + "," + item.CPN + "," + item.CPNRev + ",\"" + item.mfgName + "\",\"" + item.mfgPN + "\"," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.LTBDate) + "," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.EOLDate) + "," + item.PartStatus + "," + (item.TentativePrice > 0 ? item.TentativePrice : null) + ",\"" + item.alternatePartMFG + "\",\"" + item.AlternatePart + "\"" + "," + (item.alternateTentativePrice > 0 ? item.alternateTentativePrice : null) + ",\"" + item.rohsReplacementPartMFG + "\",\"" + item.rohsReplacementPart + "\"" + "," + (item.rohsalternateTentativePrice > 0 ? item.rohsalternateTentativePrice : null) + "");
            }

            csv.AppendLine();
            csv.AppendLine();
            csv.AppendLine("\"" + obsolatePartDet.additionalNotes);

            byte[] bytes = Encoding.ASCII.GetBytes(csv.ToString());
            return bytes;
        }
        public ObsolatePartDet GetAlternatePartDetails(int smfgPnId, int lintitemId, string radioFilterValue)
        {
            return _iObsoletePartReportRepository.GetAlternatePartDetails(smfgPnId, lintitemId, radioFilterValue);
        }
        void AlternatePartSubreportProcessingDetails(object sender, SubreportProcessingEventArgs e)
        {
            int smfgPnId = int.Parse((e.Parameters["mfgPNId"]).Values[0]);
            int lintitemId = int.Parse((e.Parameters["lineitemid"]).Values[0]);
            string radioFilterValue = (e.Parameters["radioFilterValue"]).Values[0].ToString();
            ObsolatePartDet obsolatePartDet = GetAlternatePartDetails(smfgPnId, lintitemId, radioFilterValue);
            e.DataSources.Add(new ReportDataSource("alternatePartDetForObsoletePartReportDetail", obsolatePartDet.alternatePartDetForObsoletePartReportDetail));
        }
        public ObsolatePartDet GetRohsPartDetails(int smfgPnId, int lintitemId, string radioFilterValue)
        {
            return _iObsoletePartReportRepository.GetRohsPartDetails(smfgPnId, lintitemId, radioFilterValue);
        }
        void RohsPartSubreportProcessingDetails(object sender, SubreportProcessingEventArgs e)
        {
            int smfgPnId = int.Parse((e.Parameters["mfgPNId"]).Values[0]);
            int lintitemId = int.Parse((e.Parameters["lineitemid"]).Values[0]);
            string radioFilterValue = (e.Parameters["radioFilterValue"]).Values[0].ToString();
            ObsolatePartDet obsolatePartDet = GetRohsPartDetails(smfgPnId, lintitemId, radioFilterValue);
            e.DataSources.Add(new ReportDataSource("rohsPartDetForObsoletePartReportDetail", obsolatePartDet.rohsPartDetForObsoletePartReportDetail));
        }
        public ObsolatePartDet GetAssemblyManualPartDetail(int partID)
        {
            return _iObsoletePartReportRepository.GetAssemblyManualPartDetail(partID);
        }
        void AssemblyManualPartDetail(object sender, SubreportProcessingEventArgs e)
        {
            int partID = int.Parse((e.Parameters["partID"]).Values[0]);
            ObsolatePartDet obsolatePartDet = GetAssemblyManualPartDetail(partID);
            e.DataSources.Add(new ReportDataSource("assemblyManualPartDetail", obsolatePartDet.assemblyManualPartDetailViewModel));
        }
        public PartUsageDetailMain GetPartUsageDetails(PartUsageRequestModel partUsageRequestModel)
        {
            objPartUsageRequestModel = partUsageRequestModel;
            return _iPartRepository.GetPartUsageDetails(partUsageRequestModel);
        }

        public byte[] GetPartUsageReportBytes(PartUsageDetailMain objPartUsageDetailMain)
        {
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            ReportDataSource partUsageDetails = new ReportDataSource("PartUsageDet", objPartUsageDetailMain.partUsageDet);
            localReport.DataSources.Add(partUsageDetails);
            localReport.SubreportProcessing += new SubreportProcessingEventHandler(SubreportProcessingDetails);
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/PartUsageReportMain.rdlc");
            var Disclaimer = _iCommonBusinessLogic.getDisclaimer();
            var DateFormat = _iCommonBusinessLogic.getDateFormat();
            var TimeFormat = _iCommonBusinessLogic.getTimeFormat();
            var DateTimeFormat = _iCommonBusinessLogic.getDateTimeFormat();
            var fromdate = objPartUsageDetailMain.FromDate;
            var todate = objPartUsageDetailMain.ToDate;
            CommonReportDesignViewModel commonReportDesignViewModel = _iCommonBusinessLogic.getReportCommonData();
            ReportParameter[] param = new ReportParameter[12];
            param[0] = new ReportParameter("DateFormat", DateFormat);
            param[1] = new ReportParameter("DateTimeFormat", DateTimeFormat);
            param[2] = new ReportParameter("TimeFormat", TimeFormat);
            param[3] = new ReportParameter("Disclaimer", Disclaimer);
            param[4] = new ReportParameter("FontSize", commonReportDesignViewModel.fontSize);
            param[5] = new ReportParameter("FontFamily", commonReportDesignViewModel.fontFamily);
            param[6] = new ReportParameter("HeaderFontSize", commonReportDesignViewModel.tableHeaderFontSize);
            param[7] = new ReportParameter("HeaderFontWeight", commonReportDesignViewModel.headerFontWeight);
            param[8] = new ReportParameter("CompanyLogoURL", commonReportDesignViewModel.companyLogoURL);
            param[9] = new ReportParameter("ReportDefaultImagesPath", commonReportDesignViewModel.ReportDefaultImagesPath);
            param[10] = new ReportParameter("FromDate", objPartUsageDetailMain.FromDate.ToString(DateFormat));
            param[11] = new ReportParameter("ToDate", objPartUsageDetailMain.ToDate.ToString(DateFormat));
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
        public PartUsageDetailMain GetPartUsageDetails(string sPartID, PartUsageRequestModel partUsageRequestModel)
        {
            return _iPartRepository.GetPartWiseUsageDetails(sPartID, partUsageRequestModel);
        }
        void SubreportProcessingDetails(object sender, SubreportProcessingEventArgs e)
        {
            string sDetID = (e.Parameters["pPartID"]).Values[0].ToString();
            PartUsageDetailMain partUsageDetailMain = GetPartUsageDetails(sDetID, objPartUsageRequestModel);
            e.DataSources.Add(new ReportDataSource("PartUsageDet", partUsageDetailMain.partUsageDet));
            e.DataSources.Add(new ReportDataSource("AssyWisePartUsageDetail", partUsageDetailMain.assyWisePartUsageDetail));
            e.DataSources.Add(new ReportDataSource("MonthWisePartUsageDetail", partUsageDetailMain.monthWisePartUsageDetail));
        }
        /// <summary>
        /// Get Reversal Part Details
        /// </summary>
        /// <param name="reversalPartRequestModel"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns>ReversalPartDet</returns>
        public ReversalPartDet GetReversalPartDetails(ReversalPartRequestModel reversalPartRequestModel, string APIProjectURL)
        {
            return _iObsoletePartReportRepository.GetReversalPartDetails(reversalPartRequestModel, APIProjectURL);
        }
        /// <summary>
        /// Reversal Part CSV Bytes
        /// </summary>
        /// <param name="reversalPartDet"></param>
        /// <returns>byte[]</returns>
        public byte[] ReversalPartCSVBytes(ReversalPartDet reversalPartDet)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Customer" + "," + "AssyPN" + "," + "LineID" + "," + "QPA" + "," + "CPN" + "," + "CPN Rev" + "," + "MFR" + "," + "MFR PN" + "," + "LTB Date" + "," + "Reversal Date" + "," + "Part Status" + "," + "Tentative Price" + "," + "Alternate MFR" + "," + "Alternate MFR PN" + "," + "Customer Comment");
            foreach (var item in reversalPartDet.reversalPartDetail)
            {
                csv.AppendLine("\"" + item.Customer + "\",\"" + item.AssyPN + "\"," + item.LineID + "," + item.QPA + "," + item.CPN + "," + item.CPNRev + ",\"" + item.mfgName + "\",\"" + item.mfgPN + "\"," + (item.isReversal == true ? "Yes" : "No") + "," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.reversalDate) + "," + item.PartStatus + "," + (item.TentativePrice > 0 ? item.TentativePrice : null) + ",\"" + item.alternatePartMFG + "\",\"" + item.AlternatePart + "\"" + "");
            }

            byte[] bytes = Encoding.ASCII.GetBytes(csv.ToString());
            return bytes;
        }
        /// <summary>
        /// Reversal Part Report Bytes
        /// </summary>
        /// <param name="reversalPartDet"></param>
        /// <param name="reversalPartRequestModel"></param>
        /// <returns>byte[]</returns>
        public byte[] ReversalPartReportBytes(ReversalPartDet reversalPartDet, ReversalPartRequestModel reversalPartRequestModel)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = HttpContext.Current.Server.MapPath("~/Reports/ReversalPartDetail.rdlc");
            ReportDataSource ReversalPartDetails = new ReportDataSource("ReversalPartDetails", reversalPartDet.reversalPartDetail);
            localReport.DataSources.Add(ReversalPartDetails);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", reversalPartDet.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            ReportParameter[] param = new ReportParameter[4];
            param[0] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[1] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[2] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[3] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);

            SetReportCommonParameters(ref param);

            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }
        /// <summary>
        /// Get Obsolete Part Details For Company
        /// </summary>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns></returns>
        public ObsoletePartDetForCompany GetObsoletePartDetailsForCompany(ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest, string APIProjectURL)
        {
            return _iObsoletePartReportRepository.GetObsoletePartDetailsForCompany(obsoletePartForCompanyRequest, APIProjectURL);
        }

        /// <summary>
        /// Get Obsolete Part Details For Company Report Bytes
        /// </summary>
        /// <param name="obsolatePartDetailForCompany"></param>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <returns>byte[]</returns>
        public byte[] GetObsoletePartDetailsForCompanyReportBytes(ObsoletePartDetForCompany obsolatePartDetailForCompany, ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest)
        {
            CommonReportNumberFormatViewModel objCommonReportNumberFormat = _iCommonBusinessLogic.getReportCommonNumberFormat();
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = System.Web.HttpContext.Current.Server.MapPath("~/Reports/ObsoletePartDetailForCompany.rdlc");
            ReportDataSource ObsoletePartDetails = new ReportDataSource("ObsoletePartDetails", obsolatePartDetailForCompany.obsoletePartDetailForCompany);
            localReport.DataSources.Add(ObsoletePartDetails);
            ReportDataSource CompanyDetails = new ReportDataSource("CompanyDetail", obsolatePartDetailForCompany.CompanyDetails);
            localReport.DataSources.Add(CompanyDetails);
            ReportParameter[] param = new ReportParameter[6];
            param[0] = new ReportParameter("RoHSImagePath", Constant.Constant.FJTApiUrl + Constant.Constant.RoHSImagesURL);
            param[1] = new ReportParameter("UnitPriceFilterDecimal", objCommonReportNumberFormat.UnitPrice.Report);
            param[2] = new ReportParameter("AmountFilterDecimal", objCommonReportNumberFormat.Amount.Report);
            param[3] = new ReportParameter("NumberWithoutDecimal", objCommonReportNumberFormat.Unit.Report);
            param[4] = new ReportParameter("FromDate", obsoletePartForCompanyRequest.fromdate.ToString());
            param[5] = new ReportParameter("ToDate", obsoletePartForCompanyRequest.todate.ToString());
            SetReportCommonParameters(ref param);
            localReport.SetParameters(param);

            localReport.Refresh();
            byte[] bytes = localReport.Render("PDF");
            return bytes;
        }

        /// <summary>
        /// Obsolete Part For Company CSV Bytes
        /// </summary>
        /// <param name="obsoletePartDet"></param>
        /// <returns></returns>
        public byte[] ObsoletePartForCompanyCSVBytes(ObsoletePartDetForCompany obsoletePartDet)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Customer" + "," + "AssyPN" + "," + "LineID" + "," + "QPA" + "," + "CPN" + "," + "CPN Rev" + "," + "MFR" + "," + "MFR PN" + "," + "LTB Date" + "," + "Obsolete Date" + "," + "EOL Date" + "," + "Part Status" + "," + "Tentative Price" + "," + "Alternate MFR" + "," + "Alternate MFR PN" + "," + "Customer Comment");
            foreach (var item in obsoletePartDet.obsoletePartDetailForCompany)
            {
                csv.AppendLine("\"" + item.Customer + "\",\"" + item.AssyPN + "\"," + item.LineID + "," + item.QPA + "," + item.CPN + "," + item.CPNRev + ",\"" + item.mfgName + "\",\"" + item.mfgPN + "\"," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.LTBDate) + "," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.obsoleteDate) + "," + string.Format(Constant.Constant.GetDateFormat(Constant.Constant.DateFormat), item.EOLDate) + "," + item.PartStatus + "," + (item.TentativePrice > 0 ? item.TentativePrice : null) + ",\"" + item.alternatePartMFG + "\",\"" + item.AlternatePart + "\"" + "");
            }

            byte[] bytes = Encoding.ASCII.GetBytes(csv.ToString());
            return bytes;
        }

    }
}