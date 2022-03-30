using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ManufacturerRequestModel : CommonEmailModel
    {
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
        public string loginUserEmployeeID { get; set; }

    }
}