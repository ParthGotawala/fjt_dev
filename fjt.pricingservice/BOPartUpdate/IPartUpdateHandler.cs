using fjt.pricingservice.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.BOPartUpdate
{
   public interface IPartUpdateHandler
    {
        int UpdateInsertPart(ExternalPartVerificationRequestLog Item);
        int SavePartDetail(string mfgPN, string AccessToken, string ClientID, ExternalPartVerificationRequestLog objExtVerification, int? recordCount);
    }
}
