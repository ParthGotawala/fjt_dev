using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository
{
    public class EmailService : IEmailService
    {
        private readonly QueueSettings _queueSettings;
        private IModel channel = null;
        public static IConnection connection = null;

        public EmailService(IOptions<QueueSettings> queueSettings)
        {
            _queueSettings = queueSettings.Value;
        }

        public void SendEmail(SendEmailModel model)
        {
            ConnectionFactory factory = new ConnectionFactory();
            factory.AutomaticRecoveryEnabled = true;
            factory.Uri = new Uri(_queueSettings.URI);
            factory.UserName = _queueSettings.UserName;
            factory.Password = _queueSettings.Password;
            factory.HostName = _queueSettings.HostName;
            factory.VirtualHost = _queueSettings.VirtualHost;
            connection = factory.CreateConnection();
            channel = connection.CreateModel();
            model.mailSendProviderType = "Mailgun";
            string jsonified = JsonConvert.SerializeObject(model);
            var body = Encoding.UTF8.GetBytes(jsonified);
            var properties = channel.CreateBasicProperties();
            channel.BasicPublish(string.Empty, _queueSettings.QueueName, properties, body);
        }
    }
}
