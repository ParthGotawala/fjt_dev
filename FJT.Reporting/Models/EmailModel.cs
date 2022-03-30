using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Models
{
    public class EmailModel
    {
        public string mailSendProviderType { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<string> Attachments { get; set; }
        public virtual ICollection<AttachmentDetailModel> attachmentDetail { get; set; }       
    }
}