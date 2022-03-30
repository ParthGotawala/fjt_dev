using FJT.IdentityServer.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    public class ForgotPassword
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = Constant.REQUIRED_INPUT_MSG)]
        public string EmailOrUserId { get; set; }

        public bool SuccessSendEmail { get; set; }
        public bool IsUserHaveEmail { get; set; }
    }
}
