using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;

namespace FJT.Reporting.Repository.Interface
{
    public interface ISalesOrderReportRepository : IRepository<SystemConfigrations>
    {
        SalesOrderReportDet GetSalesOrderDetails(SalesOrderRequestModel salesOrderRequestModel);
        IEnumerable GetSalesOrderSubDetails(int sDetID, SalesOrderRequestModel salesOrderRequestModel);
        IEnumerable GetSalesOrderOtherChargesSubDetails(int pSDetID);
    }
}