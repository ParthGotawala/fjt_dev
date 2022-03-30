using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Models
{
    public class FilterParameters
    {
        public string customerID { get; set; }
        public int? partID { get; set; }
        public int? employeeID { get; set; }
        public string supplierIDs { get; set; }
        public string mfgCodeIDs { get; set; }
        public int? assyID { get; set; }
        public string mountingTypeIDs { get; set; }
        public string functionalTypeIDs { get; set; }
        public string partStatusIDs { get; set; }
        public int? workorderID { get; set; }
        public int? operationID { get; set; }
        public string includePartTypes { get; set; }
        public bool? withAlternateParts { get; set; }
        public string fromDate { get; set; }
        public string toDate { get; set; }
        public string fromTime { get; set; }
        public string toTime { get; set; }
        public int? packingSlipId { get; set; }
        public int? supplierPackingSlipId { get; set; }
        public int? packingSlipSerialNumber { get; set; }
        public string partIDs { get; set; }
        public string assyIDs { get; set; }
        public string mfgType { get; set; }
        public string addressType { get; set; }
        public string isDefaultAddress { get; set; }
    }
}
