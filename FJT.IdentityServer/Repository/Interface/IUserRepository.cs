using FJT.IdentityServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository.Interface
{
    public interface IUserRepository
    {
        Task<bool> AddClientUserMap(ClientUserMappingVM objCientUsersMap);
        Task<bool> RemoveClientUserMap(ClientUserMappingVM objCientUsersMap);
        bool AddNewScope(string AllowedScopes, string ClientID, int frontApiResourceId, int fjtUIClintId);

        Task<bool> RemoveUser(List<string> UserIds);

        Task<bool> ClientUserMappingAvailabilityStaus(string UserId, string clientId);

    }
}
