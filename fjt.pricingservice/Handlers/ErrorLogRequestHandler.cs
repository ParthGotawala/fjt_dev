using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Configuration;
using System.Text;
using Unity;

namespace fjt.pricingservice.Handlers
{
    public class ErrorLogRequestHandler : IErrorLogRequestHandler
    {
        IModel channel = null;
        public static IConnection connection = null;
        string ErroLogQueue = ConfigurationManager.AppSettings["ErroLogQueue"].ToString();
        ushort ErrorPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["ErrorPrefetchCount"].ToString());
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for error logs.
        /// </summary>
        public void Process()
        {
            try
            {
                ConnectionFactory factory = new ConnectionFactory();
                factory.AutomaticRecoveryEnabled = true;
                factory.Uri = new Uri(rabbitMqURI);
                factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
                factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
                factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqPricingVirtualHost"];
                factory.HostName = ConfigurationManager.AppSettings["RabbitMqPricingHost"];
                connection = factory.CreateConnection();
                ConstantHelper.connection = connection;
                using (channel = connection.CreateModel())
                {
                    channel.QueueDeclare(ErroLogQueue, false, false, false, null);
                }

                channel = connection.CreateModel();
                channel.BasicQos(0, ErrorPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(ErroLogQueue, false, consumer);
            }
            catch (Exception ex)
            {
                ServiceErrorLog log = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = ConstantHelper.Pricing
                };
                saveErrorLogs(log);
            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any error comes.
        /// </summary>
        /// <param name="Model">BasicDeliverEventArgs</param>
        /// <param name="channel">IModel</param>
        /// <param name="processCount">int</param>
        private void ProcessMessages(BasicDeliverEventArgs Model, IModel channel, int processCount)
        {
            try
            {
                var body = Model.Body;
                var message = Encoding.UTF8.GetString(body);
                ServiceErrorLog ServiceErrorLog = JsonConvert.DeserializeObject<ServiceErrorLog>(message);
                saveErrorLogs(ServiceErrorLog);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }

        public void saveErrorLogs(ServiceErrorLog ServiceErrorLog)
        {
            IErrorLog _IErrorLog = UnityConfig.Container.Resolve<IErrorLog>();
            _IErrorLog.saveErrorLog(ServiceErrorLog);
            if (!string.IsNullOrEmpty(ServiceErrorLog.mfgPN)) // send email for error in pricing service
            {
                IBOSendPricingMail _IBOSendPricingMail = UnityConfig.Container.Resolve<IBOSendPricingMail>();
                _IBOSendPricingMail.commonSendEmailDetail(ServiceErrorLog);
            }
        }
    }
}
