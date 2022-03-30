using fjt.pricingservice.Helper;
using Newtonsoft.Json;
using System.Text;
using RabbitMQ.Client;
using fjt.pricingservice.Model;
using System.Configuration;
using fjt.pricingservice.ErrorLog.Interface;

namespace fjt.pricingservice.ErrorLog
{
    public class RabbitMQ : IRabbitMQ
    {
        string ErroLogQueue = ConfigurationManager.AppSettings["ErroLogQueue"].ToString();

        void IRabbitMQ.SendRequest(ServiceErrorLog Model)
        {
            using (var channel = ConstantHelper.connection.CreateModel())
            {  
                string jsonified = JsonConvert.SerializeObject(Model);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                channel.BasicPublish(string.Empty, ErroLogQueue, properties, body);
            }
        }
    }
}
