using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer
{
    public class ClientConstant
    {
        // API Secret
        public const string Q2CAPISecret = "6fbb4570-4a3d-4b62-8509-a8e135de8933";

        public enum APIScopes
        {
            [Display(Name = "Identity Server API")]
            IdentityServerAPI,
            [Display(Name = "Q2C Front End")]
            Q2CFrontEnd,
            [Display(Name = "Q2C Report Designer")]
            Q2CReportDesigner,
            [Display(Name = "Q2C Report Viewer")]
            Q2CReportViewer
        }

        public enum APIResource
        {
            [Display(Name = "Q2C API")]
            Q2CAPI, 
            [Display(Name = "Identity Server API")]
            IdentityServerAPI
        }
        public enum Q2CClients
        {
            [Display(Name = "Q2C UI")]
            Q2CUI,
            [Display(Name = "Q2C Report Designer")]
            Q2CReportDesigner,
            [Display(Name = "Q2C Report Viewer")]
            Q2CReportViewer
        }
    }
}
