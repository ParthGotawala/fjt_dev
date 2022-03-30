using FJT.IdentityServer.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class ResetUserPasswordVM
    {
        public string User { get; set; }
        public string UserToken { get; set; }

        [DisplayName("New Password")]
        [Required(AllowEmptyStrings = false, ErrorMessage = Constant.REQUIRED_INPUT_MSG)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@@$!%*?&])[A-Za-z\d@@$!%*?&]{8,}$", ErrorMessage = Constant.PASSWORD_VALIDATION_INPUT_MSG)]
        public string NewPassword { get; set; }

        [DisplayName("Confirm New Password")]
        [Required(AllowEmptyStrings = false, ErrorMessage = Constant.REQUIRED_INPUT_MSG)]
        [Compare("NewPassword", ErrorMessage = Constant.PASSWORD_MISMATCH_INPUT_MSG)]
        public string ConfirmPassword { get; set; }
    }
}
