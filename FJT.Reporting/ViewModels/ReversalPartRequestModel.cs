using FJT.Reporting.Models;
using System;
namespace FJT.Reporting.ViewModels
{
    public class ReversalPartRequestModel : CommonEmailModel
    {
        public string customerID { get; set; }
        public string whereClause { get; set; }
        public string DateFormat { get; set; }
        public string DateTimeFormat { get; set; }
        public bool withAlternateParts { get; set; }
        public bool isObsolete { get; set; }
    }
}