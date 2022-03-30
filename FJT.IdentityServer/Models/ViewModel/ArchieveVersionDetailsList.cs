using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{

    /// <summary>
    /// Mapping Result of Sproc_RetrieveArchieveVesrionDetails - resultset2.
    /// </summary>
    public class ArchieveVersionDetailsList
    {
        public string updatedby { get; set; }
        public string createdBy { get; set; }
        public bool isPublished { get; set; }
        public string agreementName { get; set; }
        public string newpublishedDate { get; set; }
        public string publishedDate { get; set; }
        public string agreementContent { get; set; }
        public int agreementTypeID { get; set; }
        public int version { get; set; }
        public int agreementID { get; set; }
    }

    /// <summary>
    /// Mapping results to ui.
    /// </summary>
    public class ArchieveVersionDetailsListData
    {
        public List<ArchieveVersionDetailsList> ArchieveList { get; set; }
        public int Count { get; set; }
    }

    /// <summary>
    /// Mapping Results Set of Sproc_RetrieveArchieveVesrionDetails
    /// </summary>
    public class ArchieveVersionDetailsListDetails
    {
        public IEnumerable<SpCountVM> SpCountVM { get; set; }
        public IEnumerable<ArchieveVersionDetailsList> ArchieveVersionDetailsLists { get; set; }
    }
}
