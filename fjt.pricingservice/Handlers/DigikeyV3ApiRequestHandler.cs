using fjt.pricingservice.BOPricing.Interface;
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
    public class DigikeyV3ApiRequestHandler : IDigikeyV3ApiRequestHandler
    {
        IModel channel = null;
        // public static IConnection connection = null;
        string digiKeyServiceQueue = ConfigurationManager.AppSettings["RabbitDigiKeyV3Queue"].ToString();
        ushort DigiKeyConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["DigiKeyConsumerPrefetchCount"].ToString());
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for digikey queue.
        /// </summary>
        public void Process()
        {

            try
            { 
                using (channel = ConstantHelper.connection.CreateModel())
                {
                    channel.QueueDeclare(digiKeyServiceQueue, false, false, false, null);
                }

                channel = ConstantHelper.connection.CreateModel();
                channel.BasicQos(0, DigiKeyConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(digiKeyServiceQueue, false, consumer);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any digikey part send from ui for searching price
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
                AutoPricingLineItemwiseStatus LineItem = JsonConvert.DeserializeObject<AutoPricingLineItemwiseStatus>(message);
                IPricingRequest _IPricingRequest = UnityConfig.Container.Resolve<IPricingRequest>(Helper.Helper.PricingAPINames.DigiKeyV3.ToString());
                _IPricingRequest.Pricing(LineItem);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
