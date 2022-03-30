using FJT.Reporting.ViewModels;
using System;
using System.Collections;

namespace FJT.Reporting.Service.Interface
{
   public interface ISalesOrderReportService
    {
        SalesOrderReportDet GetSalesOrderReportDetDetails(SalesOrderRequestModel salesOrderRequestModel);
        IEnumerable GetSalesOrderShippingReportDetDetails(int sDetID, SalesOrderRequestModel salesOrderRequestModel);
        byte[] SalesOrderReportBytes(SalesOrderReportDet SalesOrderReportDet,SalesOrderRequestModel salesOrderRequestModel);
    }
}
