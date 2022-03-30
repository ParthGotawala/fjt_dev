using System;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Configuration;
using Newtonsoft.Json;
using fjt.pricingservice.BOPricing.Interface;
using Unity;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Model;
using fjt.pricingservice.Helper;

namespace fjt.pricingservice.Handlers
{
    public class AvnetApiRequestHandler : IAvnetApiRequestHandler
    {
        IModel channel = null;
        //public static IConnection connection = null;
        string avnetServiceQueue = ConfigurationManager.AppSettings["RabbitAvnetQueue"].ToString();
        ushort AvnetConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["AvnetConsumerPrefetchCount"].ToString());
       
        /// <summary>
        /// Author  : Vaibhav Shah
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for avnet queue.
        /// </summary>
        public void Process()
        {
            try
            { 
                using (channel = ConstantHelper.connection.CreateModel())
                {
                    channel.QueueDeclare(avnetServiceQueue, false, false, false, null);
                }

                channel = ConstantHelper.connection.CreateModel();
                channel.BasicQos(0, AvnetConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(avnetServiceQueue, false, consumer);
            }
            catch(Exception ex)
            {

            }
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any avnet part send from ui for searching price
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
                IPricingRequest _IPricingRequest = UnityConfig.Container.Resolve<IPricingRequest>(LineItem.PricingAPIName);
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
