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
    [RoutePrefix("api/Manufacturer")]
    public class ManufacturerController : ApiController
    {
        private readonly IManufacturerService _iManufacturerService;
        private readonly IBOSendMail _iBOSendMail;
        private readonly IErrorLog _IErrorLog;
        // private readonly IEmail_SchedulemstRepository _IEmail_SchedulemstRepository;
        public ManufacturerController(IManufacturerService iManufacturerService, IBOSendMail iBOSendMail, IErrorLog IErrorLog)
        {
            _iManufacturerService = iManufacturerService;
            _iBOSendMail = iBOSendMail;
            _IErrorLog = IErrorLog;
        }

        [HttpPost]
        [Route("generateManufacturerReport")]
        public HttpResponseMessage generateManufacturerReport(ManufacturerRequestModel manufacturerListModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();


                localReport.EnableExternalImages = true;
                //localReport.DisplayName = 'MFR Creation Report';
                string apiURL = Constant.Constant.FJTApiUrl;

                ManufacturerDetail manufacturerDetail = _iManufacturerService.GetManufacturerDetail(manufacturerListModel, apiURL);

                byte[] bytes = _iManufacturerService.GetManufacturerDetailReportBytes(manufacturerDetail, manufacturerListModel);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                // Start -  Send Mail code after generate report from RDLC
                try
                {
                    if (manufacturerDetail != null && manufacturerDetail.ManufacturerDetailResponse.Count > 0)
                    {
                        _iBOSendMail.SendEmail(manufacturerListModel.sentToEmail, manufacturerListModel.sentCCEmail, manufacturerListModel.sentBCCEmail,
                         manufacturerListModel.reportName, bytes, new byte[0], manufacturerListModel.customerCompanyName, manufacturerListModel.emailTemplete, manufacturerListModel.refID);
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