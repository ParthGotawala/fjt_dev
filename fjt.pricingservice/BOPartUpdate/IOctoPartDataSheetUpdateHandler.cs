﻿using fjt.pricingservice.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.BOPartUpdate
{
   public interface IOctoPartDataSheetUpdateHandler
    {
        int UpdateInsertDataSheets(ExternalPartVerificationRequestLog Item);
    }
}
