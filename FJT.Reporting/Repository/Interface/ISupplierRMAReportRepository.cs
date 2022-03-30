using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Linq;
using System.Web;


namespace FJT.Reporting.Repository.Interface
{
    public interface ISupplierRMAReportRepository : IRepository<SystemConfigrations>
    {
        SupplierRMAReportDet GetSupplierRMAReportDetails(SupplierRMARequestModel supplierRMARequestModel);
    }
}