using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_lineitem_autopricingstatus")]
    public partial class rfq_lineitem_autopricingstatus
    {
        [Key]
        public int id { get; set; }
        public int rfqAssyID { get; set; }
        public int consolidateID { get; set; }
        public string pricingApiName { get; set; }
        public int? status { get; set; }
        public string msg { get; set; }
        public string errorMsg { get; set; }
        public int userID { get; set; }
        public DateTime statusChangeDate { get; set; }
        public bool isPurchaseApi { get; set; }
        public int? pricingSupplierID { get; set; }
        //public virtual rfq_consolidated_mfgpn_lineitem rfq_consolidated_mfgpn_lineitem { get; set; }

    }
}
