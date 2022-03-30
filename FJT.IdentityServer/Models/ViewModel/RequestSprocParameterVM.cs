using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class RequestSprocParameterVM
    {
        public int Page { get; set; }
        public int pageSize { get; set; }
        public List<string[]> SortColumns { get; set; }
        public List<SearchColumn> SearchColumns { get; set; }
        public string templateType { get; set; }
        public int agreementID { get; set; }
        public int agreementTypeID { get; set; }
        public string userID { get; set; }
    }

    public class SearchColumn
    {
        public string ColumnName { get; set; }
        public string ColumnDataType { get; set; }
        public string SearchString { get; set; }
    }
}
