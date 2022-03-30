using FJT.Reporting.BusinessLogic.Interface;
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
    [RoutePrefix("api/Labor")]
    public class LaborAssyController : ApiController
    {
        private readonly ILaborAssyService _ILaborAssyService;
        private readonly IBOSendMail _iBOSendMail;
        public LaborAssyController(ILaborAssyService ILaborAssyService, IBOSendMail IBOSendMail)
        {
            _ILaborAssyService = ILaborAssyService;
            _iBOSendMail = IBOSendMail;
        }
        [HttpPost]
        [Route("generateLaborAssyReport")]
        public HttpResponseMessage generateLaborAssyReport(LaborAssyRequestModel laborAssyRequestModel)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            HttpResponseMessage responseNoContent = new HttpResponseMessage(HttpStatusCode.NoContent);
            try
            {
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                List<LaborAssyDetailModel> laborAssyDetails = _ILaborAssyService.GetLaborAssyDetail(laborAssyRequestModel, apiURL);

                byte[] bytes = _ILaborAssyService.LaborAssyReportBytes(laborAssyDetails);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                //send email
                _iBOSendMail.SendEmail(laborAssyRequestModel.sentToEmail, laborAssyRequestModel.sentCCEmail, laborAssyRequestModel.sentBCCEmail,
                        laborAssyRequestModel.reportName, bytes, new byte[0], laborAssyRequestModel.customerCompanyName, laborAssyRequestModel.emailTemplete, laborAssyRequestModel.refID);
                return response;
            }
            catch (Exception ex)
            {
                return response;
            }
        }

        [HttpPost]
        [Route("generateLaborComparisonEstimatedvsActualReport")]
        public HttpResponseMessage generateLaborComparisonEstimatedvsActualReport(LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            HttpResponseMessage responseNoContent = new HttpResponseMessage(HttpStatusCode.NoContent);
            try
            {
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                LaborComparisonEsimatedvsActualDetail laborComparisonEsimatedvsActualDetail = _ILaborAssyService.GetLaborComparisonEstimatedvsActualDetail(laborComparisonEstimatedvsActualRequestModel, apiURL);

                byte[] bytes = _ILaborAssyService.GetLaborComparisonEstimatedvsActualDetailReportBytes(laborComparisonEsimatedvsActualDetail, laborComparisonEstimatedvsActualRequestModel);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                ////send email
                //_iBOSendMail.SendEmail(laborComparisonEstimatedvsActualRequestModel.sentToEmail, laborComparisonEstimatedvsActualRequestModel.sentCCEmail, laborComparisonEstimatedvsActualRequestModel.sentBCCEmail,
                //        laborComparisonEstimatedvsActualRequestModel.reportName, bytes, new byte[0], laborComparisonEstimatedvsActualRequestModel.customerCompanyName, laborComparisonEstimatedvsActualRequestModel.emailTemplete, laborComparisonEstimatedvsActualRequestModel.refID);
                return response;
            }
            catch (Exception ex)
            {
                return response;
            }
        }
    }
}