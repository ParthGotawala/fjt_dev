using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service.Interface
{
    public interface ISupplierRMAService
    {
        SupplierRMAReportDet GetSupplierRMAReportDetails(SupplierRMARequestModel supplierRMARequestModel);
        byte[] SupplierRMAReportBytes(SupplierRMAReportDet SupplierRMAReportDet, SupplierRMARequestModel supplierRMARequestModel);
    }
}