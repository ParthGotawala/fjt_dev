using fjt.pricingservice.Handlers.Interfaces;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Collections.Generic;
using System.Text;

namespace fjt.pricingservice.Handlers
{
    public class RabbitMQSendMessageRequestHandler : IRabbitMQSendMessageRequestHandler
    {   
        public void SendRequest(object Model, string QueueName)
        {   
            using (IModel channel = Helper.Helper.connection.CreateModel())
            {
                IDictionary<string, object> args = new Dictionary<string, object>();
                channel.QueueDeclare(QueueName, false, false, false, args);
                string jsonified = JsonConvert.SerializeObject(Model);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                channel.BasicPublish(string.Empty, QueueName, properties, body);
            }
        }
    }
}
