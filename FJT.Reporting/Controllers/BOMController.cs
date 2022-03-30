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
    [RoutePrefix("api/BOM")]
    public class BOMController : ApiController
    {
        private readonly ISystemConfigrationService _iSystemConfigrationService;
        private readonly IRFQService _iRFQService;

        public BOMController(ISystemConfigrationService iSystemConfigrationService, IRFQService iRFQService)
        {
            _iSystemConfigrationService = iSystemConfigrationService;
            _iRFQService = iRFQService;
        }

        //[CustomAuthorize]
        [HttpGet]
        [Route("getRFQDetail")]
        public HttpResponseMessage getRFQDetail()
        {
            var configList = _iSystemConfigrationService.GetSystemConfigrationList();
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            return response;
        }

        [HttpPost]
        [Route("generateQuoteSummaryReport")]
        public HttpResponseMessage generateQuoteSummaryReport(QuoteSummaryModel quoteSummaryModel)
        {
            try
            {
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                QuoteSummaryDet quoteSummaryDet = _iRFQService.GetQuoteSummaryDetails(quoteSummaryModel, apiURL);
                QuoteIsSubjectToFollowingDet quoteQuoteisSubjectToFollowingDetails = _iRFQService.GetQuoteisSubjectToFollowingDetails(quoteSummaryModel);
                if (quoteSummaryDet != null)
                {
                    byte[] bytes = _iRFQService.QuoteSummaryReportBytes(quoteSummaryDet, quoteQuoteisSubjectToFollowingDetails, quoteSummaryModel.ShowAvailableStock, quoteSummaryModel.CompanyCode, quoteSummaryModel.isCustomPartDetShowInReport, quoteSummaryModel.format);
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
