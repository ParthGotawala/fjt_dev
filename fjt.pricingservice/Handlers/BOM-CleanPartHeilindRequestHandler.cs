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
    public class BOM_CleanPartHeilindRequestHandler : IBOM_CleanPartHeilindRequestHandler
    {
        IModel channel = null;
        string bomServiceQueue = ConfigurationManager.AppSettings["BOMCleanHeilindQueue"].ToString();
        ushort BOMConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["BOMCleanConsumerPrefetchCount"].ToString());
        ushort BOMConsumerCount = ushort.Parse(ConfigurationManager.AppSettings["BOMConsumerCount"].ToString());
        public void Process()
        {
            try
            {
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
            catch (Exception ex)
            {

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
                CommonModel bomLineItem = JsonConvert.DeserializeObject<CommonModel>(message);
                IHeilindPartUpdateHandler _IPricingRequest = UnityConfig.Container.Resolve<IHeilindPartUpdateHandler>();
                int response = _IPricingRequest.UpdateInsertPart(bomLineItem.ExternalPartVerificationRequestLog, bomLineItem.componentList);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
