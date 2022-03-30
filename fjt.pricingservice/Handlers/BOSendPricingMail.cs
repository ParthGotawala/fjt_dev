using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System;
using System.Configuration;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace fjt.pricingservice.Handlers
{
    public class BOSendPricingMail : IBOSendPricingMail
    {
        IModel channel = null;
        public static IConnection connection = null;
        string DirectivesTopic = ConfigurationManager.AppSettings["RabbitEmailQueue"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        string errorMailConfiguration = ConfigurationManager.AppSettings["errorMailConfiguration"].ToString();
        public void sendEmail(EmailModel emailData)
        {
            ConnectionFactory factory = new ConnectionFactory();
            factory.AutomaticRecoveryEnabled = true;
            factory.Uri = new Uri(rabbitMqURI);
            factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
            factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
            factory.HostName = ConfigurationManager.AppSettings["RabbitMqEmailHost"];
            factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqEmailVirtualHost"];
            connection = factory.CreateConnection();
            channel = connection.CreateModel();
            emailData.mailSendProviderType = Helper.ConstantHelper.MailGunServiceUsed;
            string jsonified = JsonConvert.SerializeObject(emailData);
            var body = Encoding.UTF8.GetBytes(jsonified);
            var properties = channel.CreateBasicProperties();
            channel.BasicPublish(string.Empty, DirectivesTopic, properties, body);
        }

        public void commonSendEmailDetail(ServiceErrorLog ServiceErrorLog) {
            string currentDate = DateTime.UtcNow.ToString("MM-dd-yyyy HH:mm");
            string subjectMessage = "Exception: Something went wrong.";
            string _ipAddress = GetLocalIPAddress();
            string _systemName = Environment.MachineName;

            EmailModel emailModel = new EmailModel()
            {
                To = errorMailConfiguration,
                Subject = subjectMessage,
                Body = string.Format("<b>MFR PN: {0} </b><br/><b>Supplier: {6} </b><br/><br/><b>Release:</b> {2} </b><br/><b>System Name(IP Address):</b> {1}({2}) </b><br/><b>On Date:</b> {3} (UTC) (24Hrs) </b><br/><b>Error Message:</b> {4}</b><br/> <b>Error Stack Trace:</b> {5} </b><br/>", ServiceErrorLog.mfgPN.ToUpper(), _systemName, _ipAddress, currentDate, ServiceErrorLog.error, ServiceErrorLog.stackTrace, ServiceErrorLog.supplier)
            };
            sendEmail(emailModel);

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
    }
}
