using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Enums
{
    public enum SearchDataType
    {
        StringContains,
        StringEquals,
        DateTime,
        Date,
        Number,
        Decimal,
        LongNumber,
        Boolean,

        Percentage,
        Grater
    }
}
