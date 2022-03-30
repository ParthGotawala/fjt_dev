using fjt.pricingservice.Model;
using System.Collections.Generic;

namespace fjt.pricingservice.BOPartUpdate
{
    public interface IArrowPartUpdateHandler
    {
        int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> componentList);
    }
}
