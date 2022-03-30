using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Models
{
    /// <summary>
    /// for Mapping data (Get data from Ui page.)
    /// </summary>
    public class ReportmasterVM
    {

        /* report id */
        public int id { get; set; }

        /* report Name */
        public string reportName { get; set; }

        /* report Title */
        public string reportTitle { get; set; }

        /* report GUID */
        public string fileName { get; set; }

        /* create new report or clone from existing report.(templateId(0) , reportId(1)).  */
        public int reportCreateType { get; set; }

        /* templateId - if new report with template. */
        public int? templateId { get; set; }

        /* refreportId - if clone report then reference reportId.  */
        public int? refReportId { get; set; }

        public bool isEndUserReport { get; set; }

        public string reportGenerationType { get; set; }        

        /* entityId - Customer,department,etc... */
        public int? entityId { get; set; }

        /* gencCategoryID */
        public int? gencCategoryID { get; set; }

        /* reportType - summary(0) detail(1).  */
        public int reportType { get; set; }

        /* userId - Logged in user Id. */
        public int userId { get; set; }

        /* userRoleId - Logged in user RoleId. */
        public int userRoleId { get; set; }

        public string additionalNotes { get; set; }

        public bool isDefaultReport { get; set; }
    }
}
