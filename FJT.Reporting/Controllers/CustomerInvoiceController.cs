using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
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

namespace FJT.Reporting.Controllers
{
    [RoutePrefix("api/CustomerInvoice")]
    public class CustomerInvoiceController : ApiController
    {
        // GET: CustomerInvoice
        private readonly ICustomerInvoiceService _iCustomerInvoiceService;
        public CustomerInvoiceController(ICustomerInvoiceService iCustomerInvoiceService)
        {
            _iCustomerInvoiceService = iCustomerInvoiceService;
        }
        [HttpPost]
        [Route("GetCustomerInvoiceReportDetails")]
        public HttpResponseMessage GetCustomerInvoiceReportDetails(CustomerInvoiceRequestModel customerInvoiceRequestModel)
        {
            try
            {
                LocalReport localReport = new LocalReport();
                CustomerInvoiceReportDet customerInvoiceReportDet = _iCustomerInvoiceService.GetCustomerInvoiceDetails(customerInvoiceRequestModel);
                if (customerInvoiceReportDet != null)
                {
                    byte[] bytes = _iCustomerInvoiceService.CustomerInvoiceReportBytes(customerInvoiceReportDet, customerInvoiceRequestModel);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(bytes);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
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