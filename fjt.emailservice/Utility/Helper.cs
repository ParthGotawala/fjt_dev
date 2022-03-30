using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.emailservice.Utility
{
    public static class Helper
    {
        public enum EmailAPINames
        {
            [StringValue("Mailgun")]
            Mailgun,
            [StringValue("Smtp")]
            Smtp
        }
    }
}
