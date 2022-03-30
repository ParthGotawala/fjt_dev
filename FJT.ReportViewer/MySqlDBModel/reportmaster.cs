using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    public class reportmaster
    {
        //public reportmaster()
        //{
        //    report_change_logs = new HashSet<report_change_logs>();
        //    reportviewerparameter = new HashSet<reportviewerparameter>();
        //}

        [Key]
        public int id { get; set; }

        [StringLength(255)]
        public string reportName { get; set; }

        [StringLength(255)]
        public string rdlcReportFileName { get; set; }

        [StringLength(255)]
        public string reportTitle { get; set; }

        public int? customerID { get; set; }

        public int? partID { get; set; }

        public int? companyID { get; set; }

        public int? fromDate { get; set; }

        public int? toDate { get; set; }

        public string logicalExpression { get; set; }

        public bool isDeleted { get; set; }        

        public DateTime createdAt { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        public DateTime? updatedAt { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        public DateTime? deletedAt { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public int? withAlternateParts { get; set; }

        public int? customerSelectType { get; set; }

        public int? partSelectType { get; set; }

        public int? employeeID { get; set; }

        public int? employeeSelectType { get; set; }

        public int? supplierID { get; set; }

        public int? supplierSelectType { get; set; }

        public int? mfgCodeID { get; set; }

        public int? mfgCodeSelectType { get; set; }

        public int? assyID { get; set; }

        public int? assySelectType { get; set; }

        public int? mountingTypeID { get; set; }

        public int? mountingTypeSelectType { get; set; }

        public int? functionalTypeID { get; set; }

        public int? functionalTypeSelectType { get; set; }

        public int? partStatusID { get; set; }

        public int? partStatusSelectType { get; set; }

        public int? workorderID { get; set; }

        public int? workorderSelectType { get; set; }

        public int? operationID { get; set; }

        public int? operationSelectType { get; set; }

        public int? reportCategoryId { get; set; }

        public bool? reportViewType { get; set; }

        [StringLength(200)]
        public string reportAPI { get; set; }

        public bool? isExcel { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }

        public int? emailTemplete { get; set; }

        public int? fromTime { get; set; }

        public int? toTime { get; set; }

        [StringLength(255)]
        public string fileName { get; set; }

        public bool? isEndUserReport { get; set; }

        [StringLength(255)]
        public string draftFileName { get; set; }

        public int? radioButtonFilter { get; set; }

        public string additionalNotes { get; set; }

        public bool isCSVReport { get; set; }

        public string csvReportAPI { get; set; }

        public int? refReportId { get; set; }

        [StringLength(1)]
        public string status { get; set; }

        public int? entityId { get; set; }

        public int? editingBy { get; set; }

        public DateTime? startDesigningDate { get; set; }

        public string reportGenerationType { get; set; }

        [StringLength(255)]
        public string reportVersion { get; set; }

        public bool isDefaultReport { get; set; }

        [ForeignKey("entityId")]
        public virtual entity entity { get; set; }

        [ForeignKey("reportCategoryId")]
        public virtual genericcategory genericcategory { get; set; }

        //public virtual ICollection<report_change_logs> report_change_logs { get; set; }
        //public virtual ICollection<reportviewerparameter> reportviewerparameter { get; set; }
    }
}
