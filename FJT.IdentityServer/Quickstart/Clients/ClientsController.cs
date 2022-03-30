using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Quickstart.Clients;
using FJT.IdentityServer.Repository.Interface;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Quickstart.Clients
{
    //[SecurityHeaders]
    //[Authorize]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ClientsController : Controller
    {
        private readonly IClientStore _clientStore;
        // private readonly IConfigurationDbContext _configurationDbContext;
        private readonly ConfigurationDbContext _configurationDbContext;
        private readonly IConfiguration _configuration;
        private readonly IFJTIdentityDbContext _fjtDBContext;
        private readonly IUserRepository _iUserRepository;



        public ClientsController(
            IClientStore clientStore,
            ConfigurationDbContext configurationDbContext,
            IFJTIdentityDbContext fjtDBContext,
            IUserRepository iUserRepository,
             IConfiguration configuration)
        {
            _clientStore = clientStore;
            _configurationDbContext = configurationDbContext;
            _configuration = configuration;
            _fjtDBContext = fjtDBContext;
            _iUserRepository = iUserRepository;

        }

        /// <summary>
        /// Manage clients
        /// </summary>
        /// 
        [HttpPost]
        public async Task<IActionResult> ManageClients(ClientsViewModel model)
        {
            //var client = await _clientStore.FindClientByIdAsync(model.ClientId);
            //if (client != null)
            //{
            //    return BadRequest("Client already exist!");
            //}

            var clientSecret = Helper.Helper.GenerateClientSecret();
            var clientId = Guid.NewGuid().ToString("N");

            var clientModel = new Client
            {
                ClientId = clientId,
                ClientName = model.ClientName,
                ClientSecrets = new List<Secret>
                {
                    new Secret(clientSecret.Sha256())
                },
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                // scopes that client has access to
                //AllowedScopes = new List<string>
                //{
                //    ClientConstant.APIScopes.FrontEnd.ToString(),
                //    //ClientConstant.IdentityServerAPI
                //}
            };

            _configurationDbContext.Clients.Add(clientModel.ToEntity());
            await _configurationDbContext.SaveChangesAsync();
            return Ok();
        }

        #region Create Client Secret
        /// <summary>
        /// Add Client Secret
        /// </summary>
        /// 
        [HttpPost]
        public async Task<IActionResult> AddClientSecret(ClientsViewModel model)
        {
            var client = _configurationDbContext.Clients.Include(x => x.ClientSecrets).Where(x => x.ClientName == model.ClientName).FirstOrDefault();

            if (client != null && client.ClientSecrets != null)
            {
                string ClientSecrets = client.ClientSecrets.FirstOrDefault().Value;
                return Ok(new { ClientID = client.ClientId, ClientSecrets = ClientSecrets });
            }
            else
            {
                var clientSecret = Helper.Helper.GenerateClientSecret();
                var clientId = Guid.NewGuid().ToString("N");
                var newclientSecret = clientSecret.Sha256();
                var clientModel = new Client
                {
                    ClientId = clientId,
                    ClientName = model.ClientName,
                    ClientSecrets = new List<Secret> {
                        new Secret(clientSecret.Sha256())
                    },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    // scopes that client has access to
                    //AllowedScopes = new List<string> {
                    //    ClientConstant.APIScopes.FrontEnd.ToString(),
                    //    //ClientConstant.IdentityServerAPI
                    //}
                };

                var obj = _configurationDbContext.Clients.Add(clientModel.ToEntity());
                await _configurationDbContext.SaveChangesAsync();

                var objnewClints = _configurationDbContext.Clients.Include(x => x.ClientSecrets).Where(x => x.ClientName == model.ClientName).FirstOrDefault();
                return Ok(new { ClientID = clientId, ClientSecrets = clientSecret, id = objnewClints != null ? objnewClints.Id : 0 });

            }
        }
        #endregion

        #region Update Client Secret
        /// <summary>
        /// Update Client Secret
        /// </summary>
        /// 
        [HttpPost]
        public async Task<IActionResult> UpdateClientSecret(ClientsViewModel model)
        {
            var client = _configurationDbContext.Clients.Include(x => x.ClientSecrets).Where(x => x.ClientName == model.ClientName).FirstOrDefault();
            if (client != null && client.ClientSecrets != null)
            {
                var clientSecret = Helper.Helper.GenerateClientSecret();

                var objcientscret = client.ClientSecrets.Where(x => x.ClientId == client.Id).FirstOrDefault();

                objcientscret.Value = clientSecret.Sha256();
                //_configurationDbContext.Clients.Update(client);

                await _configurationDbContext.SaveChangesAsync();

                return Ok(new { ClientID = client.ClientId, ClientSecrets = clientSecret, id = client.Id });

            }
            return Ok(new { ClientID = "", ClientSecrets = "", id = "" });
        }
        #endregion


        #region Update Appication Client
        /// <summary>
        /// Update Appication Client
        /// </summary>
        /// 
        [HttpPost]
        public async Task<IActionResult> UpdateAppicationClient(ClientsViewModel model)
        {
            string DomainName = _configuration["DomainName"];
            string LoginResponseRedirectUri = _configuration["LoginResponseRedirectUri"];
            string LogoutRedirectUri = _configuration["LogoutRedirectUri"];
            bool IsSecure = Convert.ToBoolean(_configuration["IsSecure"]);

            var client = _configurationDbContext.Clients
                .Include(x => x.RedirectUris)
                .Include(x => x.PostLogoutRedirectUris)
                .Include(x => x.AllowedCorsOrigins)
                .Where(x => x.Id == model.Id).FirstOrDefault();

            if (client != null)
            {
                client.ClientId = model.ClientName;
                client.ClientName = model.ClientName;

                string AllowedCorsOrigin = string.Format("{0}://{1}.{2}", (IsSecure ? "https" : "http"), model.ClientName, DomainName);
                string RedirectUri = string.Format("{0}://{1}.{2}{3}", (IsSecure ? "https" : "http"), model.ClientName, DomainName, LoginResponseRedirectUri);
                string PostLogoutRedirectUri = string.Format("{0}://{1}.{2}{3}", (IsSecure ? "https" : "http"), model.ClientName, DomainName, LogoutRedirectUri);

                var objAllowedCorsOrigin = client.AllowedCorsOrigins.Where(x => x.ClientId == client.Id).FirstOrDefault();
                var objRedirectUris = client.RedirectUris.Where(x => x.ClientId == client.Id).FirstOrDefault();
                var objPostLogoutRedirectUris = client.PostLogoutRedirectUris.Where(x => x.ClientId == client.Id).FirstOrDefault();

                objAllowedCorsOrigin.Origin = AllowedCorsOrigin;
                objRedirectUris.RedirectUri = RedirectUri;
                objPostLogoutRedirectUris.PostLogoutRedirectUri = PostLogoutRedirectUri;

                await _configurationDbContext.SaveChangesAsync();

                return Ok(new { ClientID = client.ClientId, id = client.Id });

            }
            return Ok(new { ClientID = "", id = "" });
        }
        #endregion

        #region Create Application User        
        /// <summary>
        /// Manage clients
        /// </summary>
        ///
        [HttpPost]
        public async Task<IActionResult> ManageApplicationClients(ApplicationClientViewModel model)
        {
            string PostLogoutRedirectUri = model.PostLogoutRedirectUri;

            Dictionary<string, string> properties =
                       new Dictionary<string, string>();
            var clientSecret = model.ClientSceret;
            var clientModel = new Client
            {
                ClientId = model.ClientID,
                ClientName = model.ClientID,
                ClientSecrets = new List<Secret>
                {
                    new Secret(clientSecret.Sha256())
                },
                Enabled = true,
                ProtocolType = "oidc",
                RequireClientSecret = false,
                RequireConsent = false,
                AllowRememberConsent = true,
                AlwaysIncludeUserClaimsInIdToken = false,
                RequirePkce = true,
                AllowPlainTextPkce = false,
                AllowAccessTokensViaBrowser = model.AllowAccessTokensViaBrowser,
                FrontChannelLogoutUri = model.FrontChannelLogoutUri,
                FrontChannelLogoutSessionRequired = true,
                BackChannelLogoutSessionRequired = true,
                AllowOfflineAccess = true,
                IdentityTokenLifetime = 3600,
                AccessTokenLifetime = 3600,
                AuthorizationCodeLifetime = 3600,
                AbsoluteRefreshTokenLifetime = 25920000,
                SlidingRefreshTokenLifetime = 25920000,
                RefreshTokenUsage = TokenUsage.OneTimeOnly,
                UpdateAccessTokenClaimsOnRefresh = true,
                RefreshTokenExpiration = TokenExpiration.Absolute,
                AccessTokenType = AccessTokenType.Jwt,
                EnableLocalLogin = true,
                IncludeJwtId = false,
                AlwaysSendClientClaims = false,
                ClientClaimsPrefix = "client_",
                DeviceCodeLifetime = 3600,

                AllowedGrantTypes = GrantTypes.Code,
                PostLogoutRedirectUris = new List<string>
                {
                    PostLogoutRedirectUri
                },
                // scopes that client has access to
                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    ClientConstant.APIScopes.IdentityServerAPI.ToString()

                },
                Properties = properties
            };

            //var fjtUIClint = _configurationDbContext.Clients.Where(x => x.ClientName == ClientConstant.FJTUIClientName).FirstOrDefault();
            //var frontApiResource = _configurationDbContext.ApiResources.Where(x => x.Name == "FJTAPI").FirstOrDefault();
            //bool newScopeSuccess = _iUserRepository.AddNewScope(model.AllowedScopes.ToList()[0], model.ClientID, frontApiResource.Id , fjtUIClint.Id);

            if (model.AllowedScopes != null)
            {
                model.AllowedScopes.ToList().ForEach(x =>
                {
                    clientModel.AllowedScopes.Add(x);
                });
            }

            if (model.AllowedCorsOrigins != null)
            {
                model.AllowedCorsOrigins.ToList().ForEach(x =>
                {
                    clientModel.AllowedCorsOrigins.Add(x);
                });
            }

            if (model.RedirectUris != null)
            {
                model.RedirectUris.ToList().ForEach(x =>
                {
                    clientModel.RedirectUris.Add(x);
                });
            }

            _configurationDbContext.Clients.Add(clientModel.ToEntity());

            await _configurationDbContext.SaveChangesAsync();

            var objClint = _configurationDbContext.Clients.Where(x => x.ClientName == model.ClientID).FirstOrDefault();

            if (model.isDefaultApp)
            {
                var userList = _fjtDBContext.ApplicationUsers.ToList();
                foreach (var user in userList)
                {
                    ClientUserMappingVM newClientUsersMapping = new ClientUserMappingVM()
                    {
                        ClientId = objClint.ClientId,
                        UserId = user.Id
                    };
                    bool mappingSuccess = await _iUserRepository.AddClientUserMap(newClientUsersMapping);
                }
            }

            return Ok(new { Id = objClint != null ? objClint.Id : 0, clientSecret });
        }
        #endregion

    }
}
