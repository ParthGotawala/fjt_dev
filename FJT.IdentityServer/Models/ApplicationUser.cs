using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    public class ApplicationUser : IdentityUser
    {
        //public ApplicationUser()
        //{
        //    ClientUsersMapping = new HashSet<ClientUsersMapping>();
        //}
        //public virtual ICollection<ClientUsersMapping> ClientUsersMapping { get; set; }
        public string userPasswordDigest { get; set; }
        public bool passwordHashUpdated { get; set; }
        public bool isDeleted { get; set; }

        public bool isSuperAdmin { get; set; }

        public DateTime? changePasswordAt { get; set; }
    }
}
