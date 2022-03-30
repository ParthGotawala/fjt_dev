using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.PricingApiAuthentication.Interface;
using fjt.pricingservice.Repository.Interface;
using System;
using System.Configuration;
using System.Net;
using System.ServiceProcess;
using System.Timers;
using Unity;


namespace fjt.pricingservice
{
    public partial class PricingServices : ServiceBase
    {
        public Timer updateStatusTimer;
        public Timer updateComponentTimer;
        public Timer mailComponentTimer;
        public Timer datasheetComponentTimer;
        public Timer updateElasticDataTimer;
        public readonly ICommonApiPricing _ICommonApiPricing;
        public readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly IRabbitMQ _IRabbitMQ;
        double mailComponentUpdateTime = double.Parse(ConfigurationManager.AppSettings["mailComponentUpdateTime"].ToString());
        bool isLocalEnv = bool.Parse(ConfigurationManager.AppSettings["IsLocalEnvironment"].ToString());
        string SchedulePartUpdateQueue = ConfigurationManager.AppSettings["SchedulePartUpdateQueue"].ToString();
        bool isUpdateOldComponent = bool.Parse(ConfigurationManager.AppSettings["IsUpdateOldComponent"].ToString());
        public bool isEmailSent = false;
        public PricingServices()
        {
            _ICommonApiPricing = UnityConfig.Container.Resolve<ICommonApiPricing>();
            _IsystemconfigrationsRepository = UnityConfig.Container.Resolve<IsystemconfigrationsRepository>();
            _IRabbitMQ = UnityConfig.Container.Resolve<IRabbitMQ>();
            InitializeComponent();
            if (isLocalEnv)
            {
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            }
        }
        public void serviecInitialize()
        {
            try
            {
                #region BOM Part DK Version 3
                IBOM_CleanPartDKV3RequestHandler cleanBomDKV3 = UnityConfig.Container.Resolve<IBOM_CleanPartDKV3RequestHandler>();
                cleanBomDKV3.Process();
                #endregion
                #region Part DK V3 Verification
                IPart_CleanDigikeyV3RequestHandler partcleanDKV3handler = UnityConfig.Container.Resolve<IPart_CleanDigikeyV3RequestHandler>();
                partcleanDKV3handler.Process();
                #endregion


                #region Part MO Verification
                IPart_CleanMouserRequestHandler partcleanMOhandler = UnityConfig.Container.Resolve<IPart_CleanMouserRequestHandler>();
                partcleanMOhandler.Process();
                #endregion

                #region Part AV Verification
                IPart_CleanAvnetRequestHandler partcleanAVhandler = UnityConfig.Container.Resolve<IPart_CleanAvnetRequestHandler>();
                partcleanAVhandler.Process();
                #endregion

                #region Part NW Verification
                IPart_CleanNewarkRequestHandler partcleanNWhandler = UnityConfig.Container.Resolve<IPart_CleanNewarkRequestHandler>();
                partcleanNWhandler.process();
                #endregion

                #region Part AR Verification
                IPart_CleanArrowRequestHandler partcleanARhandler = UnityConfig.Container.Resolve<IPart_CleanArrowRequestHandler>();
                partcleanARhandler.Process();
                #endregion
                #region Part TTI Verification
                IPart_CleanTTIRequestHandler partcleanTTIhandler = UnityConfig.Container.Resolve<IPart_CleanTTIRequestHandler>();
                partcleanTTIhandler.Process();
                #endregion

                #region Part Heilind Verification
                IPart_CleanHeilindRequestHandler partcleanHeilindhandler = UnityConfig.Container.Resolve<IPart_CleanHeilindRequestHandler>();
                partcleanHeilindhandler.Process();
                #endregion
                #region InoAuto Queue 
                //IInoAutoMessagePassRequestHandler InoAutoMessagePassRequestHandler = UnityConfig.Container.Resolve<IInoAutoMessagePassRequestHandler>();
                //InoAutoMessagePassRequestHandler.Process(); // to send message to exchange
                #endregion


                #region BOM Part Mouser
                IBOM_CleanPartMouserRequestHandler mouserCleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartMouserRequestHandler>();
                mouserCleanhandler.Process();
                #endregion

                #region BOM Part Avnet
                IBOM_CleanPartAvnetRequestHandler avnetcleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartAvnetRequestHandler>();
                avnetcleanhandler.Process();
                #endregion

                #region BOM Part Newark
                IBOM_CleanPartNewarkRequestHandler newarkcleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartNewarkRequestHandler>();
                newarkcleanhandler.process();
                #endregion
                #region BOM Part Arrow
                IBOM_CleanPartArrowRequestHandler arrowcleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartArrowRequestHandler>();
                arrowcleanhandler.Process();
                #endregion

                #region BOM Part TTI
                IBOM_CleanPartTTIRequestHandler tticleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartTTIRequestHandler>();
                tticleanhandler.Process();
                #endregion
                #region BOM Part Heilind
                IBOM_CleanPartHeilindRequestHandler heilindcleanhandler = UnityConfig.Container.Resolve<IBOM_CleanPartHeilindRequestHandler>();
                heilindcleanhandler.Process();
                #endregion
                #region Error Log Connection
                IErrorLogRequestHandler ErrorLogRequestHandler = UnityConfig.Container.Resolve<IErrorLogRequestHandler>();
                ErrorLogRequestHandler.Process();
                #endregion

                #region Digi key Api
                IDigikeyApiAuthentication digiKeyAuthentication = UnityConfig.Container.Resolve<IDigikeyApiAuthentication>();
                digiKeyAuthentication.CreateConnection(); // no enable https call

                //create consumer for digikey v3
                IDigikeyV3ApiRequestHandler digiKeyV3ConsumerHandler = UnityConfig.Container.Resolve<IDigikeyV3ApiRequestHandler>();
                digiKeyV3ConsumerHandler.Process();

                #endregion

                #region Mouser Api
                //Create Consumer for mouser key 
                IMouserApiRequestHandler mouserConsumerHandler = UnityConfig.Container.Resolve<IMouserApiRequestHandler>();
                mouserConsumerHandler.Process();
                #endregion

                #region Newark Api
                //Create Consumer for newark key 
                INewarkApiRequestHandler newarkConsumerHandler = UnityConfig.Container.Resolve<INewarkApiRequestHandler>();
                newarkConsumerHandler.Process();
                #endregion

                #region Arrow Api
                //Create Consumer for arrow key 
                IArrowApiRequestHandler arrowConsumerHandler = UnityConfig.Container.Resolve<IArrowApiRequestHandler>();
                arrowConsumerHandler.Process();
                #endregion

                #region Avnet Api
                //Create Consumer for arrow key 
                IAvnetApiRequestHandler avnetConsumerHandler = UnityConfig.Container.Resolve<IAvnetApiRequestHandler>();
                avnetConsumerHandler.Process();
                #endregion

                #region TTI Api
                //Create Consumer for tti key 
                ITTIApiRequestHandler ttiConsumerHandler = UnityConfig.Container.Resolve<ITTIApiRequestHandler>();
                ttiConsumerHandler.Process();
                #endregion
                #region Heilind Api
                //Create Consumer for heilind key 
                IHeilindApiRequestHandler heilindConsumerHandler = UnityConfig.Container.Resolve<IHeilindApiRequestHandler>();
                heilindConsumerHandler.Process();
                #endregion

                #region Part Picture
                //Create Consumer for Part Picture 
                IPartPictureRequestHandler partpictureConsumerHandler = UnityConfig.Container.Resolve<IPartPictureRequestHandler>();
                partpictureConsumerHandler.Process();
                #endregion


                #region Schedule Part Verification
                ISchedulePartRequestHandler scheduleparthandler = UnityConfig.Container.Resolve<ISchedulePartRequestHandler>();
                scheduleparthandler.Process();
                #endregion

                #region OctoPart DataSheet
                IOctoPartRequestHandler octopartConsumerHandler = UnityConfig.Container.Resolve<IOctoPartRequestHandler>();
                octopartConsumerHandler.Process();

                #endregion
            }
            catch (Exception ex)
            {
                if (ex.Message == ConstantHelper.RabbitMQDisconnectedMessage)
                {
                    serviecInitialize();
                }
            }
        }
        protected override void OnStart(string[] args)
        {
            try
            {
                updateStatusTimer = new Timer(2 * 60 * 1000); // every 2 minutes
                updateStatusTimer.Elapsed += new System.Timers.ElapsedEventHandler(CheckForPendingStatus);
                updateStatusTimer.Start();
                updateStatusTimer.Enabled = true;

                //update component after every 24 hours but job runs at every 40 seconds to check time.
                updateComponentTimer = new Timer(1 * 40 * 1000); // every 40 second need to check
                updateComponentTimer.Elapsed += new System.Timers.ElapsedEventHandler(UpdateOldComponentDetails);
                updateComponentTimer.Start();
                updateComponentTimer.Enabled = true;

                mailComponentTimer = new Timer(mailComponentUpdateTime); // every 6 hours
                mailComponentTimer.Elapsed += new System.Timers.ElapsedEventHandler(MailOldComponentDetails);
                mailComponentTimer.Start();
                mailComponentTimer.Enabled = true;

                //update component after every 24 hours.
                datasheetComponentTimer = new Timer(24 * 60 * 60 * 1000); // every 24 hours
                datasheetComponentTimer.Elapsed += new System.Timers.ElapsedEventHandler(UpdateDataSheets);
                datasheetComponentTimer.Start();
                datasheetComponentTimer.Enabled = true;

                //Sync data to Elastic which Update using Triiger after every 30 min.
                updateElasticDataTimer = new Timer(30 * 60 * 1000); // every 30 min
                updateElasticDataTimer.Elapsed += new System.Timers.ElapsedEventHandler(SyncPendingElasticData);
                updateElasticDataTimer.Start();
                updateElasticDataTimer.Enabled = true;
                SendRequestTocheckCartStatus();
                //call to send report on laod
                sendMailForScheduledReports();
                _IsystemconfigrationsRepository.SetSystemConfiguration(ConstantHelper.PricingServiceStatus, "1");
                //call to get data sheets on load page
                //updateDataSheetLink();

                _ICommonApiPricing.UpdatePriceBreakComponent();
                serviecInitialize();
            }
            catch (Exception ex)
            {
                if (ex.Message == ConstantHelper.RabbitMQDisconnectedMessage)
                {
                    serviecInitialize();
                }
                //ServiceErrorLog objErrorLog = new ServiceErrorLog()
                //{
                //    error = ex.Message,
                //    stackTrace = ex.StackTrace,
                //};
                //_IRabbitMQ.SendRequest(objErrorLog);
            }
        }

        // check for all status which is in send request from last 1 mins
        public void CheckForPendingStatus(object source, ElapsedEventArgs e)
        {
            _ICommonApiPricing.UpdatePendingAutoPricingStatus();
        }

        // Specify what you want to happen when the Elapsed event is raised. 
        public void UpdateOldComponentDetails(object source, ElapsedEventArgs e)
        {
            IsystemconfigrationsRepository _IsystemconfigrationsRepository = UnityConfig.Container.Resolve<IsystemconfigrationsRepository>();
            var componentObject = _IsystemconfigrationsRepository.GetSystemConfiguration(Helper.Helper.ConfigKeys.ComponentUpdateTimeInHrs.GetEnumStringValue());
            string minutes = DateTime.UtcNow.Minute.ToString().Length > 1 ? DateTime.UtcNow.Minute.ToString() : string.Format("0{0}", DateTime.UtcNow.Minute);

            if (ConstantHelper.defaultMailTime == string.Format("{0}.{1}", DateTime.UtcNow.Hour, minutes) && !isEmailSent)
            {
                isEmailSent = true;
                _ICommonApiPricing.sendEmailforPartAttribute();
            }
            else { isEmailSent = false; }
            if (isUpdateOldComponent == true && componentObject.values == string.Format("{0}.{1}", DateTime.UtcNow.Hour, minutes))
            {
                var msg = ConstantHelper.connection.CreateModel().BasicGet(SchedulePartUpdateQueue, false);
                if (msg == null)
                {
                    _ICommonApiPricing.UpdateOldComponentDetails();
                }
            }

        }
        // mail schedule
        public void MailOldComponentDetails(object source, ElapsedEventArgs e)
        {
            sendMailForScheduledReports();
            // SendRequestTocheckCartStatus();
        }

        /*Send Auto Mail for scheduled reports at selected intervals*/
        public void sendMailForScheduledReports()
        {
            IsystemconfigrationsRepository _IsystemconfigrationsRepository = UnityConfig.Container.Resolve<IsystemconfigrationsRepository>();
            var mailschedulelist = _IsystemconfigrationsRepository.getMailScheduleCustomerList();
            foreach (var mailScheduleObj in mailschedulelist)
            {
                switch (mailScheduleObj.schedule)
                {
                    case (int)Helper.Helper.MailScheduleType.Daily:
                        {
                            if (mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat))
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                    case (int)Helper.Helper.MailScheduleType.Weekly:
                        {
                            if ((mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat)) &&
                                DateTime.Now.DayOfWeek.ToString() == ConstantHelper.Monday)
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                    case (int)Helper.Helper.MailScheduleType.Monthly:
                        {
                            if ((mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat)) &&
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToString(ConstantHelper.DateFormat))
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                    case (int)Helper.Helper.MailScheduleType.SemiAnnually:
                        {
                            if ((mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat)) &&
                                (DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 1, 1).ToString(ConstantHelper.DateFormat) ||
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 6, 1).ToString(ConstantHelper.DateFormat)))
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                    case (int)Helper.Helper.MailScheduleType.Quarterly:
                        {
                            if ((mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat)) &&
                                (DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 1, 1).ToString(ConstantHelper.DateFormat) ||
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 4, 1).ToString(ConstantHelper.DateFormat) ||
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 7, 1).ToString(ConstantHelper.DateFormat) ||
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 10, 1).ToString(ConstantHelper.DateFormat)))
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                    case (int)Helper.Helper.MailScheduleType.Annually:
                        {
                            if ((mailScheduleObj.lastEmailSendDate == null ||
                                mailScheduleObj.lastEmailSendDate.Value.ToString(ConstantHelper.DateFormat) != DateTime.Now.ToString(ConstantHelper.DateFormat)) &&
                                DateTime.Now.ToString(ConstantHelper.DateFormat) == new DateTime(DateTime.Now.Year, 1, 1).ToString(ConstantHelper.DateFormat))
                            {
                                sendCustomerDetail(mailScheduleObj, _IsystemconfigrationsRepository);
                            }
                        }
                        break;
                }
            }
        }

        // send Request to check status
        public void SendRequestTocheckCartStatus()
        {
            _ICommonApiPricing.SendRequestTocheckCartStatus();
        }

        public void sendCustomerDetail(MailScheduleModel objModel, IsystemconfigrationsRepository _IsystemconfigrationsRepository)
        {
            var toMail = _IsystemconfigrationsRepository.getContactPersonEmail(objModel.id);
            var ccMail = _IsystemconfigrationsRepository.getCustomerEmail(objModel.customerID.Value);
            var bccMail = _IsystemconfigrationsRepository.GetSystemConfiguration(ConstantHelper.BCCEmail);
            ObsoletePartRequestModel model = new ObsoletePartRequestModel()
            {
                customerID = objModel.customerID.ToString(),
                isObsolete = true,
                sentToEmail = toMail,
                sentCCEmail = ccMail,
                reportName = objModel.reportName,
                customerCompanyName = objModel.customerName,
                refID = objModel.id,
                withAlternateParts = objModel.withAlternateParts,
                sentBCCEmail = bccMail.values,
                emailTemplete = objModel.emailTemplete
            };
            if (objModel.reportName == ConstantHelper.ReportName)
            {
                var objconfig = _IsystemconfigrationsRepository.GetSystemConfiguration(ConstantHelper.DefaultMFRUpdateTimeDaysKey);
                if (objconfig != null)
                {
                    int days = objconfig.values != null ? int.Parse(objconfig.values) : ConstantHelper.DefaultMFRUpdateDay; //default 7 days
                    model.todate = DateTime.UtcNow;
                    model.fromdate = DateTime.UtcNow.AddDays(-(days));
                }
            }
            else if (objModel.reportName == ConstantHelper.ObsoletePartForCompanyReportName)
            {
                //return if setting is not for company because this report is only for company
                if (objModel.isCompany != 1)
                {
                    return;
                }
                var objconfig = _IsystemconfigrationsRepository.GetSystemConfiguration(ConstantHelper.DefaultObsoletePartReportDaysForCompanyKey);
                if (objconfig != null)
                {
                    int days = objconfig.values != null ? int.Parse(objconfig.values) : ConstantHelper.DefaultObsoleteDays; //default 31 days
                    model.todate = DateTime.UtcNow;
                    model.fromdate = DateTime.UtcNow.AddDays(-(days));
                    model.customerID = null;//set  null to send report for all customers to company owner
                }
            }
            else if (objModel.reportName == ConstantHelper.ObsoletePartDetailsPerAssemblyReportName)
            {
                model.selectedRadioButtonValue = 1;
            }
            _ICommonApiPricing.sendCustomerDetailForReport(model, objModel.reportAPI);
        }
        protected override void OnStop()
        {
            _IsystemconfigrationsRepository.SetSystemConfiguration(ConstantHelper.PricingServiceStatus, "0");
            updateStatusTimer.Enabled = false;
            updateComponentTimer.Enabled = false;
            mailComponentTimer.Enabled = false;
            datasheetComponentTimer.Enabled = false;
            updateElasticDataTimer.Enabled = false;
            base.OnStop();

        }
        public void Start(string[] args)
        {
            OnStart(args);
        }

        public void Stop()
        {
            OnStop();
        }

        //data sheet link list
        public void updateDataSheetLink()
        {
            _ICommonApiPricing.downloaddataSheetLinks();
        }

        public void UpdateDataSheets(object source, ElapsedEventArgs e)
        {
            updateDataSheetLink();
        }

        //data sheet link list
        public void SyncPendingTriggerElasticData()
        {
            _ICommonApiPricing.SyncPendingElasticData();
        }

        public void SyncPendingElasticData(object source, ElapsedEventArgs e)
        {
            SyncPendingTriggerElasticData();
        }
    }
}
