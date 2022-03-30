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
    public class Part_CleanNewarkRequestHandler: IPart_CleanNewarkRequestHandler
    {
        IModel channel = null;
        string partServiceQueue = ConfigurationManager.AppSettings["PartCleanNWQueue"].ToString();
        ushort SchedulePartUpdateConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["SchedulePartUpdateConsumerPrefetchCount"].ToString());

        public void process()
        {
            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(partServiceQueue, false, false, false, null);
                }

                channel = Helper.Helper.connection.CreateModel();
                channel.BasicQos(0, SchedulePartUpdateConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchNewarkPart) =>
                {
                    ProcessMessages(FetchNewarkPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(partServiceQueue, false, consumer);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any  part send from part to verify
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
                INewarkPartHandler _INewarkPartHandler = UnityConfig.Container.Resolve<INewarkPartHandler>();
                int response = _INewarkPartHandler.UpdateInsertPart(bomLineItem.ExternalPartVerificationRequestLog, bomLineItem.componentList);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
