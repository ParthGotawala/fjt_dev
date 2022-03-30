using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System;
using System.Collections;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using static FJT.Reporting.Constant.Constant;

namespace FJT.Reporting.Controllers
{
    // [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/SalesOrderReport")]
    public class SalesOrderReportController : ApiController
    {
        private readonly ISalesOrderReportService _iSalesOrderReportService;
        private readonly IBOSendMail _iBOSendMail;
        public SalesOrderReportController(ISalesOrderReportService iSalesOrderReportService, IBOSendMail iBOSendMail)
        {
            _iSalesOrderReportService = iSalesOrderReportService;
            _iBOSendMail = iBOSendMail;
        }
        [HttpPost]
        [Route("salesOrderReport")]
        public HttpResponseMessage salesOrderReport(SalesOrderRequestModel salesOrderRequestModel)
        {
            try
            {
                LocalReport localReport = new LocalReport();
                SalesOrderReportDet salesOrderReportDet = _iSalesOrderReportService.GetSalesOrderReportDetDetails(salesOrderRequestModel);
                if (salesOrderReportDet != null)
                {
                    byte[] bytes = _iSalesOrderReportService.SalesOrderReportBytes(salesOrderReportDet, salesOrderRequestModel);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(bytes);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                    //send email
                    _iBOSendMail.SendEmail(salesOrderRequestModel.sentToEmail, salesOrderRequestModel.sentCCEmail, salesOrderRequestModel.sentBCCEmail,
                            salesOrderRequestModel.reportName, bytes, new byte[0], salesOrderRequestModel.customerCompanyName, salesOrderRequestModel.emailTemplete, salesOrderRequestModel.refID);
                    return response;
                }
                else
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                    return response;
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return response;
            }
        }
    }
}