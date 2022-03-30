using fjt.pricingservice.Model;
using System.Collections.Generic;

namespace fjt.pricingservice.BOPartUpdate
{
    public  interface INewarkPartHandler
    {
        int UpdateInsertPart(ExternalPartVerificationRequestLog Item,List<ComponentModel> componentList);
    }
}
