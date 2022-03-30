using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CustomerPackingSlipDetail
    {
        public virtual ICollection<CustomerPackingSlipDetailResponse> CustomerPackingSlipDetailResponse { get; set; }
        public virtual ICollection<CustomerPackingSlipMstResponse> CustomerPackingSlipMstResponse { get; set; }
        public virtual ICollection<PackingSlipPartCommentList> PackingSlipPartCommentList { get; set; }
        public virtual ICollection<CustomerPackingSlipUMIDList> CustomerPackingSlipUMIDList { get; set; }
    }
}