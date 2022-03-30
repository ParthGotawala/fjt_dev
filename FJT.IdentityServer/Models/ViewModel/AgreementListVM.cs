using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    /// <summary>
    /// Mapping result of Sproc_RetrieveAgreementList - resultset2
    /// </summary>
    public class AgreementListVM
    {
        public int id { get; set; }
        public string agreementType { get; set; }
        public string from_templateType { get; set; }
        public string where_used { get; set; }
        public string purpose { get; set; }
        public Byte isPublished { get; set; }
        public string agreementContent { get; set; }
        public string headerpublishedDate { get; set; }  
        public string newpublishedDate { get; set; } 
        public string publishedDate { get; set; }  
        public string version { get; set; }  
        public string draftversion { get; set; } 
        public int agreementID { get; set; }
        public string statusConvertedValue { get; set; }
        public string updatedby { get; set; }
        public string createdby { get; set; }
        public string createdbyRole { get; set; }
        public string updatedbyRole { get; set; }
        public string createdAt { get; set; }
        public string updatedAt { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class AgreementListData
    {
        public List<AgreementListVM> TemplateList { get; set; }
        public int Count { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_RetrieveAgreementList
    /// </summary>
    public class AgreementListDetails
    {
        public IEnumerable<SpCountVM> SpCountVM { get; set; }
        public IEnumerable<AgreementListVM> agreementListVMs { get; set; }
    }
}
