using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class QuoteIsSubjectToFollowingDet
    {
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> ExcessMaterialDetails { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> UnquotedItemDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> CustomerConsignedDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> QuoteObsoletePartDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> LongLeadTimeDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> LongLeadTimeCustomPartDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> LowStockAlertDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> UnquotedLaborDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> PartLOADetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> BOMIssueDetail { get; set; }
        public virtual ICollection<QuoteIsSubjectToFollowingCommonModel> CustomerApprovalCommentDetail { get; set; }
    }
}