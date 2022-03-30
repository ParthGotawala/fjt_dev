using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.ViewModels
{
    public class CreditMemoResponseModel
    {
        public virtual ICollection<CreditMemoMst> CreditMemoMst { get; set; }
        public virtual ICollection<CreditMemoDet> CreditMemoDet { get; set; }
        public virtual ICollection<CreditMemoTotalCharges> CreditMemoTotalCharges { get; set; }
    }
}