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
    public class BOM_CleanPartNewarkRequestHandler: IBOM_CleanPartNewarkRequestHandler
    {
        IModel channel = null;
        //public static IConnection connection = null;
        string bomServiceQueue = ConfigurationManager.AppSettings["BOMCleanNWQueue"].ToString();
        ushort BOMConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["BOMCleanConsumerPrefetchCount"].ToString());

        public void process()
        {

            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(bomServiceQueue, false, false, false, null);
                }

                channel = Helper.Helper.connection.CreateModel();
                channel.BasicQos(0, BOMConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(bomServiceQueue, false, consumer);
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
                INewarkPartHandler _IPricingRequest = UnityConfig.Container.Resolve<INewarkPartHandler>();
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
