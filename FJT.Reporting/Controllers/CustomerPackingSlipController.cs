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
    [RoutePrefix("api/CustomerPackingSlip")]
    public class CustomerPackingSlipController : ApiController
    {
        private readonly ICustomerPackingSlipService _iCustomerPackingSlipService;
        private readonly IBOSendMail _iBOSendMail;
        private readonly IErrorLog _IErrorLog;
        // private readonly IEmail_SchedulemstRepository _IEmail_SchedulemstRepository;
        public CustomerPackingSlipController(ICustomerPackingSlipService iCustomerPackingSlipService, IBOSendMail iBOSendMail, IErrorLog IErrorLog)
        {
            _iCustomerPackingSlipService = iCustomerPackingSlipService;
            _iBOSendMail = iBOSendMail;
            _IErrorLog = IErrorLog;
        }

        [HttpPost]
        [Route("customerPackingSlipReport")]
        public HttpResponseMessage customerPackingSlipReport(CustomerPackingSlipRequestModel customerPackingSlipRequestModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();


                localReport.EnableExternalImages = true;
                //localReport.DisplayName = 'MFR Creation Report';
                string apiURL = Constant.Constant.FJTApiUrl;

                CustomerPackingSlipDetail customerPackingSlipDetail = _iCustomerPackingSlipService.GetCustomerPackingSlipDetail(customerPackingSlipRequestModel, apiURL);

                byte[] bytes = _iCustomerPackingSlipService.GetCustomerPackingSlipDetailReportBytes(customerPackingSlipDetail, customerPackingSlipRequestModel);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
               
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