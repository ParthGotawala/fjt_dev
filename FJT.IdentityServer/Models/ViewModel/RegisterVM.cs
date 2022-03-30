using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Quickstart.UI
{
    public class RegisterVM
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        public int Id { get; set; }
        public string IdentityId { get; set; }
    }


    public class IdPair
    {
        public int userId { get; set; }

        public string IdentityId { get; set; }

    }
}
