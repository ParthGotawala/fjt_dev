using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Quickstart.Clients
{
    public class ApplicationClientViewModel
    {
        public string ClientID { get; set; }
        public ICollection<string> AllowedScopes { get; set; }
        public string ClientSceret { get; set; }
        public ICollection<string> AllowedCorsOrigins { get; set; }
        public ICollection<string> RedirectUris { get; set; }
        public string PostLogoutRedirectUri { get; set; }
        public string FrontChannelLogoutUri { get; set; }
        public bool isDefaultApp { get; set; }
        public bool AllowAccessTokensViaBrowser { get; set; }
    }
}
