using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping result of Sproc_GetAgreementDetails - resultSet2
    /// </summary>
    public class GetAgreementDetail
    {
        public string AgreementName { get; set; }
        public string LastPublishedDate { get; set; }
        public string LastPublishversion { get; set; }
        public string draftversion { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class GetAgreementDetailData
    {
        public List<GetAgreementDetail> data { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_GetAgreementDetails
    /// </summary>
    public class GetAgreementDetailDetails
    {
        public IEnumerable<GetAgreementDetail> GetAgreementDetails { get; set; }
    }
}
