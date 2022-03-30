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
    // [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/CreditMemoReport")]
    public class CreditMemoController : ApiController
    {
        private readonly ICreditMemoService _iCreditMemoService;
        public CreditMemoController(ICreditMemoService iCreditMemoService)
        {
            _iCreditMemoService = iCreditMemoService;
        }
        [HttpPost]
        [Route("getCustomerCreditMemoReportDetails")]
        public HttpResponseMessage getCustomerCreditMemoReportDetails(CreditMemoRequestModel creditMemo)
        {
            try
            {
                LocalReport localReport = new LocalReport();
                CreditMemoResponseModel creditMemoResponse = _iCreditMemoService.GetCreditMemoDetails(creditMemo);
                if (creditMemoResponse != null)
                {
                    byte[] bytes = _iCreditMemoService.CreditMemoReportBytes(creditMemoResponse, creditMemo);
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