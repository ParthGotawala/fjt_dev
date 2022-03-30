using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping Result of - Sproc_RetrieveUserSignUpAgreementList - resultset2
    /// </summary>
    public class UserSignUpAgreementList
    {
        public bool isPublished { get; set; }
        public int userAgreementID { get; set; }
        public int agreementID { get; set; }
        public int agreementTypeID { get; set; }
        public string agreedDate { get; set; }
        public string agreementContent { get; set; }
        public string imageURL { get; set; }
        public int version { get; set; }  
        public string templateType { get; set; }
        public string newpublishedDate { get; set; }
        public string latestversion { get; set; }  
        public string headerpublishedDate { get; set; } 
        public string agreementName { get; set; } 
        public string createdby { get; set; }
        public int rnk { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class UserSignUpAgreementListData
    {
        public List<UserSignUpAgreementList> AgreementUserList { get; set; }
        public int Count { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_RetrieveUserSignUpAgreementList
    /// </summary>
    public class UserSignUpAgreementListDetails
    {
        public IEnumerable<SpCountVM> SpCountVM { get; set; }
        public IEnumerable<UserSignUpAgreementList> UserSignUpAgreementLists { get; set; }
    }
}
