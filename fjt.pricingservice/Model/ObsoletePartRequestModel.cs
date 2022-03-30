using System;

namespace fjt.pricingservice.Model
{
    public class ObsoletePartRequestModel
    {
        public string customerID { get; set; }
        public string whereClause { get; set; }
        public string DateFormat { get; set; }
        public string DateTimeFormat { get; set; }
        public bool isObsolete { get; set; }
        public string sentToEmail { get; set; }
        public string sentCCEmail { get; set; }
        public string sentBCCEmail { get; set; }
        public int refID { get; set; }
        public string reportName { get; set; }
        public string customerCompanyName { get; set; }
        public bool withAlternateParts { get; set; }
        public int? emailTemplete { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
        public int? selectedRadioButtonValue { get; set; }
    }
}
