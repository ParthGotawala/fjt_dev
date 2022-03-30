using fjt.pricingservice.Model;
using System.Collections.Generic;

namespace fjt.pricingservice.BOPartUpdate
{
    public interface IAvnetPartHandler
    {
        int UpdateInsertPart(ExternalPartVerificationRequestLog Item, List<ComponentModel> ComponentList);
    }
}
