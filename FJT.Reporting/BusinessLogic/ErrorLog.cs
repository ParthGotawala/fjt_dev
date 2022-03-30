using FJT.Reporting.BusinessLogic.Interface;
using System.Configuration;
using FJT.Reporting.Models;
using Newtonsoft.Json;
using System.Text;
using RabbitMQ.Client;
using System;
using System.IO;

namespace FJT.Reporting.BusinessLogic
{
    public class ErrorLog : IErrorLog
    {
        string ErroLogQueue = ConfigurationManager.AppSettings["ErroLogQueue"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        public static IConnection connection = null;
        public ErrorLog()
        {
            ConnectionFactory factory = new ConnectionFactory();
            factory.AutomaticRecoveryEnabled = true;
            factory.Uri = new Uri(rabbitMqURI);
            factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
            factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
            factory.HostName = ConfigurationManager.AppSettings["RabbitMqEmailHost"];
            factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqPricingVirtualHost"];
            connection = factory.CreateConnection();
        }
        public void sendErrorLog(ServiceLog ServiceLog)
        {
            using (var channel = connection.CreateModel())
            {
                string jsonified = JsonConvert.SerializeObject(ServiceLog);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                channel.BasicPublish(string.Empty, ErroLogQueue, properties, body);
            }
        }

        public void SaveReportLog(string pStrLogText)
        {
            try
            {
                if (string.IsNullOrEmpty(pStrLogText))
                {
                    return;
                }
                string _ErrorLogFilePath = ConfigurationManager.AppSettings["ReportLogFilePath"].ToString();

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
                log.WriteLine(pStrLogText);
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