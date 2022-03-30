using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service.Interface
{
    public interface ICustomerInvoiceService
    {
        CustomerInvoiceReportDet GetCustomerInvoiceDetails(CustomerInvoiceRequestModel customerInvoiceRequestModel);
        byte[] CustomerInvoiceReportBytes(CustomerInvoiceReportDet CustomerInvoiceReportDet, CustomerInvoiceRequestModel customerInvoiceRequestModel);
        CustomerInvoiceReportDet GetCustomerInvoiceUMIDSubDetail(int refDetID, int partId);
    }
}