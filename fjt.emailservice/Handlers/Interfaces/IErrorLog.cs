using fjt.emailservice.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.emailservice.Handlers.Interfaces
{
   public interface IErrorLog
    {
        void sendErrorQueue(ServiceLog ServiceLog);
    }
}
