using fjt.pricingservice.BOPartUpdate;
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
    public class OctopartRequestHandler: IOctoPartRequestHandler
    {
        IModel channel = null;
        string octoPartQueue = ConfigurationManager.AppSettings["RabbitOctoPartQueue"].ToString();
        ushort octopartConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["OctoPartConsumerPrefetchCount"].ToString());

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for octopart queue.
        /// </summary>
        public void Process()
        {
            try
            {
                using (channel = ConstantHelper.connection.CreateModel())
                {
                    channel.QueueDeclare(octoPartQueue, false, false, false, null);
                }
                channel = ConstantHelper.connection.CreateModel();
                channel.BasicQos(0, 1, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(octoPartQueue, false, consumer);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any octopart part send from ui for data sheet
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
                ExternalPartVerificationRequestLog LineItem = JsonConvert.DeserializeObject<ExternalPartVerificationRequestLog>(message);
                IOctoPartDataSheetUpdateHandler _IOctoPartDataSheetUpdateHandler = UnityConfig.Container.Resolve<IOctoPartDataSheetUpdateHandler>();
                _IOctoPartDataSheetUpdateHandler.UpdateInsertDataSheets(LineItem);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
