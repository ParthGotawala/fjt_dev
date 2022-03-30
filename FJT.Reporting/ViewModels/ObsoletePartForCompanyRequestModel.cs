using FJT.Reporting.Models;
using System;

namespace FJT.Reporting.ViewModels
{
    public class ObsoletePartForCompanyRequestModel : CommonEmailModel
    {
        public string customerID { get; set; }
        public string whereClause { get; set; }
        public string DateFormat { get; set; }
        public string DateTimeFormat { get; set; }
        public bool withAlternateParts { get; set; }
        public bool isObsolete { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
    }
}