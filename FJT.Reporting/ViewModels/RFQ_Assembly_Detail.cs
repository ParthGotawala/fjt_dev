using System;

namespace FJT.Reporting.ViewModels
{
    public class RFQ_Assembly_Detail
    {
        public int? rfqAssyID { get; set; }
        public int? partID { get; set; }
        public int? quoteID { get; set; }
        public string PIDCode { get; set; }
        public string nickName { get; set; }
        public string liveInternalVersion { get; set; }
        public string mfgPNDescription { get; set; }
        public string mfgPN { get; set; }
        public string rev { get; set; }
        public string assyCode { get; set; }
        public string custAssyPN { get; set; }
        public string mfgName { get; set; }
        public string mfgCode { get; set; }
        public int? customerid { get; set; }
        public int? custBillingAddressID { get; set; }
        public int? custTermsID { get; set; }
        public int? custShippingAddressID { get; set; }
        public string BOMIssues { get; set; }
        public string bomInternalVersion { get; set; }
        public DateTime quoteSubmitDate { get; set; }
        public string quoteNumber { get; set; }
        public int? quoteSubmittedID { get; set; }
        public string assyNote { get; set; }
        public string additionalRequirement { get; set; }
        public string quoteNote { get; set; }
        public string RFQType { get; set; }
        public string JobType { get; set; }
        public string AssyType { get; set; }
        public string billingAddress { get; set; }
        public string shippingAddress { get; set; }
        public string standards { get; set; }
        public string paymentTerm { get; set; }
        public string OtherNotes { get; set; }
        public int? isSummaryComplete { get; set; }
        public string submittedBy { get; set; }
        public string emailAddress { get; set; }
        public int? quoteFinalStatus { get; set; }
        public int? RoHSStatusID { get; set; }
        public string rohsComplientConvertedValue { get; set; }
        public string rohsIconPath { get; set; }

    }
}