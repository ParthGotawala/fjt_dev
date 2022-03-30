using System;

namespace FJT.Reporting.ViewModels
{
    public class CustomerPackingSlipMstResponse
    {
        public int? id { get; set; }
        public int? partId { get; set; }
        public string PackingSlip { get; set; }

        public string SalesOrderNumber { get; set; }
        public string PONumber { get; set; }
        public DateTime? PackingSlipDate { get; set; }
        public string ShippingMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string IntermediateAddress { get; set; }
        public string SoldToAddress { get; set; }
        public string FOB { get; set; }
        public string Customer { get; set; }
        public string SalesOrderPersonName { get; set; }
        public string Headername { get; set; }
        public DateTime? PODate { get; set; }
        public DateTime? SODate { get; set; }
        public string SORevision { get; set; }
        public string DepartmentName { get; set; }
        public string ManagerName { get; set; }
        public string PaymentMethod { get; set; }
        public string preparedBy { get; set; }
        public string emailAddress { get; set; }
        public string phExtension { get; set; }
        public int? status { get; set; }
        public int? packingSlipType { get; set; }
        public string packingSlipComment { get; set; }
        public string packingSlipVersion { get; set; }
        public string docNumber { get; set; }
        public string legalNumber { get; set; }
        public string blanketPOText { get; set; }
        public string carrier { get; set; }
    }
}