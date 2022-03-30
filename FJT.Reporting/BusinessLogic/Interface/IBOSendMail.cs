using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.BusinessLogic.Interface
{
    public interface IBOSendMail
    {
        void SendMailToQueue(int MessageTypeID, EmailModel sendMail, CommonEmailDetailsViewModel sendMailDetails);
        void SendEmail(string sentToEmail, string sentCCEmail, string sentBCCEmail, string reportName, byte[] bytes, byte[] csvbyte, string customerCompanyName, int? emailTemplete, int? reportID);
    }
}