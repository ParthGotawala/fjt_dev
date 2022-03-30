using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NReco.PdfGenerator;
using RabbitMQ.Client;
using RestSharp;
using System;
using System.Collections;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using static FJT.Reporting.Constant.Constant;

namespace FJT.Reporting.Controllers
{
    // [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/WorkOrderReport")]
    public class WorkOrderReportController : ApiController
    {
        private readonly IWorkOrderReportService _iWorkOrderReportService;
        //private readonly IBOSendMail _iBOSendMail;
        public WorkOrderReportController(IWorkOrderReportService iWorkOrderReportService
            //, IBOSendMail iBOSendMail
            )
        {
            _iWorkOrderReportService = iWorkOrderReportService;
        }
        //[HttpGet]
        //[Route("workOrderReport")]
        //public dynamic workOrderReport()
        //{
        //    //try
        //    //{
        //    //    dynamic newObj = new System.Dynamic.ExpandoObject();
        //    //    newObj.woID = 4;
        //    //    string testStr = "http://localhost:2003/api/v1/workorders/getWorkorderProfileAPI";
        //    //    var responseData = new object();
        //    //    var request = new RestRequest(Method.POST);
        //    //    request.AddParameter("woID", newObj.woID);
        //    //    request.AddHeader("Content-Type", "application/json");
        //    //    var client = new RestClient(testStr);
        //    //    var response = client.Execute(request).Content;
        //    //    return response;

        //    //    //LocalReport localReport = new LocalReport();
        //    //    //WorkOrderReportDet workOrderReportDet = _iWorkOrderReportService.GetWorkOrderReportDetDetails(workOrderRequestModel);
        //    //    //if (workOrderReportDet != null)
        //    //    //{
        //    //    //    byte[] bytes = _iWorkOrderReportService.WorkOrderReportBytes(workOrderReportDet, workOrderRequestModel);
        //    //    //    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
        //    //    //    Stream stream = new MemoryStream(bytes);
        //    //    //    response.Content = new StreamContent(stream);
        //    //    //    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
        //    //    //    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        //    //    //    return response;
        //    //    //}
        //    //    //else
        //    //    //{
        //    //    //    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
        //    //    //    return response;
        //    //    //}
        //    //    //HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
        //    //    //return responseData;
        //    //}
        //    dynamic response = null;
        //    try
        //    {

        //        JObject jObject = new JObject();
        //        jObject.Add("woID", 4);
        //        string uri = "http://localhost:2003/api/v1/workorder_profile/getWorkorderProfileAPI";
        //        var client = new RestClient(uri);
        //        var request = new RestRequest(Method.POST);
        //        request.AddHeader("Content-Type", "application/json");
        //        request.AddParameter("application/xml; charset=utf-8", jObject, ParameterType.RequestBody);

        //        var data = client.Execute(request).Content;
        //        response = JsonConvert.DeserializeObject<dynamic>(data);

        //        if (response != null)
        //        {
        //            //digiKeyConfiguration.refreshToken = response.refresh_token;
        //            //digiKeyConfiguration.accessToken = response.access_token;
        //            //_IsystemconfigrationsRepository.saveExternalConfiguration(digiKeyConfiguration);
        //            //newAccessToken = response.access_token;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response = ex;
        //    }
        //    return response;
        //}



        [HttpGet]
        [Route("workOrderReport")]
        public HttpResponseMessage workOrderReport()
        {
            dynamic response = null;
            try
            {
                JObject jObject = new JObject();
                jObject.Add("woID", 5);
                string uri = "https://192.168.0.208:2003/api/v1/workorder_profile/getWorkorderProfileAPI";
                var client = new RestClient(uri);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/xml; charset=utf-8", jObject, ParameterType.RequestBody);

                var data = client.Execute(request).Content;
                response = JsonConvert.DeserializeObject<dynamic>(data);

                if (response != null)
                {
                    byte[] fileBytes = null;
                    string FileName = "WO.pdf";
                    string colorCode = "";
                    string className = "";
                    string body = string.Empty;
                    using (StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/ReportTemplate/workorder-profile.html")))
                    {
                        body = reader.ReadToEnd();
                    }
                    dynamic woData = response.data;
                    string NoCleanOpData = string.Empty;
                    string WatersolubleOpData = string.Empty;
                    string displayNone = "display:none !important";

                    string priority = null;
                    foreach (var woCerticateData in woData.workorderProfile.workorderCertification)
                    {
                        if (priority == null)
                        {
                            priority = woCerticateData.certificateStandards != null ? woCerticateData.certificateStandards.priority : "";
                            colorCode = woCerticateData.standardsClass != null ? (woCerticateData.standardsClass.colorCode != null ? woCerticateData.standardsClass.colorCode : "") : "";
                            className = woCerticateData.standardsClass != null ? (woCerticateData.standardsClass.className != null ? woCerticateData.standardsClass.className : "") : "";
                        }
                        else
                        {
                            if (Int32.Parse(priority) > Int32.Parse(woCerticateData.certificateStandards.priority.ToString()))
                            {
                                priority = woCerticateData.certificateStandards != null ? woCerticateData.certificateStandards.priority : "";
                                colorCode = woCerticateData.standardsClass != null ? (woCerticateData.standardsClass.colorCode != null ? woCerticateData.standardsClass.colorCode : "") : "";
                                className = woCerticateData.standardsClass != null ? (woCerticateData.standardsClass.className != null ? woCerticateData.standardsClass.className : "") : "";
                            }
                        }
                    }

                    body = body.Replace("{{WOColorCode}}", colorCode != null ? colorCode.ToString() : "");
                    if (woData.workorderProfile.isStopWorkorder != null && woData.workorderProfile.isStopWorkorder.ToString() == "False")
                    {
                        body = body.Replace("{{WorkOrderNotStopThanHide}}", displayNone);
                    }
                    body = body.Replace("{{woNumber}}", woData.workorderProfile.woNumber != null ? woData.workorderProfile.woNumber.ToString() : "");
                    body = body.Replace("{{woVersion}}", woData.workorderProfile.woVersion != null ? woData.workorderProfile.woVersion.ToString() : "");
                    body = body.Replace("{{PIDCode}}", woData.workorderProfile.componentAssembly.PIDCode != null ? woData.workorderProfile.componentAssembly.PIDCode.ToString() : "");
                    body = body.Replace("{{Rev}}", woData.workorderProfile.componentAssembly.rev != null ? woData.workorderProfile.componentAssembly.rev.ToString() : "");
                    body = body.Replace("{{woSalesOrderPONumber}}", woData.workorderProfile.woSalesOrderPONumber != null ? woData.workorderProfile.woSalesOrderPONumber.ToString() : "NA");
                    body = body.Replace("{{TotalPOQty}}", woData.workorderProfile.TotalPOQty != null ? woData.workorderProfile.TotalPOQty.ToString() : "");
                    body = body.Replace("{{buildQty}}", woData.workorderProfile.buildQty != null ? woData.workorderProfile.buildQty.ToString() : "");
                    body = body.Replace("{{nickName}}", woData.workorderProfile.componentAssembly.nickName != null ? woData.workorderProfile.componentAssembly.nickName.ToString() : "");
                    body = body.Replace("{{ECORemark}}", woData.workorderProfile.ECORemark != null ? woData.workorderProfile.ECORemark.ToString() : "NA");
                    body = body.Replace("{{FCORemark}}", woData.workorderProfile.FCORemark != null ? woData.workorderProfile.FCORemark.ToString() : "NA");
                    body = body.Replace("{{isSampleAvailable}}", woData.workorderProfile.isSampleAvailable != null ? "Yes":"No");
                    body = body.Replace("{{RoHSLeadFreeIcon}}", "http://192.168.0.208:2003/uploads/rohs/images/rohs-big.png");
                    body = body.Replace("{{RoHSLeadFreeText}}", "RoHS");
                    foreach (var woHoldData in woData.workorderProfile.workorderTransHoldUnhold)
                    {
                        body = body.Replace("{{WoReason}}", woHoldData.reason != null ? woHoldData.reason.ToString() : "");
                        body = body.Replace("{{WoStartDate}}", woHoldData.startDate != null ? woHoldData.startDate.ToString() : "");
                        body = body.Replace("{{WoHoldBy}}", woHoldData.holdEmployees.initialName != null ? woHoldData.holdEmployees.initialName.ToString() : "");
                    }

                    string woOperationDetails = "";
                    string opbody = string.Empty;
                    using (StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/ReportTemplate/workorder-operation.html")))
                    {
                        opbody = reader.ReadToEnd();
                    }
                    var operationInfo = woData.operationInfo;
                    var productionInfo = woData.productionInfo;

                    int opIndex = 0;
                    foreach (var opItem in woData.workorderProfile.workorderOperation)
                    {
                        if (opItem.cleaningType == "NC")
                        {
                            NoCleanOpData += opItem.opNumber;
                        }
                        else if (opItem.cleaningType == "WS")
                        {
                            WatersolubleOpData += opItem.opNumber;
                        }

                        opItem.opPageClass = "workorder-detail-main";
                        if (opIndex > 0) {
                            opItem.opPageClass += " page-brk";
                        }
                        opItem.OperationEmptyStateClass = "hide-details";

                        string operationBody = opbody;
                        operationBody = operationBody.Replace("{{OpPageClass}}", opItem.opPageClass.ToString());
                        //operationBody = operationBody.Replace("{{OperationEmptyStateClass}}", opItem.OperationEmptyStateClass.ToString());
                        operationBody = operationBody.Replace("{{OpNumber}}", opItem.opNumber != null ? opItem.opNumber.ToString() : "");
                        operationBody = operationBody.Replace("{{OpName}}", opItem.opName != null ? opItem.opName.ToString() : "");
                        if (opItem.isTeamOperation != null && opItem.isTeamOperation.ToString() == "False")
                        {
                            operationBody = operationBody.Replace("{{NotTeamOperationThanHide}}", displayNone);
                        }
                        operationBody = operationBody.Replace("{{TeamOperationIcon}}", "https://192.168.0.208:3000/assets/images/avatars/account-switch.png");
                        operationBody = operationBody.Replace("{{TotalActualTime}}", opItem.totalActualTime != "-" ? opItem.totalActualTime : "NA");
                        if (opItem.isStopOperation != null && opItem.isStopOperation.ToString() == "False")
                        {
                            operationBody = operationBody.Replace("{{OperationNotStopThanHide}}", displayNone);
                            operationBody = operationBody.Replace("{{StopOperationColSpan}}", "1");
                        }
                        else {
                            operationBody = operationBody.Replace("{{StopOperationColSpan}}", "2");
                        }
                        operationBody = operationBody.Replace("{{StopOperationIcon}}", "https://192.168.0.208:3000/assets/images/logos/stop.png");
                        operationBody = operationBody.Replace("{{OpStopBorderClass}}", "th-border-bottom");
                        operationBody = operationBody.Replace("{{OpVersion}}", opItem.opVersion != null ? opItem.opVersion.ToString() : "");
                        //operationBody = operationBody.Replace("{{WorkorderOperationFirstPcsDet}}", opItem.workorderOperationFirstPcsDet != null ? "Yes" : "No");
                        operationBody = operationBody.Replace("{{ReadyStock}}", (opItem.ReadyStock != "-" && opItem.ReadyStock != null) ? opItem.ReadyStock.ToString() : "NA");
                        operationBody = operationBody.Replace("{{ScrapQty}}", (opItem.scrapQty != "-" && opItem.scrapQty != null) ? opItem.scrapQty.ToString() : "NA");
                        operationBody = operationBody.Replace("{{ColorCode}}",(opItem.colorCode != "-" && opItem.colorCode != null) ? opItem.colorCode.ToString() : "#fff");
                        foreach (var opHoldData in opItem.workorderTransOperationHoldUnhold)
                        {
                            operationBody = operationBody.Replace("{{OpReason}}", opHoldData.reason != null ? opHoldData.reason.ToString() : "");
                            operationBody = operationBody.Replace("{{OpStartDate}}", opHoldData.startDate != null ? opHoldData.startDate.ToString() : "");
                            operationBody = operationBody.Replace("{{OpHoldBy}}", opHoldData.holdEmployees.initialName != null ? opHoldData.holdEmployees.initialName.ToString() : "");
                        }
                        operationBody = operationBody.Replace("{{OpDoes}}", opItem.opDoes != null ? opItem.opDoes.ToString() : "NA");
                        operationBody = operationBody.Replace("{{OpDonts}}", opItem.opDonts != null ? opItem.opDonts.ToString() : "NA");
                        operationBody = operationBody.Replace("{{OpDescription}}", opItem.OpDescription != null ? opItem.opDescription.ToString() : "NA");
                        operationBody = operationBody.Replace("{{OpWorkingCondition}}", opItem.opWorkingCondition != null ? opItem.opWorkingCondition.ToString() : "NA");
                        operationBody = operationBody.Replace("{{OpManagementInstruction}}", opItem.opManagementInstruction != null ? opItem.opManagementInstruction.ToString() : "NA");
                        operationBody = operationBody.Replace("{{OpDeferredInstruction}}", opItem.opDeferredInstruction != null ? opItem.opDeferredInstruction.ToString() : "NA");

                        string eqpbody = string.Empty;
                        using (StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/ReportTemplate/workorder-operation-equipment.html")))
                        {
                            eqpbody = reader.ReadToEnd();
                        }
                        foreach (var eqpItem in opItem.workorderOperationEquipment)
                        {
                            eqpItem.EquipmentEmptyStateClass = "hide-details";
                            //eqpbody = eqpbody.Replace("{{EquipmentEmptyStateClass}}", eqpItem.EquipmentEmptyStateClass.ToString());
                            eqpbody = eqpbody.Replace("{{AssetName}}", eqpItem.equipment.assetName != null ? eqpItem.equipment.assetName.ToString() : "");
                            eqpbody = eqpbody.Replace("{{EqpMake}}", eqpItem.equipment.eqpMake != null ? eqpItem.equipment.eqpMake.ToString() : "");
                            eqpbody = eqpbody.Replace("{{EqpModel}}", eqpItem.equipment.eqpModel != null ? eqpItem.equipment.eqpModel.ToString() : "");
                            eqpbody = eqpbody.Replace("{{EqpYear}}", eqpItem.equipment.eqpYear != null ? eqpItem.equipment.eqpYear.ToString() : "");
                            operationBody += eqpbody;
                        }

                        woOperationDetails += operationBody;
                        opIndex++;
                    }
                    if (NoCleanOpData != string.Empty)
                    {
                        NoCleanOpData = "[" + NoCleanOpData + "]";
                    }
                    if (WatersolubleOpData != string.Empty)
                    {
                        WatersolubleOpData = "[" + WatersolubleOpData + "]";
                    }
                    body = body.Replace("{{NoCleanOpData}}", NoCleanOpData.ToString());
                    body = body.Replace("{{WatersolubleOpData}}", WatersolubleOpData.ToString());

                    body = body.Replace("{{WOOperationDetails}}", woOperationDetails);
                    HtmlToPdfConverter htmlToPdfConverter = new HtmlToPdfConverter();
                    htmlToPdfConverter.Orientation = PageOrientation.Portrait;
                    htmlToPdfConverter.Quiet = false;
                    htmlToPdfConverter.LogReceived += (sender, e) => {
                        Console.WriteLine("WkHtmlToPdf Log: {0}", e.Data);
                    };

                    htmlToPdfConverter.CustomWkHtmlArgs = "  --print-media-type ";
                    htmlToPdfConverter.PageFooterHtml = "<div style='text-align:left;'>Printed On " + DateTime.Now.ToString("MM/dd/yy") + " </div><div style='text-align:right;'>Page <span class='page'></span> of <span class='topage'></span> </div>";
                    fileBytes = htmlToPdfConverter.GeneratePdf(body);
                    FileName = string.Format("{0}_{1}.pdf", woData.workorderProfile.woNumber.ToString(), woData.workorderProfile.woVersion.ToString());

                    HttpResponseMessage httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
                    Stream stream = new MemoryStream(fileBytes);
                    httpResponse.Content = new StreamContent(stream);
                    httpResponse.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    httpResponse.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    return httpResponse;
                }
                else
                {
                    HttpResponseMessage httpResponse = new HttpResponseMessage(HttpStatusCode.NotFound);
                    return httpResponse;
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage httpResponse = new HttpResponseMessage(HttpStatusCode.NotFound);
                return httpResponse;
            }
        }
    }
}