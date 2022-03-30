using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Models
{
    public class RequestFilterParameterVM
    {
        //public int? customerID { get; set; }
        //public int? partID { get; set; }
        //public int? employeeID { get; set; }
        //public int? supplierID { get; set; }
        //public int? mfgCodeID { get; set; }
        //public int? assyID { get; set; }
        //public int? mountingTypeID { get; set; }
        //public int? functionalTypeID { get; set; }
        //public int? partStatusID { get; set; }
        //public int? workorderID { get; set; }
        //public int? operationID { get; set; }
        //public bool? withAlternateParts { get; set; }
        //public int? radioButtonFilter { get; set; }
        //public DateTime? fromDate { get; set; }
        //public DateTime? toDate { get; set; }
        //public DateTime? fromTime { get; set; }
        //public DateTime? toTime { get; set; }
        //public int? packingSlipId { get; set; }
        public int id { get; set; }
        public string createdBy { get; set; }
        public string updatedBy { get; set; }
        public string deletedBy { get; set; }
        public int createByRoleId { get; set; }
        public int? updateByRoleId { get; set; }
        public int? deleteByRoleId { get; set; }
        public string reportName { get; set; }
        public string parameterValueJson { get; set; }
    }
}
