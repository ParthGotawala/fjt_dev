using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System;
using System.Configuration;
using System.Text;

namespace fjt.pricingservice.Handlers
{
    public class BOSendPartUpdateEmail: IBOSendPartUpdateEmail
    {
        IModel channel = null;
        public static IConnection connection = null;
        string DirectivesTopic = ConfigurationManager.AppSettings["RabbitEmailQueue"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        

        public void commonSendEmailDetail(EmailModel emailData)
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
    }
}
