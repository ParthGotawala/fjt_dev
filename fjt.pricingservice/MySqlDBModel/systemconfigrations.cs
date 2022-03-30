namespace fjt.pricingservice.MySqlDBModel
{
    public class systemconfigrations
    {
        public string key { get; set; }

        public string values { get; set; }
        public string clusterName { get; set; }
        public bool? isEncrypted { get; set; }
        public bool? isActive { get; set; }
    }
}
