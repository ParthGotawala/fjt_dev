using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.BOPartUpdate;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Configuration;
using System.Text;
using Unity;
using fjt.pricingservice.PartPicture;

namespace fjt.pricingservice.Handlers
{
    class PartPictureRequestHandler : IPartPictureRequestHandler
    {
        IModel channel = null;
        string partPictureQueue = ConfigurationManager.AppSettings["PartPictureQueue"].ToString();
        ushort SchedulePartUpdateConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["SchedulePartUpdateConsumerPrefetchCount"].ToString());

        public void Process()
        {
            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(partPictureQueue, false, false, false, null);
                }

                channel = Helper.Helper.connection.CreateModel();
                channel.BasicQos(0, SchedulePartUpdateConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, PictureDetEvetArg) =>
                {
                    ProcessMessages(PictureDetEvetArg, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(partPictureQueue, false, consumer);
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
                GenericFileDetail genericfile = JsonConvert.DeserializeObject<GenericFileDetail>(message);
                IPartPictureUpdate _IPartPictureUpdate = UnityConfig.Container.Resolve<IPartPictureUpdate>();
                _IPartPictureUpdate.InsertPicture(genericfile);
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
