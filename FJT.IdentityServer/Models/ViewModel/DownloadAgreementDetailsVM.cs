using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping result of Sproc_GetDownloadAgreementDetails 
    /// </summary>
    public class DownloadAgreementDetailsVM
    {
        public int agreementTypeID { get; set; }
        public string compLogo { get; set; }
        public string agreementName { get; set; }
        public int version { get; set; }
        public DateTime createdAt { get; set; }
        public string agreementContent { get; set; }
        public string publishedDate { get; set; }
        public string userAgreementID { get; set; }
        public string signaturevalue { get; set; }
        public string agreedBy { get; set; }
        public string agreedDate { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class DownloadAgreementDetailsVMData
    {
        public List<DownloadAgreementDetailsVM> TemplateList { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_GetDownloadAgreementDetails.
    /// </summary>
    public class DownloadAgreementDetailsVMDetails
    {
        public IEnumerable<DownloadAgreementDetailsVM> DownloadAgreementDetailsVMs { get; set; }
    }
}
