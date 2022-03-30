using FJT.IdentityServer.Models;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsFactory;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(UserManager<ApplicationUser> userManager, IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory)
        {
            _userManager = userManager;
            _claimsFactory = claimsFactory;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            var role = _userManager.GetRolesAsync(user).Result.FirstOrDefault();
            var principal = await _claimsFactory.CreateAsync(user);

            var claims = principal.Claims.ToList();
            claims = claims.Where(claim => context.RequestedClaimTypes.Contains(claim.Type)).ToList();

            // Add custom claims in token here based on user properties or any other source
            claims.Add(new Claim("userid", user.Id ?? string.Empty));
            //claims.Add(new Claim("username", string.Format("{0} {1}", user.FirstName, user.LastName)));
            claims.Add(new Claim("email", user.Email ?? string.Empty));
            claims.Add(new Claim("role", role ?? string.Empty));
            // claims.Add(new Claim("RefId", user.RefId.ToString() ?? string.Empty));
            //claims.Add(new Claim("RefType", user.RefType ?? string.Empty));
            claims.Add(new Claim("Phone", user.PhoneNumber ?? string.Empty));
            //claims.Add(new Claim("IdentityClientID", user.IdentityClientID ?? string.Empty));
            context.IssuedClaims = claims;

        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            context.IsActive = user != null;
        }
    }
}
