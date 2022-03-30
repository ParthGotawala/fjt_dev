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
    [RoutePrefix("api/PackingSlip")]
    public class PackingSlipController : ApiController
    {
        private readonly IErrorLog _IErrorLog;
        private readonly IPackingSlipService _IPackingSlipService;
        private readonly IBOSendMail _iBOSendMail;
        public PackingSlipController(IErrorLog IErrorLog, IPackingSlipService IPackingSlipService, IBOSendMail IBOSendMail)
        {
            _IErrorLog = IErrorLog;
            _IPackingSlipService = IPackingSlipService;
            _iBOSendMail = IBOSendMail;
        }

        [HttpPost]
        [Route("supplierPerformanceReport")]
        public HttpResponseMessage supplierPerformanceReport(SupplierPerformanceRequestModel supplierPerformanceRequestModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                SupplierPerformanceDetail supplierPerformanceDetail = _IPackingSlipService.GetSupplierPerformanceDetails(supplierPerformanceRequestModel, apiURL);

                byte[] bytes = _IPackingSlipService.GetSupplierPerformanceReportBytes(supplierPerformanceDetail, supplierPerformanceRequestModel);
                Stream stream = new MemoryStream(bytes);
                //HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                try
                {
                    if (supplierPerformanceDetail.SupplierPerformanceDet.Count > 0)
                    {
                        //send email
                        _iBOSendMail.SendEmail(supplierPerformanceRequestModel.sentToEmail, supplierPerformanceRequestModel.sentCCEmail, supplierPerformanceRequestModel.sentBCCEmail,
                            supplierPerformanceRequestModel.reportName, bytes, new byte[0], supplierPerformanceRequestModel.customerCompanyName, supplierPerformanceRequestModel.emailTemplete, supplierPerformanceRequestModel.refID);
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
                return response;
            }
        }

        [HttpPost]
        [Route("partnerPerformanceReport")]
        public HttpResponseMessage partnerPerformanceReport(PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                HttpResponseMessage responseNotfound = new HttpResponseMessage(HttpStatusCode.NotFound);
                LocalReport localReport = new LocalReport();

                localReport.EnableExternalImages = true;
                string apiURL = Constant.Constant.FJTApiUrl;

                PartnerPerformanceDetail partnerPerformanceDetail = _IPackingSlipService.GetPartnerPerformanceDetails(partnerPerformanceRequestViewModel, apiURL);

                byte[] bytes = _IPackingSlipService.GetPartnerPerformanceReportBytes(partnerPerformanceDetail, partnerPerformanceRequestViewModel);
                Stream stream = new MemoryStream(bytes);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                try
                {
                    //send email
                    if (partnerPerformanceDetail.PartnerPerformanceDet.Count > 0)
                    {
                        _iBOSendMail.SendEmail(partnerPerformanceRequestViewModel.sentToEmail, partnerPerformanceRequestViewModel.sentCCEmail, partnerPerformanceRequestViewModel.sentBCCEmail,
                        partnerPerformanceRequestViewModel.reportName, bytes, new byte[0], partnerPerformanceRequestViewModel.customerCompanyName, partnerPerformanceRequestViewModel.emailTemplete, partnerPerformanceRequestViewModel.refID);
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
                return response;
            }
        }

        [HttpPost]
        [Route("debitMemoReport")]
        public HttpResponseMessage debitMemoReport(DebitMemoRequestModel debitMemoRequestModel)
        {
            try
            {
                DebitMemoReportDet debitMemoReportDet = _IPackingSlipService.GetDebitMemoDetails(debitMemoRequestModel);
                if (debitMemoReportDet != null && debitMemoReportDet.debitMemoDetail != null)
                {
                    byte[] bytes = _IPackingSlipService.GetDebitMemoReportBytes(debitMemoReportDet);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(bytes);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                    return response;
                }
                else
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NoContent);
                    return response;
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return response;
            }
        }


        [HttpPost]
        [Route("checkPrintAndRemittanceReport")]
        public HttpResponseMessage checkPrintAndRemittanceReport(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            try
            {
                _IErrorLog.SaveReportLog("Check Report API Get Data Begin!");
                CheckPrintAndRemittanceReportDetail checkPrintAndRemittanceReportDetail = _IPackingSlipService.GetCheckPrintAndRemittancePaymentDetails(checkPrintAndRemittanceRequestModel);
                _IErrorLog.SaveReportLog("Check Report API Get Data Completed!");
                if (checkPrintAndRemittanceReportDetail.PaymentDetails.Count > 0)
                {
                    byte[] bytes = _IPackingSlipService.GetCheckPrintAndRemittanceReportBytes(checkPrintAndRemittanceReportDetail, checkPrintAndRemittanceRequestModel.isRemittanceReport);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(bytes);
                    response.Content = new StreamContent(stream);
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    _IErrorLog.SaveReportLog("Check Report API before 'return response'");
                    return response;
                }
                else
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NoContent);
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
