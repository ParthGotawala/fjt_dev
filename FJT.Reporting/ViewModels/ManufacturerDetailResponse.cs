using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ManufacturerDetailResponse
    {
        public string mfgCode { get; set; }
        public string mfgName { get; set; }
        public string createdAt { get; set; }
        public string createdBy { get; set; }
        public string alias { get; set; }
        public string aliasCreatedAt { get; set; }
        public string  aliasCreatedBy { get; set; }
        public DateTime? mfgCreatedAt { get; set; }
        public DateTime? mfgAliasCreatedAt { get; set; }




    }
}