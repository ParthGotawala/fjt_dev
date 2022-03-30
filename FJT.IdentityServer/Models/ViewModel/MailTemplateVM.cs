using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class MailTemplateVM
    {
        public string LinkURL { get; set; }
        public int AgreementTypeID { get; set; }
        public string UserName { get; set; }
        public string CompanyLogo { get; set; } 
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string[] ToSendEmailsAddress { get; set; }

        public string AssemblyName { get; set; }
        public string CustomerCompanyName { get; set; }
    }
}
