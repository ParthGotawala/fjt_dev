using FJT.IdentityServer.Helper;
using IdentityServer4;
using IdentityServer4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FJT.IdentityServer.ClientConstant;

namespace FJT.IdentityServer.Data.Seed
{

    public static class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiScope> GetApiScopes()
        {
            return new List<ApiScope>
            {
                new ApiScope("Q2CReportViewer","Q2C Report Viewer"),
                new ApiScope("Q2CReportDesigner","Q2C Report Designer"),
                new ApiScope("Q2CFrontEnd","Q2C Front End"),
                new ApiScope("IdentityServerAPI","Identity Server API")
            };

        }

        public static IEnumerable<ApiResource> GetApis()
        {
            return new List<ApiResource>
            {
                new ApiResource{
                    Name = ClientConstant.APIResource.IdentityServerAPI.ToString(),
                    DisplayName = ClientConstant.APIScopes.IdentityServerAPI.GetDisplayValue(),
                    Scopes = new List<string>{ ClientConstant.APIScopes.IdentityServerAPI.ToString() }
                },
                new ApiResource
                {
                    Name = ClientConstant.APIResource.Q2CAPI.ToString(),
                    DisplayName = ClientConstant.APIResource.Q2CAPI.GetDisplayValue(),
                    Scopes = new List<string>{
                        ClientConstant.APIScopes.Q2CFrontEnd.ToString(),
                        ClientConstant.APIScopes.Q2CReportDesigner.ToString(),
                        ClientConstant.APIScopes.Q2CReportViewer.ToString()
                    },
                    ApiSecrets = new List<Secret>
                    {
                        new Secret(ClientConstant.Q2CAPISecret.Sha256())
                    }
                }
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = "client",

                    // no interactive user, use the clientid/secret for authentication
                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    // secret for authentication
                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    // scopes that client has access to
                    AllowedScopes = { "web_api" }
                },
                // resource owner password grant client
                new Client
                {
                    ClientId = "ro.client",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = { "web_api" }
                },
                // OpenID Connect hybrid flow client (MVC)
                new Client
                {
                    ClientId = "mvc",
                    ClientName = "MVC Client",
                    AllowedGrantTypes = GrantTypes.Hybrid,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris           = { "http://localhost:5002/signin-oidc" },
                    PostLogoutRedirectUris = { "http://localhost:5002/signout-callback-oidc" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "web_api"
                    },

                    AllowOfflineAccess = true
                },
                // JavaScript Client
                new Client
                {
                    ClientId = "js",
                    ClientName = "JavaScript Client",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,

                    RedirectUris =           { "http://localhost:5003/callback.html" },
                    PostLogoutRedirectUris = { "http://localhost:5003/index.html" },
                    AllowedCorsOrigins =     { "http://localhost:5003" },
                    FrontChannelLogoutUri = "https://localhost:3000/#!/logoutresponse",

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "web_api"
                    }
                }
            };
        }
    }
}
