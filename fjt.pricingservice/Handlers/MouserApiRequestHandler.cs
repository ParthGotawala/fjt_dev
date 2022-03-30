using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Configuration;
using System.Text;
using Unity;

namespace fjt.pricingservice.Handlers
{
    public class MouserApiRequestHandler : IMouserApiRequestHandler
    {
        IModel channel = null;
        //public static IConnection connection = null;
        string mouserServiceQueue = ConfigurationManager.AppSettings["RabbitMouserQueue"].ToString();
        ushort MouserConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["MouserConsumerPrefetchCount"].ToString());
       
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for mouser queue.
        /// </summary>
        public void Process()
        {
            try
            {
                using (channel = ConstantHelper.connection.CreateModel())
                {
                    channel.QueueDeclare(mouserServiceQueue, false, false, false, null);
                }

                channel = ConstantHelper.connection.CreateModel();
                channel.BasicQos(0, MouserConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(mouserServiceQueue, false, consumer);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any mouser part send from ui for searching price
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
                IPricingRequest _IPricingRequest = UnityConfig.Container.Resolve<IPricingRequest>(Helper.Helper.MouserAPIName);
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
