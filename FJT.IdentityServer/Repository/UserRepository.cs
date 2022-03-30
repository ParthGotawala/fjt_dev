using FJT.IdentityServer.Data;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models;
using FJT.IdentityServer.Repository.Interface;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository
{
    public class UserRepository : IUserRepository

    {
        private readonly FJTIdentityDbContext _context;

        public UserRepository(FJTIdentityDbContext context)
        {
            _context = context;
        }

        public bool AddNewScope(string AllowedScopes, string ClientID, int frontApiResourceId, int fjtUIClintId)
        {
            try
            {
                var newScope = new Models.ApiScope()
                {
                    Name = AllowedScopes,//model.AllowedScopes.ToList()[0],
                    DisplayName = ClientID,
                    Required = false,
                    Emphasize = false,
                    ShowInDiscoveryDocument = true
                };

                _context.ApiScopes.Add(newScope);

                var newClientScope = new ClientScope()
                {
                    ClientId = fjtUIClintId,
                    Scope = AllowedScopes
                };
                _context.ClientScopes.Add(newClientScope);

                _context.SaveChanges();

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }


        public async Task<bool> AddClientUserMap(ClientUserMappingVM objCientUsersMap)
        {
            try
            {
                var objCUMapping = await _context.ClientUsersMapping.Where(x => x.UserId == objCientUsersMap.UserId && x.ClientId == objCientUsersMap.ClientId).FirstOrDefaultAsync();

                if (objCUMapping == null)
                {
                    ClientUsersMapping clientUsersMapping = new ClientUsersMapping();
                    clientUsersMapping.ClientId = objCientUsersMap.ClientId;
                    clientUsersMapping.UserId = objCientUsersMap.UserId;
                    clientUsersMapping.isDeleted = false;
                    _context.ClientUsersMapping.Add(clientUsersMapping);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    objCUMapping.isDeleted = false;
                    _context.ClientUsersMapping.Update(objCUMapping);
                    await _context.SaveChangesAsync();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> RemoveClientUserMap(ClientUserMappingVM objCientUsersMap)
        {
            try
            {
                var objCUMapping = await _context.ClientUsersMapping.Where(x => x.UserId == objCientUsersMap.UserId && x.ClientId == objCientUsersMap.ClientId && x.isDeleted == false).FirstOrDefaultAsync();

                if (objCUMapping != null)
                {
                    objCUMapping.isDeleted = true;
                    _context.ClientUsersMapping.Update(objCUMapping);
                    await _context.SaveChangesAsync();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> RemoveUser(List<string> UserIds)
        {
            try
            {
                foreach (string userId in UserIds)
                {
                    var user = await _context.ApplicationUsers.Where(x => x.Id == userId).FirstOrDefaultAsync();
                    if (user != null)
                    {
                        user.isDeleted = true;

                        var objCUMapping = await _context.ClientUsersMapping.Where(x => x.UserId == userId).ToListAsync();
                        foreach (var ogjClntMap in objCUMapping)
                        {
                            ogjClntMap.isDeleted = true;
                            _context.ClientUsersMapping.Update(ogjClntMap);
                        }
                        _context.ApplicationUsers.Update(user);
                    }

                    // need to delete useragreements through SP.(03-08-2021)
                    var userAgreements = await _context.UserAgreement.Where(x => x.userID == userId).ToListAsync();
                    foreach (var item in userAgreements)
                    {
                        item.isDeleted = true;
                        _context.UserAgreement.Update(item);
                    }
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> ClientUserMappingAvailabilityStaus(string UserId, string clientId)
        {
            try
            {
                var objCUMapping = await _context.ClientUsersMapping.FirstOrDefaultAsync(x => x.UserId == UserId && x.isDeleted == false && x.ClientId == clientId);

                if (objCUMapping == null)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception e)
            {
                return false;
            }
        }

    }
}
