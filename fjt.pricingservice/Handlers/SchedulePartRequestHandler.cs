using fjt.pricingservice.BOPartUpdate;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using Unity;

namespace fjt.pricingservice.Handlers
{
    public class SchedulePartRequestHandler: ISchedulePartRequestHandler
    {
        IModel channel = null;
       // public static IConnection connection = null;
        string SchedulePartUpdateQueue = ConfigurationManager.AppSettings["SchedulePartUpdateQueue"].ToString();
        string RabbitOctoPartQueue = ConfigurationManager.AppSettings["RabbitOctoPartQueue"].ToString();
        ushort SchedulePartUpdateConsumerPrefetchCount = ushort.Parse(ConfigurationManager.AppSettings["SchedulePartUpdateConsumerPrefetchCount"].ToString());
        bool octopartEnable = bool.Parse(ConfigurationManager.AppSettings["IsOctoPartAPIEnable"].ToString());
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : Create rabbitmq connection to receive message from rabbitmq. also creates queue and consumer for schedule part update queue
        /// </summary>
        public void Process()
        {
            try
            {
                using (channel = Helper.Helper.connection.CreateModel())
                {
                    channel.QueueDeclare(SchedulePartUpdateQueue, false, false, false, null);
                }

                channel = Helper.Helper.connection.CreateModel();
                channel.BasicQos(0, SchedulePartUpdateConsumerPrefetchCount, false);

                EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
                consumer.Received += (ch, FetchDigiPart) =>
                {
                    ProcessMessages(FetchDigiPart, channel, 1);
                };
                consumer.ConsumerTag = channel.BasicConsume(SchedulePartUpdateQueue, false, consumer);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will receive message from rabbitmq when any  part send to update schedule
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
                ComponentScheduleViewModel componentScheduleItem = JsonConvert.DeserializeObject<ComponentScheduleViewModel>(message);
                List<ComponentModel> componentList = new List<ComponentModel>();
                //send to octo part detail
                ExternalPartVerificationRequestLog objExternalPartVerificationRequestLogOcto = new ExternalPartVerificationRequestLog()
                {
                    supplier = componentScheduleItem.supplier,
                    type = ConstantHelper.FJTSchedulePartUpdate,
                    partNumber = componentScheduleItem.mfgPN,
                    partID = componentScheduleItem.id
                };
                // Commented code for octopart as its chargeble discussion on 08-02-2021 (CC/MK/VS/DV/DP)
                if (octopartEnable) { 
                 IRabbitMQSendMessageRequestHandler _IRabbitMQSendMessageRequestHandler = UnityConfig.Container.Resolve<IRabbitMQSendMessageRequestHandler>();
                 _IRabbitMQSendMessageRequestHandler.SendRequest(objExternalPartVerificationRequestLogOcto, RabbitOctoPartQueue);
                }
                if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue() || string.IsNullOrEmpty(componentScheduleItem.supplier))
                {
                    IDigiKeySchedulePartUpdateHandler _IDigiKeySchedulePartUpdateHandler = UnityConfig.Container.Resolve<IDigiKeySchedulePartUpdateHandler>();
                    _IDigiKeySchedulePartUpdateHandler.updateScheduleComponent(componentScheduleItem);
                }
                else if(componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.Mouser.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier= componentScheduleItem.supplier,
                        type=ConstantHelper.FJTSchedulePartUpdate,
                        partNumber= componentScheduleItem.mfgPN,
                        partID= componentScheduleItem.id
                    };
                    IMouserPartHandler _IMouserPartHandler = UnityConfig.Container.Resolve<IMouserPartHandler>(Helper.Helper.MouserAPIName);
                    _IMouserPartHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                else if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.Newark.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier = componentScheduleItem.supplier,
                        type = ConstantHelper.FJTSchedulePartUpdate,
                        partNumber = componentScheduleItem.mfgPN,
                        partID = componentScheduleItem.id
                    };
                    INewarkPartHandler _INewarkPartHandler = UnityConfig.Container.Resolve<INewarkPartHandler>();
                    _INewarkPartHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                else if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.Arrow.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier = componentScheduleItem.supplier,
                        type = ConstantHelper.FJTSchedulePartUpdate,
                        partNumber = componentScheduleItem.mfgPN,
                        partID = componentScheduleItem.id
                    };
                    IArrowPartUpdateHandler _IArrowPartUpdateHandler = UnityConfig.Container.Resolve<IArrowPartUpdateHandler>();
                    _IArrowPartUpdateHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                else if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.Avnet.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier = componentScheduleItem.supplier,
                        type = ConstantHelper.FJTSchedulePartUpdate,
                        partNumber = componentScheduleItem.mfgPN,
                        partID = componentScheduleItem.id
                    };
                    IAvnetPartHandler _IAvnetPartHandler = UnityConfig.Container.Resolve<IAvnetPartHandler>();
                    _IAvnetPartHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                else if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.TTI.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier = componentScheduleItem.supplier,
                        type = ConstantHelper.FJTSchedulePartUpdate,
                        partNumber = componentScheduleItem.mfgPN,
                        partID = componentScheduleItem.id
                    };
                    ITTIPartUpdateHandler _ITTIPartUpdateHandler = UnityConfig.Container.Resolve<ITTIPartUpdateHandler>();
                    _ITTIPartUpdateHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                else if (componentScheduleItem.supplier == Helper.Helper.UpdateComponentSupplier.HEILIND.GetEnumStringValue())
                {
                    ExternalPartVerificationRequestLog objExternalPartVerificationRequestLog = new ExternalPartVerificationRequestLog()
                    {
                        supplier = componentScheduleItem.supplier,
                        type = ConstantHelper.FJTSchedulePartUpdate,
                        partNumber = componentScheduleItem.mfgPN,
                        partID = componentScheduleItem.id
                    };
                    IHeilindPartUpdateHandler _IIHeilindPartUpdateHandler = UnityConfig.Container.Resolve<IHeilindPartUpdateHandler>();
                    _IIHeilindPartUpdateHandler.UpdateInsertPart(objExternalPartVerificationRequestLog, componentList);
                }
                channel.BasicAck(Model.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                channel.BasicAck(Model.DeliveryTag, false);
            }
        }
    }
}
