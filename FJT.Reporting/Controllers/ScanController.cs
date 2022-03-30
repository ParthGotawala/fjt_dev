using FJT.Reporting.ViewModels;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace FJT.Reporting.Controllers
{
    [RoutePrefix("api/Scan")]
    public class ScanController : ApiController
    {
        [Route("StartScan")]
        [HttpPost]
        public HttpResponseMessage StartScan(ScanRequestModel scanRequestModel)
        {
            string result = string.Empty;
            try
            {
                if (scanRequestModel.scanDocument)
                {
                    File.AppendAllText(Constant.Constant.ScanDocuFilePath, string.Format("Start API Call: {0:MM/dd/yyyy hh:mm:ss} {1}", DateTime.Now, Environment.NewLine));
                }
                string appPath = string.Format(@"{0}", Constant.Constant.ScanDocumentConsoleAppPath);
                if (!File.Exists(appPath))
                {
                    return this.Request.CreateResponse(HttpStatusCode.BadRequest, Constant.Constant.ScanDocumentConsoleAppNotExists);
                }

                ProcessStartInfo procStartInfo = new ProcessStartInfo(appPath);

                procStartInfo.RedirectStandardOutput = true;
                procStartInfo.UseShellExecute = false;
                procStartInfo.CreateNoWindow = true;

                // wrap IDisposable into using (in order to release hProcess) 
                using (Process process = new Process())
                {
                    //scanRequestModel.filePrefix = string.Format("{0}-{1}", scanRequestModel.refTransID, DateTime.Now.ToString("MMddyyyyHHmmss"));

                    if (string.IsNullOrEmpty(scanRequestModel.filePrefix))
                    {
                        scanRequestModel.filePrefix = string.Format("{0}-{1}", scanRequestModel.refTransID, DateTime.Now.ToString("MMddyyyyHHmmss"));
                    }
                    procStartInfo.Arguments = JsonConvert.SerializeObject(scanRequestModel).Replace("\"", "\"'");
                    process.StartInfo = procStartInfo;
                    process.Start();

                    // Add this: wait until process does its work
                    process.WaitForExit();

                    // and only then read the result
                    result = process.StandardOutput.ReadToEnd();
                    ScanDetail scanDetail = JsonConvert.DeserializeObject<ScanDetail>(result);
                    if (!string.IsNullOrEmpty(scanDetail.Error))
                    {
                        return this.Request.CreateResponse(HttpStatusCode.OK, new ScanDetail { Error = scanDetail.Error });
                    }
                    if (scanRequestModel.scanDocument)
                    {
                        File.AppendAllText(Constant.Constant.ScanDocuFilePath, string.Format("File name: {1} \n End API Call: {0:MM/dd/yyyy hh:mm:ss} {2} ------------------------------------------ {2}", DateTime.Now, scanDetail.FileName, Environment.NewLine));
                    }
                    return this.Request.CreateResponse(HttpStatusCode.OK, scanDetail);
                }
            }
            catch (Exception ex)            
            {
                string message = ex.InnerException != null ? (ex.InnerException.InnerException.Message != null ? ex.InnerException.Message : ex.InnerException.Message) : ex.Message;
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, message);
            }
        }

        [Route("DiscardScanDocument")]
        [HttpDelete]
        public HttpResponseMessage DiscardScanDocument(string FileName)
        {
            string result = string.Empty;
            try
            {
                string filePath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Resources/BrotherPrinterScanDoc"), FileName);
                if (File.Exists(filePath))
                {
                    // If file found, delete it    
                    File.Delete(filePath);
                }
                return this.Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                string message = ex.InnerException != null ? (ex.InnerException.InnerException.Message != null ? ex.InnerException.Message : ex.InnerException.Message) : ex.Message;
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, message);
            }
        }

        [Route("GetScanDocument")]
        [HttpGet]
        public HttpResponseMessage GetScanDocument(string FileName)
        {
            string filePath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Resources/BrotherPrinterScanDoc"), FileName);
            using (MemoryStream ms = new MemoryStream())
            {
                using (FileStream file = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    byte[] bytes = new byte[file.Length];
                    file.Read(bytes, 0, (int)file.Length);
                    ms.Write(bytes, 0, (int)file.Length);

                    HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
                    httpResponseMessage.Content = new ByteArrayContent(bytes.ToArray());
                    httpResponseMessage.Content.Headers.Add("x-filename", FileName);
                    httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    httpResponseMessage.Content.Headers.ContentDisposition.FileName = FileName;
                    httpResponseMessage.StatusCode = HttpStatusCode.OK;
                    return httpResponseMessage;
                }
            }
        }
    }
}
