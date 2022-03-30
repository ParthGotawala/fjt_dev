using System;
using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using System.Collections;

namespace FJT.Reporting.BusinessLogic
{
    public class WorkOrderReport : IWorkOrderReport
    {
        private readonly IWorkOrderReportRepository _iWorkOrderReportRepository;
        public WorkOrderReport(IWorkOrderReportRepository iWorkOrderReportRepository)
        {
            _iWorkOrderReportRepository = iWorkOrderReportRepository;
        }
        
       
    }
}