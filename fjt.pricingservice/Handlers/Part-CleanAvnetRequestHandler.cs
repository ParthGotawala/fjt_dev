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
    public class Part_CleanAvnetRequestHandler: IPart_CleanAvnetRequestHandler
    {
        IModel channel = null;
        string partServiceQueue = ConfigurationManager.AppSettings["PartCleanAVQueue"].ToString();
        ushort SchedulePartUpdateConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["SchedulePartUpdateConsumerPrefetchCount"].ToString());
        ushort BOMConsumerCount = ushort.Parse(ConfigurationManager.AppSettings["BOMConsumerCount"].ToString());

        public void Process()
        {
            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(partServiceQueue, false, false, false, null);
                }
                for (int i = 0; i < BOMConsumerCount; i++)
                {
                    IModel channel = Helper.Helper.connection.CreateModel();
                    channel.BasicQos(0, SchedulePartUpdateConsumerPrefetchCount, false);

                    EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (ch, FetchDigiPart) =>
                    {
                        ProcessMessages(FetchDigiPart, channel, 1);
                    };
                    consumer.ConsumerTag = channel.BasicConsume(partServiceQueue, false, consumer);
                }
            }
            catch (Exception ex)
            {

            }
        }

        private void ProcessMessages(BasicDeliverEventArgs Model, IModel channel, int processCount)
        {
            try
            {
                var body = Model.Body;
                var message = Encoding.UTF8.GetString(body);
                CommonModel bomLineItem = JsonConvert.DeserializeObject<CommonModel>(message);
                IAvnetPartHandler _IAvnetPartHandler = UnityConfig.Container.Resolve<IAvnetPartHandler>();
                int response = _IAvnetPartHandler.UpdateInsertPart(bomLineItem.ExternalPartVerificationRequestLog, bomLineItem.componentList);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
