using FJT.Reporting.ViewModels;
using System;
using System.Collections;

namespace FJT.Reporting.Service.Interface
{
   public interface IWorkOrderReportService
    {
        WorkOrderReportDet GetWorkOrderReportDetDetails(WorkOrderRequestModel workOrderRequestModel);
        byte[] WorkOrderReportBytes(WorkOrderReportDet WorkOrderReportDet, WorkOrderRequestModel workOrderRequestModel);
    }
}
