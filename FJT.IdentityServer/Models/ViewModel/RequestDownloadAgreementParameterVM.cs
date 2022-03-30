using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class RequestDownloadAgreementParameterVM
    {
        public int? agreementTypeID { get; set; }
        public string userAgreementID { get; set; }
    }
}
