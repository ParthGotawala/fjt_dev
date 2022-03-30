using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping Result to ui.
    /// </summary>
    public class CommonResponse
    {
        public bool isDuplicate { get; set; }
        public int agreementTypeID { get; set; }
        public string updateByRole { get; set; }
        public string updatedBy { get; set; }
        public string displayName { get; set; }
        public string templateType { get; set; }
        public string updatedAt { get; set; }
        public string userName { get; set; }
        public string userRoleName { get; set; }
        public bool isMatchPassword { get; set; }
    }
}
