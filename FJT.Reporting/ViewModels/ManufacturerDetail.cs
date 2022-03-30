using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class ManufacturerDetail
    {
        public virtual ICollection<ManufacturerDetailResponse> ManufacturerDetailResponse { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
        //public DateTime FromDate { get; set; }
        //public DateTime ToDate { get; set; }
    }
}