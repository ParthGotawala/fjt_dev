using fjt.emailservice.BOEmail.Interface;
using fjt.emailservice.Handlers.Interfaces;
using fjt.emailservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity;

namespace fjt.emailservice.Handlers
{
    public class EmailApiRequestHandler : IEmailApiRequestHandler
    {
        IModel channel = null;
        public static IConnection connection = null;
        string emailServiceQueue = ConfigurationManager.AppSettings["RabbitEmailQueue"].ToString();
        ushort EmailConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["EmailConsumerPrefetchCount"].ToString());
        IErrorLog _IErrorLog = UnityConfig.Container.Resolve<IErrorLog>();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        public void Process()
        {
            try
            {
                ConnectionFactory factory = new ConnectionFactory();
                factory.AutomaticRecoveryEnabled = true;
                factory.Uri = new Uri(rabbitMqURI);
                factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
                factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
                factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqEmailVirtualHost"];
                factory.HostName = ConfigurationManager.AppSettings["RabbitMqEmailHost"];
                connection = factory.CreateConnection();



                using (channel = connection.CreateModel())
                {
                    channel.QueueDeclare(emailServiceQueue, false, false, false, null);
                }

                channel = connection.CreateModel();
                channel.BasicQos(0, EmailConsumerPrefetchCount, false);
                
                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(emailServiceQueue, false, consumer);
            }
            catch (Exception ex)
            {
                ServiceLog model = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = "EMail"
                };
                _IErrorLog.sendErrorQueue(model);
            }
        }

        private void ProcessMessages(BasicDeliverEventArgs Model, IModel channel, int processCount)
        {
            try
            {
                var body = Model.Body;
                var message = Encoding.UTF8.GetString(body);
                EmailModel emailInfo = JsonConvert.DeserializeObject<EmailModel>(message);
                ICommonApiEmail _ICommonApiEmail = UnityConfig.Container.Resolve<ICommonApiEmail>(emailInfo.mailSendProviderType);
                _ICommonApiEmail.SendEmail(emailInfo);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                ServiceLog model = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = "EMail"
                };
                _IErrorLog.sendErrorQueue(model);
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
