using FJT.ServiceUtility.Email_Service;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace FJT.ServiceUtility
{
    class Program
    {
        static string _adminEmailID = WebConfigurationManager.AppSettings["adminEmailID"].ToString();
        static bool isLocalEnv = bool.Parse(WebConfigurationManager.AppSettings["IsLocalEnvironment"].ToString());
        static int _sleepTimeInSec = int.Parse(WebConfigurationManager.AppSettings["SleepTimeInSec"]);
        static int _tryCount = int.Parse(WebConfigurationManager.AppSettings["TryCount"]);
        public static class Globals
        {
            public static string _systemDetails = WebConfigurationManager.AppSettings["SystemDetails"].ToString();
            public static string _baseUrl = WebConfigurationManager.AppSettings["WebsiteUrl"].ToString();
            public static string _apiUrl = WebConfigurationManager.AppSettings["ApiUrl"].ToString();
            public static string _reportingUrl = WebConfigurationManager.AppSettings["ReportingUrl"].ToString();
            public static string _reportDesignerUrl = WebConfigurationManager.AppSettings["ReportDesignerUrl"].ToString();
            public static string _reportViewerUrl = WebConfigurationManager.AppSettings["ReportViewerUrl"].ToString();
            public static string _identityUrl = WebConfigurationManager.AppSettings["IdentityUrl"].ToString();
            public static string _enterpriseUrl = WebConfigurationManager.AppSettings["EnterpriseSearchUrl"].ToString();
            public static string _mySQLServiceName = WebConfigurationManager.AppSettings["MySQLServiceName"].ToString();
            public static string _mySQLDevServiceName = WebConfigurationManager.AppSettings["MySQLDEVServiceName"].ToString();
            public static string _mongoDBServiceName = WebConfigurationManager.AppSettings["MongoDBServiceName"].ToString();
            public static string _rabbitMQServiceName = WebConfigurationManager.AppSettings["RabbitMQServiceName"].ToString();
            public static string _elasticSearchServiceName = WebConfigurationManager.AppSettings["ElasticSearchServiceName"].ToString();
            public static string _q2CPricingServiceName = WebConfigurationManager.AppSettings["Q2CPricingServiceName"].ToString();
            public static string _q2CEmailServiceName = WebConfigurationManager.AppSettings["Q2CEmailServiceName"].ToString();
            public static string _q2CSearchEngineServiceName = WebConfigurationManager.AppSettings["Q2CSearchEngineServiceName"].ToString();
            public static string _powerShellScriptExe = WebConfigurationManager.AppSettings["PowerShellScriptExe"].ToString();
            public static string _powerShellScriptFilePath = WebConfigurationManager.AppSettings["PowerShellScriptFilePath"].ToString();

            public static string[] _primaryServiceNames = { _mySQLServiceName, _mySQLDevServiceName, _mongoDBServiceName, _rabbitMQServiceName, _elasticSearchServiceName };
            public static string[] _secondaryServiceNames = { _q2CPricingServiceName, _q2CEmailServiceName, _q2CSearchEngineServiceName };
            public static bool IsAPIProjectRunning, IsUIProjectRunning, IsReportingProjectRunning, IsReportDesignerProjectRunning, IsReportViewerProjectRunning, IsIdentityServerProjectRunning, IsEnterpriseSearchAPIProjectRunning = false;
            public static bool IsMySQLServiceRunning, IsMySQLDevServiceRunning, IsMongoDBServiceRunning, IsRabbitMQServiceRunning, IsElasticServiceRunning = false;
            public static bool IsEnterpriseSearchServiceRunning, IsEmailServiceRunning, IsPricingServiceRunning = false;
            public static string _bodyText, _errorStackTrace = "";
        }
        static async Task Main(string[] args)
        {
            if (isLocalEnv)
            {
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            }
            try
            {
                // MySQL, RabbbitMQ, MongoDB, Elasticsearch
                // Start Service Start on local envirement which is set in config file as comma seprated 
                if (Globals._primaryServiceNames.Length > 0)
                {
                    foreach (string service in Globals._primaryServiceNames)
                    {
                        if (!string.IsNullOrEmpty(service))
                            CheckServiceStatus(service);
                    }
                }

                CheckAllAPIStatus();
                //await Task.WhenAll(checkReportingProjectStatusTask);
                Console.WriteLine("All task completed!!");
            }
            catch (Exception ex)
            {
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                SaveErrorLog(ex);
            }
            finally
            {
                // Start Service Start on local envirement which is set in config file as comma seprated 
                // Check Q2C Releated Service Pricing, Email and Enterprise Search
                if (Globals._secondaryServiceNames.Length > 0)
                {
                    foreach (string service in Globals._secondaryServiceNames)
                    {
                        if (!string.IsNullOrEmpty(service))
                            CheckServiceStatus(service);
                    }
                }
                try
                {
                    int count = 1;
                    bool runningStatus = Globals.IsUIProjectRunning && Globals.IsAPIProjectRunning &&
                        Globals.IsReportingProjectRunning && Globals.IsReportDesignerProjectRunning &&
                        Globals.IsReportViewerProjectRunning && Globals.IsIdentityServerProjectRunning &&
                        Globals.IsEnterpriseSearchAPIProjectRunning && Globals.IsMySQLServiceRunning &&
                        Globals.IsMySQLDevServiceRunning &&
                        Globals.IsMongoDBServiceRunning && Globals.IsRabbitMQServiceRunning &&
                        Globals.IsElasticServiceRunning && Globals.IsEmailServiceRunning &&
                        Globals.IsPricingServiceRunning && Globals.IsEnterpriseSearchServiceRunning;
                    if (!runningStatus)
                    {
                        try
                        {
                            StartAllApplication();
                            if (count <= _tryCount)
                            {
                                Thread.Sleep(_sleepTimeInSec * 1000);
                                count++;
                                CheckAllAPIStatus();
                            }
                            EmailSent(false, string.Empty);
                        }
                        catch (Exception ex)
                        {
                            Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                            SaveErrorLog(ex);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                    SaveErrorLog(ex);
                }
                //End Service Start on local envirement which is set in config file as comma seprated 
            }
        }

        // Check API Status Method
        public static async Task<ResponseResult> checkAPIStatus(string url, string APIPath)
        {
            Console.WriteLine("Started To Check API Status " + url);
            ResponseResult resposeResult = new ResponseResult() { status = "FAILED" };
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(url);
                var responseTask = client.GetAsync(APIPath);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    resposeResult = new ResponseResult() { status = "SUCCESS" };
                }
                CheckApplicationStatus(url, resposeResult);
                return resposeResult;
            }
            catch (Exception ex)
            {
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                SaveErrorLog(ex);
                return resposeResult;
            }
        }


        // Check Application API Running Status Method and Update Mail Format Text
        public static void CheckApplicationStatus(string url, ResponseResult resposneResult)
        {
            if (url == Globals._baseUrl)
            {
                Globals.IsUIProjectRunning = SetAPIRunningStatus("Q2C UI", resposneResult);
            }
            else if (url == Globals._apiUrl)
            {
                Globals.IsAPIProjectRunning = SetAPIRunningStatus("Q2C API", resposneResult);
            }
            else if (url == Globals._reportingUrl)
            {
                Globals.IsReportingProjectRunning = SetAPIRunningStatus("Q2C Reporting", resposneResult);
            }
            else if (url == Globals._reportDesignerUrl)
            {
                Globals.IsReportDesignerProjectRunning = SetAPIRunningStatus("Q2C Report Designer", resposneResult);
            }
            else if (url == Globals._reportViewerUrl)
            {
                Globals.IsReportViewerProjectRunning = SetAPIRunningStatus("Q2C Report Viewer", resposneResult);
            }
            else if (url == Globals._identityUrl)
            {
                Globals.IsIdentityServerProjectRunning = SetAPIRunningStatus("Q2C Identity Server", resposneResult);
            }
            else if (url == Globals._enterpriseUrl)
            {
                Globals.IsEnterpriseSearchAPIProjectRunning = SetAPIRunningStatus("Q2C Enterprise Search", resposneResult);
            }
        }

        //  Set API Running Status
        public static bool SetAPIRunningStatus(string name, ResponseResult resposneResult)
        {
            if (resposneResult != null && resposneResult.status != null && resposneResult.status == "SUCCESS")
            {
                Globals._bodyText += SetBodyText(name, true);
                return true;
            }
            Globals._bodyText += SetBodyText(name, false);
            return false;
        }

        // Set Body Text for Application Down Email
        public static string SetBodyText(string ProjectName, bool RunningStatus)
        {
            if (!string.IsNullOrEmpty(ProjectName))
            {
                string statusText = RunningStatus ? "Up" : "Down";
                string statusColor = RunningStatus ? "#0fd00f" : "#ff6a6a";
                return "<tr style=\"background: "+ statusColor.ToString() + ";\"><td style=\"border:1px solid black;padding:5px;\"><b>" + ProjectName + "</b></td><td style=\"border:1px solid black;padding:5px;\"><b>" + statusText + "</b></td><td style=\"border:1px solid black;padding:5px;\"><b>" + DateTime.UtcNow.ToString("MM-dd-yyyy HH:mm:ss") + " (UTC) (24Hrs)</b></td></tr>";
            }
            return "";
        }

        //Run Powershellscript on finally block
        public static void StartAllApplication()
        {
            try
            {
                var ps1File = Globals._powerShellScriptFilePath;
                var startInfo = new ProcessStartInfo()
                {
                    FileName = Globals._powerShellScriptExe,
                    Arguments = $"-NoProfile -ExecutionPolicy unrestricted -file \"{ps1File}\"",
                    UseShellExecute = false
                };
                Process.Start(startInfo);
            }
            catch (Exception ex)
            {
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                SaveErrorLog(ex);
            }
        }

        public static async void CheckAllAPIStatus() {
            // Check Q2C UI Project
            string testUIPath = "";
            var checkUIProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._baseUrl, testUIPath));

            // Check Q2C API Project
            string testAPIPath = "v1";
            var checkAPIProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._apiUrl, testAPIPath + "/alldynamicmessage/getAllCategoryDynamicMessages"));

            // Check Q2C Report Project
            string testReportingPath = "values";
            var checkReportingProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._reportingUrl, testReportingPath));

            // Check Q2C Report Designer Project
            string testReportDesignerPath = "api/CheckApplicationStatus";
            var checkReportDesignerProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._reportDesignerUrl, testReportDesignerPath));

            // Check Q2C Report Viewer Project
            string testReportViewerPath = "api/CheckApplicationStatus";
            var checkReportViewerProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._reportViewerUrl, testReportViewerPath));

            // Check Q2C Identity Project
            string testIdentityServerPath = ".well-known/openid-configuration";
            var checkIdentityServerProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._identityUrl, testIdentityServerPath));

            // Check Q2C Identity Server Project
            string testEnterpriseSearchAPIPath = "values";
            var checkEnterpriseServiceAPIProjectStatusTask = Task.Factory.StartNew(() => checkAPIStatus(Globals._enterpriseUrl, testEnterpriseSearchAPIPath));

            await Task.WhenAll(checkUIProjectStatusTask, checkAPIProjectStatusTask, checkReportingProjectStatusTask,
                checkReportDesignerProjectStatusTask, checkReportViewerProjectStatusTask, checkIdentityServerProjectStatusTask,
                checkEnterpriseServiceAPIProjectStatusTask);

        }

        // Start Windows Service 
        public static void CheckServiceStatus(string name)
        {
            Console.WriteLine("Started To Check Service Status " + name);
            ServiceController sc = new ServiceController(name);
            if (name == Globals._mySQLServiceName)
            {
                Globals.IsMySQLServiceRunning = SetRunningStatus(sc, name);
            }
            if (name == Globals._mySQLDevServiceName)
            {
                Globals.IsMySQLDevServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._mongoDBServiceName)
            {
                Globals.IsMongoDBServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._rabbitMQServiceName)
            {
                Globals.IsRabbitMQServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._elasticSearchServiceName)
            {
                Globals.IsElasticServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._q2CPricingServiceName)
            {
                Globals.IsPricingServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._q2CEmailServiceName)
            {
                Globals.IsEmailServiceRunning = SetRunningStatus(sc, name);
            }
            else if (name == Globals._q2CSearchEngineServiceName)
            {
                Globals.IsEnterpriseSearchServiceRunning = SetRunningStatus(sc, name);
            }
        }

        // Start Windows Service 
        public static bool SetRunningStatus(ServiceController sc, string name)
        {
            try
            {
                int count = 1;
                if (sc.Status == ServiceControllerStatus.Stopped)
                {
                    StartService(sc);
                    if (count <= _tryCount)
                    {
                        Thread.Sleep(_sleepTimeInSec * 1000);
                        count++;
                        ServiceController sc_retry = new ServiceController(name);
                        SetRunningStatus(sc_retry, name);
                    }
                    Globals._bodyText += SetBodyText(name, false);
                    return false;
                }
                Globals._bodyText += SetBodyText(name, true);
                return true;
            }
            catch (Exception ex)
            {
                Globals._bodyText += SetBodyText(name, false);
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                SaveErrorLog(ex);
                return false;
            }
        }

        public static void StartService(ServiceController sc)
        {
            sc.Start();
        }


        public static void EmailSent(bool isError, string Message)
        {
            string _ipAddress = GetLocalIPAddress();
            string _systemName = Environment.MachineName;
            string _subject = string.Empty;
            string _body = string.Empty;
            _subject = "{0}: Q2C Application Restarted";
            string currentDate = DateTime.UtcNow.ToString("MM-dd-yyyy HH:mm");
            //string bodyMessage = isError ? "FJT - Service Utility Failed." : "FJT - Service Utitlity Run Successfully.";
            string bodyCSSClass = "#ff6a6a";
            _body = string.Format("<b style=\"background: {0};\">Q2C Application Restarted </b><br/><br/><b>Release:</b> {1} <br/><b>System Name(IP Address):</b> {2}({3}) <br/><b>On Date:</b> {4} (UTC) (24Hrs) <br/>", bodyCSSClass, Globals._systemDetails, _systemName, _ipAddress, currentDate);
            _body += "<br/><br/><b style=\"font-size: 18px;\">Individual Application Status:</b><br/>";
            _body += "<table cellspacing=\"0\" style=\"font-size: 14px;\"><thead><tr><th width='200' style=\"border:1px solid black; text-align:left;padding:5px;background-color:lightgray;\"><b>Application/Service Name</b></th><th width='150' style=\"border:1px solid black; text-align:left;padding:5px;background-color:lightgray;\"><b>Application Status</b></th><th width='250' style=\"border:1px solid black; text-align:left;padding:5px;background-color:lightgray;\"><b>Checked On</b></th></tr></thead><tbody>" + Globals._bodyText + "</tbody></table>";
            if (!string.IsNullOrEmpty(Globals._errorStackTrace))
            {
                _body = _body + "<br/><br/>Error:<br/>" + Globals._errorStackTrace;
            }
            try
            {
                EmailModel emailModel = new EmailModel()
                {
                    To = _adminEmailID,
                    Subject = string.Format(_subject, Globals._systemDetails),
                    Body = _body
                };
                EmailService emailService = new EmailService();
                emailService.commonSendEmailDetail(emailModel);
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }

        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        public static bool ValidateJSON(string response)
        {
            try
            {
                JToken.Parse(response);
                return true;
            }
            catch (JsonReaderException ex)
            {
                return false;
            }
        }
        public static void SaveErrorLog(Exception ex)
        {
            try
            {
                string _ErrorLogFilePath = WebConfigurationManager.AppSettings["ErrorLogFilePath"].ToString();
                //Console.WriteLine(ex.Message.ToString() + "" + ex.StackTrace.ToString());
                string strLogText = ex.Message.ToString();
                if (ex.StackTrace != null)
                {
                    strLogText = strLogText + "" + ex.StackTrace.ToString();
                }

                // Create a writer and open the file:
                StreamWriter log;

                if (!File.Exists(_ErrorLogFilePath))
                {
                    log = new StreamWriter(_ErrorLogFilePath);
                }
                else
                {
                    log = File.AppendText(_ErrorLogFilePath);
                }

                // Write to the file:
                log.WriteLine(DateTime.Now);
                log.WriteLine(strLogText);
                log.WriteLine();

                // Close the stream:
                log.Close();
            }
            catch (Exception)
            {
                //intentionaly left blank, if error come while save log then it will not disturb other routine
            }
        }
    }
}
