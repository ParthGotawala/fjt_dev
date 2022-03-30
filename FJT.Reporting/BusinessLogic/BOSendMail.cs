using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using FJT.Reporting.ViewModels;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web;
using static FJT.Reporting.Constant.Constant;

namespace FJT.Reporting.BusinessLogic
{
    public class BOSendMail : IBOSendMail
    {
        private readonly IAgreementRepository _iAgreementRepository;
        private readonly IErrorLog _IErrorLog;
        private readonly IEmail_SchedulemstRepository _IEmail_SchedulemstRepository;
        public BOSendMail(IAgreementRepository iAgreementRepository, IErrorLog IErrorLog, IEmail_SchedulemstRepository IEmail_SchedulemstRepository)
        {
            _iAgreementRepository = iAgreementRepository;
            _IErrorLog = IErrorLog;
            _IEmail_SchedulemstRepository = IEmail_SchedulemstRepository;
        }
        IModel channel = null;
        public static IConnection connection = null;
        string DirectivesTopic = ConfigurationManager.AppSettings["RabbitEmailQueue"].ToString();
        string CompanyName = ConfigurationManager.AppSettings["CompanyName"].ToString();
        string FJTWebUrl = ConfigurationManager.AppSettings["FJTWebUrl"].ToString();
        string CompanyLogoImage = ConfigurationManager.AppSettings["CompanyLogoImage"].ToString();
        string rabbitMqURI = ConfigurationManager.AppSettings["RabbitMqURI"].ToString();
        public void SendMailToQueue(int MessageTypeID, EmailModel emailData, CommonEmailDetailsViewModel sendMailDetails)
        {
            try
            {
                ConnectionFactory factory = new ConnectionFactory();
                factory.AutomaticRecoveryEnabled = true;
                factory.Uri = new Uri(rabbitMqURI);
                factory.UserName = ConfigurationManager.AppSettings["RabbitMqUserName"];
                factory.Password = ConfigurationManager.AppSettings["RabbitMqPassword"];
                factory.HostName = ConfigurationManager.AppSettings["RabbitMqEmailHost"];
                factory.VirtualHost = ConfigurationManager.AppSettings["RabbitMqEmailVirtualHost"];
                connection = factory.CreateConnection();
                channel = connection.CreateModel();

                Agreement objAgreement = _iAgreementRepository.Find(x => x.agreementTypeID == MessageTypeID && x.isPublished == true).OrderByDescending(x => x.version).FirstOrDefault();

                if (objAgreement.system_variables != null)
                {
                    var SystemVariables = objAgreement.system_variables.ToString().Split(',');
                    foreach (var sysvar in SystemVariables)
                    {
                        var sysVarUsed = sysvar.ToString().Trim();
                        switch (sysVarUsed)
                        {
                            case userNameHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(userNameHtmlTag, sendMailDetails.UserName);
                                    break;
                                }
                            case companyNameHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(companyNameHtmlTag, CompanyName);
                                    if (objAgreement.agreementSubject != null)
                                        objAgreement.agreementSubject = objAgreement.agreementSubject.Replace(companyNameHtmlTag, CompanyName);
                                    break;
                                }
                            case linkURLHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(linkURLHtmlTag, sendMailDetails.LinkURL);
                                    break;
                                }
                            case companyLogoHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(companyLogoHtmlTag, FJTWebUrl + "" + CompanyLogoImage);
                                    break;
                                }
                            case assemblyNameHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(assemblyNameHtmlTag, sendMailDetails.assemblyName);
                                    //objAgreement.agreementSubject = objAgreement.agreementSubject.Replace(assemblyNameHtmlTag, sendMailDetails.assemblyName);
                                    objAgreement.agreementSubject = objAgreement.agreementSubject.Replace(assemblyNameHtmlTag, sendMailDetails.customerCompanyName);
                                    break;
                                }
                            case customerCompanyNameHtmlTag:
                                {
                                    objAgreement.agreementContent = objAgreement.agreementContent.Replace(customerCompanyNameHtmlTag, sendMailDetails.customerCompanyName);
                                    break;
                                }
                            default:
                                break;
                        }
                    }
                }

                emailData.mailSendProviderType = MailGunServiceUsed;
                emailData.Subject = objAgreement.agreementSubject;
                emailData.Body = objAgreement.agreementContent;

                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = "Send to Mail Send to Queue from Report" + emailData.Subject,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
                string jsonified = JsonConvert.SerializeObject(emailData);
                var body = Encoding.UTF8.GetBytes(jsonified);
                var properties = channel.CreateBasicProperties();
                channel.BasicPublish(string.Empty, DirectivesTopic, properties, body);
            }
            catch (Exception ex)
            {
                ServiceLog objServiceLog = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = Constant.Constant.Report
                };
                _IErrorLog.sendErrorLog(objServiceLog);
            }
        }

        public void SendEmail(string sentToEmail, string sentCCEmail, string sentBCCEmail, string reportName, byte[] bytes, byte[] csvbyte, string customerCompanyName, int? emailTemplete, int? reportID)
        {
            var attachment = new AttachmentDetailModel();
            attachment.AttachmentName = string.Format("{0}.pdf", reportName);
            attachment.BackupAttachment = bytes;
            List<AttachmentDetailModel> attachmentlist = new List<AttachmentDetailModel>();
            attachmentlist.Add(attachment);
            if (csvbyte.Count() > 0)
            {
                var attachmentcsv = new AttachmentDetailModel();
                attachmentcsv.AttachmentName = string.Format("{0}.csv", reportName);
                attachmentcsv.BackupAttachment = csvbyte;
                attachmentlist.Add(attachmentcsv);
            }
            EmailModel message = new EmailModel()
            {
                To = sentToEmail,
                CC = sentCCEmail,
                BCC = sentBCCEmail,
                attachmentDetail = attachmentlist
            };
            CommonEmailDetailsViewModel sendMailDetails = new CommonEmailDetailsViewModel();
            sendMailDetails.customerCompanyName = customerCompanyName;
            SendMailToQueue(emailTemplete ?? (int)MessageTemplateType.DefaultEmail, message, sendMailDetails);
            // End -  Send Mail code after generate report from RDLC
            if (reportID != null)
                _IEmail_SchedulemstRepository.updateEmailSchedule(reportID.Value);
            //start update database for send email time
        }
    }
}