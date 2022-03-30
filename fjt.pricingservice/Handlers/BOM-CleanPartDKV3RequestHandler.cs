using fjt.pricingservice.BOPartUpdate;
using fjt.pricingservice.Handlers.Interfaces;
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

    public class BOM_CleanPartDKV3RequestHandler : IBOM_CleanPartDKV3RequestHandler
    {
        IModel channel = null;
        public static IConnection connection = null;
        string bomServiceQueue = ConfigurationManager.AppSettings["BOMCleanDKV3Queue"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        ushort BOMConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["BOMCleanConsumerPrefetchCount"].ToString());
        ushort BOMConsumerCount = ushort.Parse(ConfigurationManager.AppSettings["BOMConsumerCount"].ToString());
        string MouserAPIName = ConfigurationManager.AppSettings["MouserAPIName"].ToString();
        public void Process()
        {
            Helper.Helper.MouserAPIName = MouserAPIName;
            ConnectionFactory factory = new ConnectionFactory();
            factory.Uri = new Uri(rabbitMqURI);
            factory.AutomaticRecoveryEnabled = true;
            factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
            factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
            factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqPricingVirtualHost"];
            factory.HostName = ConfigurationManager.AppSettings["RabbitMqPricingHost"];
            connection = factory.CreateConnection();
            Helper.Helper.connection = connection;

            using (channel = Helper.Helper.connection.CreateModel())
            {
                channel.QueueDeclare(bomServiceQueue, false, false, false, null);
            }
            for (int i = 0; i < BOMConsumerCount; i++)
            {
                IModel channel = Helper.Helper.connection.CreateModel();
                channel.BasicQos(0, BOMConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(bomServiceQueue, false, consumer);
            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any  part send from bom to verify
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
                ExternalPartVerificationRequestLog bomLineItem = JsonConvert.DeserializeObject<ExternalPartVerificationRequestLog>(message);
                IDigikeyV3PartUpdateHandler _IPricingRequest = UnityConfig.Container.Resolve<IDigikeyV3PartUpdateHandler>();
                int response = _IPricingRequest.UpdateInsertPart(bomLineItem);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
