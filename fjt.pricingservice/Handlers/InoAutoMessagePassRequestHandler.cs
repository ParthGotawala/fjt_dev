using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Handlers
{
   public class InoAutoMessagePassRequestHandler: IInoAutoMessagePassRequestHandler
    {
        IModel channel = null;
        public static IConnection connection = null;
        string NotificationsTopic = ConfigurationManager.AppSettings["NotificationsTopic"].ToString();
        string DirectivesTopic = ConfigurationManager.AppSettings["DirectivesTopic"].ToString();


        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for digikey queue.
        /// </summary>
        public void Process()
        {
            try
            {
                ConnectionFactory factory = new ConnectionFactory();
                factory.AutomaticRecoveryEnabled = true;
                factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
                factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
                factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqProductionVirtualHost"];
                factory.HostName = ConfigurationManager.AppSettings["RabbitMqServerHost"];
                connection = factory.CreateConnection();
                channel = connection.CreateModel();
                
                MessagePassModel message = new MessagePassModel()
                {
                    SlotName = "L-D-62",
                    LEDColor = 224,
                    BlinkDuration =15,
                    BlinkRate = 0,
                    TypeMessage = 130,
                    Machine = "FLEXINOVAXE4",
                    DateCreated = "2019-06-24T13:10:33.261462Z"
                };

                string jsonified = JsonConvert.SerializeObject(message);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                //while (true)
                //{
                    //channel.BasicPublish(exchange: NotificationsTopic,
                    //                 routingKey: "",
                    //                 basicProperties: properties,
                    //                 body: body);
                    channel.BasicPublish(exchange: DirectivesTopic,
                                         routingKey: "L.130",
                                         basicProperties: properties,
                                         body: body);
                    channel.ExchangeDeclare(exchange: "ExternalNotifications", type: "topic",durable:true);
                    var queueName = channel.QueueDeclare().QueueName;
                    channel.QueueBind(queue: queueName,
                                  exchange: "ExternalNotifications",
                                  routingKey: "K.114");

                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (model, ea) =>
                    {
                        var bod = ea.Body;
                        var messages = Encoding.UTF8.GetString(bod);
                        var routingKey = ea.RoutingKey;
                        Console.WriteLine(" [x] Received '{0}':'{1}'",
                                          routingKey,
                                          messages);
                    };
                    channel.BasicConsume(queue: queueName,
                                         autoAck: true,
                                         consumer: consumer);

                    //Direct pass Message into Queue

                    //   channel.BasicPublish(NotificationsTopic, "amq.gen-FwsomDtwqYBQn8nvi2JVsQ", properties, body);
                //}
            }
            catch (Exception ex)
            {

            }
        }
    }
}
