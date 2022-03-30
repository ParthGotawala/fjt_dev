using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ObsoletePartRequestModel : CommonEmailModel
    {
        public string customerID { get; set; }
        public string whereClause { get; set; }
        public string DateFormat { get; set; }
        public string DateTimeFormat { get; set; }
        public bool withAlternateParts { get; set; }
        public bool isObsolete { get; set; }
        public int selectedRadioButtonValue { get; set; }
        public string selectedRadioButtonName { get; set; }
        public string assyID { get; set; }

    }
}