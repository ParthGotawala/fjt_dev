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
    public  class Part_CleanMouserRequestHandler: IPart_CleanMouserRequestHandler
    {
        IModel channel = null;
        string PartCleanMOQueue = ConfigurationManager.AppSettings["PartCleanMOQueue"].ToString();
        ushort SchedulePartUpdateConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["SchedulePartUpdateConsumerPrefetchCount"].ToString());
        ushort BOMConsumerCount = ushort.Parse(ConfigurationManager.AppSettings["BOMConsumerCount"].ToString());
        public void Process()
        {

            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(PartCleanMOQueue, false, false, false, null);
                }
                for (int i = 0; i < BOMConsumerCount; i++)
                {
                    IModel channel = Helper.Helper.connection.CreateModel();
                    channel.BasicQos(0, SchedulePartUpdateConsumerPrefetchCount, false);

                    EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (ch, FetchMoPart) =>
                    {
                        ProcessMessages(FetchMoPart, channel, 1);
                    };
                    consumer.ConsumerTag = channel.BasicConsume(PartCleanMOQueue, false, consumer);
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
                IMouserPartHandler _IMouserPartHandler = UnityConfig.Container.Resolve<IMouserPartHandler>(Helper.Helper.MouserAPIName);
                int response = _IMouserPartHandler.UpdateInsertPart(bomLineItem.ExternalPartVerificationRequestLog, bomLineItem.componentList);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
