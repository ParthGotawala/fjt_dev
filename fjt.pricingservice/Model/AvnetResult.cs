namespace fjt.pricingservice.Model
{
    public class AvnetResult
    {
        public dynamic ApiResult { get; set; }
        public long AssemblyId { get; set; }
        public long PartNoId { get; set; }
        public long consolidateID { get; set; }
        public bool IsTokenExpired { get; set; }
        public bool IsRateLimitExceeded { get; set; }
    }
}
