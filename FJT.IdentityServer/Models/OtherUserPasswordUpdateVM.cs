using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    public class OtherUserPasswordUpdateVM
    {
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
        public string userId { get; set; }
    }
}
