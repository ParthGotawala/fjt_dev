namespace fjt.pricingservice.Model
{
    public class RFQAssyQuantityModel
    {
        public int id { get; set; }
        public int rfqAssyID { get; set; }
        public int requestQty { get; set; }
        public int? rfqpricegroupID { get; set; }
        public int? consolidateID { get; set; }
        public bool isQtyDetail { get; set; }
    }
}
