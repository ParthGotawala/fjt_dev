using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using static FJT.Reporting.Constant.Constant;

namespace FJT.Reporting.Controllers
{
    [RoutePrefix("api/Part")]
    public class PartController : ApiController
    {
        private readonly IPartService _iPartService;
        private readonly IBOSendMail _iBOSendMail;
        private readonly IErrorLog _IErrorLog;
        // private readonly IEmail_SchedulemstRepository _IEmail_SchedulemstRepository;
        public PartController(IPartService iPartService, IBOSendMail iBOSendMail, IErrorLog IErrorLog)/*IEmail_SchedulemstRepository IEmail_SchedulemstRepository,*/
        {
            _iPartService = iPartService;
            _iBOSendMail = iBOSendMail;
            //  _IEmail_SchedulemstRepository = IEmail_SchedulemstRepository;
            _IErrorLog = IErrorLog;
        }


        [HttpPost]
        [Route("generateObsoletePartReport")]
        public HttpResponseMessage generateObsoletePartReport(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                ObsolatePartDet obsolatePartDet = _iPartService.GetObsolatePartDetails(obsoletePartRequestModel);
                ObsolatePartDet obsolatePartCSVDet = _iPartService.GetObsolatePartCSVDetails(obsoletePartRequestModel);

                byte[] bytes = _iPartService.ObsolatePartReportBytes(obsolatePartDet, obsoletePartRequestModel);
                byte[] csvbyte = _iPartService.ObsolatePartCSVBytes(obsolatePartCSVDet, obsoletePartRequestModel);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                // Start -  Send Mail code after generate report from RDLC
                try
                {
                    if (obsolatePartDet != null)
                    {
                        _iBOSendMail.SendEmail(obsoletePartRequestModel.sentToEmail, obsoletePartRequestModel.sentCCEmail, obsoletePartRequestModel.sentBCCEmail,
                            obsoletePartRequestModel.reportName, bytes, csvbyte, obsoletePartRequestModel.customerCompanyName, obsoletePartRequestModel.emailTemplete, obsoletePartRequestModel.refID);
                    }
                }
                catch (Exception ex)
                {
                    ServiceLog objServiceLog = new ServiceLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Constant.Constant.Report
                    };
                    _IErrorLog.sendErrorLog(objServiceLog);
                }
                return response;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                return response;
            }
        }

        [HttpPost]
        [Route("generateObsoletePartCSVReport")]
        public HttpResponseMessage generateObsoletePartCSVReport(ObsoletePartRequestModel obsoletePartRequestModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;

                ObsolatePartDet obsolatePartCSVDet = _iPartService.GetObsolatePartCSVDetails(obsoletePartRequestModel);

                if (obsolatePartCSVDet != null)
                {
                    byte[] csvbyte = _iPartService.ObsolatePartCSVBytes(obsolatePartCSVDet, obsoletePartRequestModel);
                    Stream stream = new MemoryStream(csvbyte);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
                    return response;
                }
                else
                {
                    return responseNotfound;
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                return response;
            }
        }

        [HttpPost]
        [Route("generatePartUsageReport")]
        public HttpResponseMessage generatePartUsageReport(PartUsageRequestModel partUsageRequestModel)
        {
            try
            {
                try
                {
                    PartUsageDetailMain partUsageDet = _iPartService.GetPartUsageDetails(partUsageRequestModel);

                    partUsageDet.FromDate = partUsageRequestModel.fromDate;
                    partUsageDet.ToDate = partUsageRequestModel.toDate;
                    byte[] bytes = _iPartService.GetPartUsageReportBytes(partUsageDet);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(bytes);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                    //send email
                    if (partUsageDet.partUsageDet.Count > 0)
                    {
                        _iBOSendMail.SendEmail(partUsageRequestModel.sentToEmail, partUsageRequestModel.sentCCEmail, partUsageRequestModel.sentBCCEmail,
                            partUsageRequestModel.reportName, bytes, new byte[0], partUsageRequestModel.customerCompanyName, partUsageRequestModel.emailTemplete, partUsageRequestModel.refID);
                    }
                    return response;
                }
                catch (Exception ex)
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                    return response;
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                return response;
            }
        }

        [HttpPost]
        [Route("generateReversalPartReport")]
        public HttpResponseMessage generateReversalPartReport(ReversalPartRequestModel reversalPartRequestModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = FJTApiUrl;

                ReversalPartDet reversalPartDet = _iPartService.GetReversalPartDetails(reversalPartRequestModel, apiURL);

                byte[] bytes = _iPartService.ReversalPartReportBytes(reversalPartDet, reversalPartRequestModel);
                byte[] csvbyte = _iPartService.ReversalPartCSVBytes(reversalPartDet);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                // Start -  Send Mail code after generate report from RDLC
                try
                {
                    if (reversalPartDet != null && reversalPartDet.reversalPartDetail.Count > 0)
                    {
                        //send email
                        _iBOSendMail.SendEmail(reversalPartRequestModel.sentToEmail, reversalPartRequestModel.sentCCEmail, reversalPartRequestModel.sentBCCEmail,
                            reversalPartRequestModel.reportName, bytes, csvbyte, reversalPartRequestModel.customerCompanyName, reversalPartRequestModel.emailTemplete, reversalPartRequestModel.refID);
                        //_IEmail_SchedulemstRepository.updateEmailSchedule(reversalPartRequestModel.refID);
                        //start update database for send email time
                    }
                }
                catch (Exception ex)
                {
                    ServiceLog objServiceLog = new ServiceLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Constant.Constant.Report
                    };
                    _IErrorLog.sendErrorLog(objServiceLog);
                }
                return response;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                return response;
            }
        }

        /// <summary>
        /// generate Obsolete Part Report For Company
        /// </summary>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <returns>HttpResponseMessage</returns>
        [HttpPost]
        [Route("generateObsoletePartReportForCompany")]
        public HttpResponseMessage generateObsoletePartReportForCompany(ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                ObsoletePartDetForCompany obsoletePartDet = _iPartService.GetObsoletePartDetailsForCompany(obsoletePartForCompanyRequest, apiURL);

                byte[] bytes = _iPartService.GetObsoletePartDetailsForCompanyReportBytes(obsoletePartDet, obsoletePartForCompanyRequest);
                byte[] csvbyte = _iPartService.ObsoletePartForCompanyCSVBytes(obsoletePartDet);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                // Start -  Send Mail code after generate report from RDLC
                try
                {
                    if (obsoletePartDet != null && obsoletePartDet.obsoletePartDetailForCompany.Count > 0)
                    {
                        _iBOSendMail.SendEmail(obsoletePartForCompanyRequest.sentToEmail, obsoletePartForCompanyRequest.sentCCEmail, obsoletePartForCompanyRequest.sentBCCEmail,
                            obsoletePartForCompanyRequest.reportName, bytes, csvbyte, obsoletePartForCompanyRequest.customerCompanyName, obsoletePartForCompanyRequest.emailTemplete, obsoletePartForCompanyRequest.refID);
                    }
                }
                catch (Exception ex)
                {
                    ServiceLog objServiceLog = new ServiceLog()
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace,
                        Source = Constant.Constant.Report
                    };
                    _IErrorLog.sendErrorLog(objServiceLog);
                }
                return response;

            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                return response;
            }
        }
    }
}
