using fjt.emailservice.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.emailservice.BOEmail.Interface
{
    public interface ICommonApiEmail
    {
        bool SendEmail(EmailModel model);
    }
}
