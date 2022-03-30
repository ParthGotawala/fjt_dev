using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class QuoteSummaryDet
    {
        public virtual ICollection<RFQ_Assy_Quote_Submitted_Assydetail> QuoteDetails { get; set; }
        public virtual ICollection<RFQ_Assembly_Detail> AssyDetail { get; set; }
        public virtual ICollection<RFQ_Assemblies_Quotation_Submitted> RevisedQuoteDetail { get; set; }
        public virtual ICollection<RFQ_Summary_StandardClass> StandardClass { get; set; }
        public virtual ICollection<RFQSelectedTermsAndConditions> RFQSelectedTermsAndConditions { get; set; }
        public virtual ICollection<RFQ_Assemblies_Quotation_Submitted> LastSubmitedQuote { get; set; }
        public virtual ICollection<RFQ_Assy_Quote_Custom_Part_Detail> CustomPartDetails { get; set; }
        public virtual ICollection<RFQ_Assy_Quote_NRE_Details> NREDetails { get; set; }
        public virtual ICollection<RFQ_Assy_Quote_Tooling_Details> ToolingDetails { get; set; }
        public virtual ICollection<Company_Detail> CompanyDetails { get; set; }
        public virtual ICollection<RFQ_Price_Group_Detail> rfqPriceGroupDetail { get; set; }
    }
}