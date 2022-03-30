using fjt.emailservice.BOEmail.Interface;
using fjt.emailservice.Handlers.Interfaces;
using fjt.emailservice.Model;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Linq;
using System.Web.Configuration;

namespace fjt.emailservice.BOEmail.Mailgun
{
    public class MailgunEmailRequest : ICommonApiEmail
    {
        public static string MailgunApiUrl = WebConfigurationManager.AppSettings["MailgunApiUrl"].ToString();
        public static string Mailgunkey = WebConfigurationManager.AppSettings["Mailgunkey"].ToString();
        public static string MailgunDomainName = WebConfigurationManager.AppSettings["MailgunDomainName"].ToString();
        public static string FromMailForAdmin = WebConfigurationManager.AppSettings["FromMail"].ToString();
        private readonly IErrorLog _IErrorLog;
        public MailgunEmailRequest(IErrorLog IErrorLog)
        {
            _IErrorLog = IErrorLog;
        }
        public bool SendEmail(EmailModel model)
        {
            try
            {
                if (model == null || model.To==null || model.To.Length == 0)
                {
                    return false;
                }

                RestClient client = new RestClient(MailgunApiUrl);
                client.Authenticator = new HttpBasicAuthenticator("api", Mailgunkey);
                RestRequest request = new RestRequest();
                request.AddParameter("domain", MailgunDomainName, ParameterType.UrlSegment);
                request.Resource = "{domain}/messages";
                request.AddParameter("from", FromMailForAdmin);
                if (model.attachmentDetail != null && model.attachmentDetail.Count > 0)
                {
                    foreach (var item in model.attachmentDetail)
                    {
                        if (!string.IsNullOrEmpty(item.AttachmentName))
                            request.AddFile("attachment", item.BackupAttachment.ToArray(), item.AttachmentName);
                    }
                }

                foreach (var item in model.To.Split(','))
                {
                    request.AddParameter("to", item);
                }

                if (model.CC != null && model.CC.Length > 0)
                {
                    foreach (var item in (model.CC.Split(',')))
                    {
                        request.AddParameter("cc", item);
                    }
                }

                if (model.BCC != null && model.BCC.Length > 0)
                {
                    foreach (var item in (model.BCC.Split(',')))
                    {
                        request.AddParameter("bcc", item);
                    }
                }
                request.AddParameter("subject", model.Subject);
                request.AddParameter("html", model.Body);
                request.Method = Method.POST;
                client.Execute(request);
            }
            catch (Exception ex)
            {
                ServiceLog objModel = new ServiceLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = "EMail"
                };
                _IErrorLog.sendErrorQueue(objModel);
            }
            return true;
        }
    }
}
