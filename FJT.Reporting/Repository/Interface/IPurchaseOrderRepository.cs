using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Repository.Interface
{
    public interface IPurchaseOrderRepository : IRepository<SystemConfigrations>
    {
        PurchaseOrderReportDet GetPurchaseOrderDetails(PurchaseOrderRequestModel purchaseOrderRequestModel);
        IEnumerable GetPurchaseOrderDetSubDetails(int poDetID, PurchaseOrderRequestModel PurchaseOrderRequestModel);
        IEnumerable GetPurchaseOrderOtherChargesSubDetails(int poDetID);
        IEnumerable GetPurchaseOrdeRequirementSubDetails(int poDetID);
    }
}