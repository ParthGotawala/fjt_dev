using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;

namespace FJT.Reporting.Repository.Interface
{
    public interface IWorkOrderReportRepository : IRepository<SystemConfigrations>
    {
        WorkOrderReportDet GetWorkOrderDetails(WorkOrderRequestModel workOrderRequestModel);
    }
}