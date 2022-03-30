using fjt.emailservice.Handlers.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using fjt.emailservice.Model;
using RabbitMQ.Client;
using System.Configuration;
using Newtonsoft.Json;


namespace fjt.emailservice.Handlers
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
        public void sendErrorQueue(ServiceLog ServiceLog)
        {
            using (var channel = connection.CreateModel())
            {
                string jsonified = JsonConvert.SerializeObject(ServiceLog);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                channel.BasicPublish(string.Empty, ErroLogQueue, properties, body);
            }
        }
        
    }
}
