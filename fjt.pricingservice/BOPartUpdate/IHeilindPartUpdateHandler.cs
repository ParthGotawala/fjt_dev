using fjt.pricingservice.Model;
using System.Collections.Generic;

namespace fjt.pricingservice.BOPartUpdate
{
    public interface IHeilindPartUpdateHandler
    {
        int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> componentList);
    }
}
