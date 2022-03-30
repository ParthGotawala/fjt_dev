using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service.Interface
{
    public interface IPurchaseOrderReportService
    {
        PurchaseOrderReportDet GetPurchaseOrderDetails(PurchaseOrderRequestModel purchaseOrderRequestModel);
        IEnumerable GetPurchaseOrderDetSubDetails(int poDetID, PurchaseOrderRequestModel PurchaseOrderRequestModel);
        byte[] PurchaseOrderReportBytes(PurchaseOrderReportDet PurchaseOrderReportDet, PurchaseOrderRequestModel purchaseOrderRequestModel);
    }
}