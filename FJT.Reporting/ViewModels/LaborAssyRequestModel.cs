using FJT.Reporting.Models;
using System;

namespace FJT.Reporting.ViewModels
{
    public class LaborAssyRequestModel: CommonEmailModel
    {
        public int? customerID { get; set; }
        public DateTime? fromDate { get; set; }
        public DateTime? toDate { get; set; }
        public string pPartIds { get; set; }
    }
}