using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class RequestParameterVM
    {
        public int agreementTypeID { get; set; }
        public string displayName { get; set; }
        public string templateType { get; set; }
        public string userName { get; set; }
        public string userRoleName { get; set; }
    }
}
