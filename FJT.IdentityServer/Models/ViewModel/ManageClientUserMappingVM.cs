using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class ManageClientUserMappingVM
    {
        public string UserId { get; set; }
        public string ClientName { get; set; }
        public bool toAdd { get; set; }
    }
}
