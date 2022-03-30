using fjt.emailservice.BOEmail.Interface;
using fjt.emailservice.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace fjt.emailservice.BOEmail.Smtp
{
    public class SmtpEmailRequest : ICommonApiEmail
    {
        public static string FromMail = WebConfigurationManager.AppSettings["FromMail"].ToString();
        public static string FromMailPassword = WebConfigurationManager.AppSettings["FromMailPassword"].ToString();
        public static string SMTPHost = WebConfigurationManager.AppSettings["SMTPHost"].ToString();
        public static int SMTPPort = Convert.ToInt32(WebConfigurationManager.AppSettings["SMTPPort"]);
        public bool SendEmail(EmailModel model)
        {
            if (model == null || model.To.Length == 0)
            {
                return false;
            }

            SmtpClient client = new SmtpClient();
            client.Host = SMTPHost;
            client.Port = SMTPPort;
            MailMessage message = new MailMessage();
            message.From = new MailAddress(FromMail);
            foreach (var toaddress in (model.To.Split(',')))
            {
                message.To.Add(new MailAddress(toaddress));
            }
            if (model.CC != null && model.CC.Length > 0)
            {
                foreach (var ccaddress in (model.CC.Split(',')))
                {
                    message.CC.Add(new MailAddress(ccaddress));
                }
            }

            if (model.BCC != null && model.BCC.Length > 0)
            {
                foreach (var bccaddress in (model.BCC.Split(',')))
                {
                    message.Bcc.Add(new MailAddress(bccaddress));
                }
            }

            message.Subject = model.Subject;
            message.Body = model.Body;
            message.IsBodyHtml = true;
            client.Credentials = new System.Net.NetworkCredential(FromMail, FromMailPassword);
            client.EnableSsl = true;
            client.Send(message);
            return true;
        }
    }
}
