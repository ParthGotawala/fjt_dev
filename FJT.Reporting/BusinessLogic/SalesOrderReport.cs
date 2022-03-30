using System;
using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using System.Collections;

namespace FJT.Reporting.BusinessLogic
{
    public class SalesOrderReport : ISalesOrderReport
    {
        private readonly ISalesOrderReportRepository _iSalesOrderReportRepository;
        public SalesOrderReport(ISalesOrderReportRepository iSalesOrderReportRepository)
        {
            _iSalesOrderReportRepository = iSalesOrderReportRepository;
        }
        
       
    }
}