using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace FJT.Reporting.Controllers
{
    [RoutePrefix("api/InvoicePayment")]
    public class PackingSlipInvoicePaymentController : ApiController
    {
        private readonly IErrorLog _IErrorLog;
        private readonly IPackingSlipInvoicePaymentService _IPackingSlipInvoicePaymentService;
        public PackingSlipInvoicePaymentController(IErrorLog IErrorLog, IPackingSlipInvoicePaymentService IPackingSlipInvoicePaymentService)
        {
            _IErrorLog = IErrorLog;
            _IPackingSlipInvoicePaymentService = IPackingSlipInvoicePaymentService;
        }

        [HttpPost]
        [Route("checkPrintAndRemittanceReport")]
        public HttpResponseMessage checkPrintAndRemittanceReport(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel)
        {
            try
            {
                _IErrorLog.SaveReportLog("Check Report API Get Data Begin!");
                CheckPrintAndRemittanceCustRefundReportVM checkPrintAndRemittanceCustRefundReportVM = _IPackingSlipInvoicePaymentService.GetCheckPrintAndRemittancePaymentDetails(checkPrintAndRemittanceRequestModel);
                _IErrorLog.SaveReportLog("Check Report API Get Data Completed!");
                if (checkPrintAndRemittanceCustRefundReportVM.PaymentDetails.Count > 0)
                {
                    byte[] bytes = _IPackingSlipInvoicePaymentService.GetCheckPrintAndRemittanceReportBytes(checkPrintAndRemittanceCustRefundReportVM, checkPrintAndRemittanceRequestModel.isRemittanceReport);
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
