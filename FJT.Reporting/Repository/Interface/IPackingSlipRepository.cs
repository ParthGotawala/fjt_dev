using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Repository.Interface
{
    public interface IPackingSlipRepository : IRepository<SystemConfigrations>
    {
        SupplierPerformanceDetail GetSupplierPerformanceDetails(SupplierPerformanceRequestModel supplierPerformanceRequestModel, string APIProjectURL);
        PartnerPerformanceDetail GetPartnerPerformanceDetails(PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel, string APIProjectURL);
        DebitMemoReportDet GetDebitMemoDetails(DebitMemoRequestModel debitMemoRequestModel);
        CheckPrintAndRemittanceReportDetail GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel);
    }
}
