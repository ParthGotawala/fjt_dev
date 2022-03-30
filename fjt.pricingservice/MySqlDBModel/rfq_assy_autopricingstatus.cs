using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fjt.pricingservice.MySqlDBModel
{
    [Table("rfq_assy_autopricingstatus")]
    public partial class rfq_assy_autopricingstatus
    {
        [Key]
        public int id { get; set; }
        public int rfqAssyID { get; set; }
        public int? status { get; set; }
        public string pricingApiName { get; set; }
        public string msg { get; set; }
        public string errorMsg { get; set; }
        public string userID { get; set; }
        public DateTime statusChangeDate { get; set; }
        public int? pricingSupplierID { get; set; }
    }
}
