using FJT.AutoBackup.Email_Service;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace FJT.AutoBackup
{
    public class EmailService
    {
        IModel channel = null;
        public static IConnection connection = null;
        string DirectivesTopic = ConfigurationManager.AppSettings["RabbitEmailQueue"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();

        public void SendEmail(EmailModel model)
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
            model.mailSendProviderType = "Mailgun";
            string jsonified = JsonConvert.SerializeObject(model);
            var body = Encoding.UTF8.GetBytes(jsonified);
            var properties = channel.CreateBasicProperties();
            channel.BasicPublish(string.Empty, DirectivesTopic, properties, body);
        }
    }
}
