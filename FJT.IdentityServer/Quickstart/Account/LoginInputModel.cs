// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using FJT.IdentityServer.Helper;
using System.ComponentModel.DataAnnotations;

namespace IdentityServerHost.Quickstart.UI
{
    public class LoginInputModel
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = Constant.REQUIRED_INPUT_MSG)]
        public string Username { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = Constant.REQUIRED_INPUT_MSG)]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }
        
        public bool ShowAcceptAgreementPopUp { get; set; }
        public bool AcceptAgreement { get; set; }


        public string ManageSignatureUI { get; set; }
        public string Signature { get; set; }
        public string FinalSignature { get; set; }

    }
}
