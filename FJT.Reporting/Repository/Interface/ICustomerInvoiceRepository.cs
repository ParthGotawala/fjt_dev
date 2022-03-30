using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Repository.Interface
{
    public interface ICustomerInvoiceRepository : IRepository<SystemConfigrations>
    {
        CustomerInvoiceReportDet GetCustomerInvoiceDetails(CustomerInvoiceRequestModel customerInvoiceRequestModel);
        IEnumerable GetCustomerInvoiceOtherChargesSubDetails(int refDetID);
        CustomerInvoiceReportDet GetCustomerInvoiceUMIDSubDetail(int refDetID, int partId);
    }
}