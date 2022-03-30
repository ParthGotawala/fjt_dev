namespace FJT.Reporting.Models
{
    public class CommonEmailModel
    {
        public string sentToEmail { get; set; }
        public string sentCCEmail { get; set; }
        public string sentBCCEmail { get; set; }
        public string reportName { get; set; }
        public string customerCompanyName { get; set; }
        public int? emailTemplete { get; set; }
        public int? refID { get; set; }
    }
}