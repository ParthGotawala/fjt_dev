using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class AttachmentDetailModel
    {
        public string AttachmentName { get; set; }
        public byte[] BackupAttachment { get; set; }
    }
}