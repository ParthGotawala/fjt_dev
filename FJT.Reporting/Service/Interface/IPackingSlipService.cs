using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Service.Interface
{
  public  interface IPackingSlipService
    {
        SupplierPerformanceDetail GetSupplierPerformanceDetails(SupplierPerformanceRequestModel supplierPerformanceRequestModel, string APIProjectURL);
        PartnerPerformanceDetail GetPartnerPerformanceDetails(PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel, string APIProjectURL);
        byte[] GetSupplierPerformanceReportBytes(SupplierPerformanceDetail SupplierPerformanceDetail, SupplierPerformanceRequestModel supplierPerformanceRequestModel);
        byte[] GetPartnerPerformanceReportBytes(PartnerPerformanceDetail PartnerPerformanceDetail, PartnerPerformanceRequestViewModel partnerPerformanceRequestViewModel);
        DebitMemoReportDet GetDebitMemoDetails(DebitMemoRequestModel debitMemoRequestModel);
        byte[] GetDebitMemoReportBytes(DebitMemoReportDet debitMemoDetail);

        CheckPrintAndRemittanceReportDetail GetCheckPrintAndRemittancePaymentDetails(CheckPrintAndRemittanceRequestModel checkPrintAndRemittanceRequestModel);
        byte[] GetCheckPrintAndRemittanceReportBytes(CheckPrintAndRemittanceReportDetail checkPrintAndRemittanceReportDetail, bool isRemittanceReport);
    }
}
