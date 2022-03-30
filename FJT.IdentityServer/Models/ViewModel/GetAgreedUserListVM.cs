using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping result of Sproc_getAgreedUserList - resultset2
    /// </summary>
    public class GetAgreedUserListVM
    {
        public int userAgreementID { get; set; }
        public string imageURL { get; set; }
        public int version { get; set; }
        public bool isPublished { get; set; }
        public string agreementContent { get; set; }
        public int agreementID { get; set; }
        public string from_userID { get; set; }
        public string createdBy { get; set; }
        public string userName { get; set; }
        public string newpublishedDate { get; set; }
        public string newagreedDate { get; set; }
        public string publishedDate { get; set; }
        public string agreedDate { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class GetAgreedUserListVMData
    {
        public List<GetAgreedUserListVM> AgreedUserList { get; set; }
        public int Count { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_getAgreedUserList
    /// </summary>
    public class GetAgreedUserListVMDetails
    {
        public IEnumerable<SpCountVM> SpCountVM { get; set; }
        public IEnumerable<GetAgreedUserListVM> GetAgreedUserListVMs { get; set; }
    }
}
