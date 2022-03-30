namespace fjt.pricingservice.Model
{
    public class NewarkResult
    {
        public dynamic resultParts { get; set; }
        public long assemblyId { get; set; }
        public long partNoId { get; set; }
        public long consolidateID { get; set; }
        public bool isSendRequestResponse { get; set; }
    }
}
