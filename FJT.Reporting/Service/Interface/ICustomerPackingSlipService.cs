using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Service.Interface
{
    public interface ICustomerPackingSlipService
    {
        CustomerPackingSlipDetail GetCustomerPackingSlipDetail(CustomerPackingSlipRequestModel customerPackingSlipModel, string APIProjectURL);
        byte[] GetCustomerPackingSlipDetailReportBytes(CustomerPackingSlipDetail customerPackingSlipDetail, CustomerPackingSlipRequestModel customerPackingSlipListModel);
        CustomerPackingSlipDetail GetPackingSlipAssemblyReportDetails(int partID, int cpID);
        CustomerPackingSlipDetail GetCustomerPackingSlipUMIDSubDetail(int refCustomerPackingSlipDetID, int partId);
    }
}