using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class MailScheduleModel
    {
        public int id { get; set; }
        public int? reportID { get; set; }
        public string entity { get; set; }
        public int? customerID { get; set; }
        public int schedule { get; set; }
        public DateTime? lastEmailSendDate { get; set; }
        public string reportName { get; set; }
        public string customerName { get; set; }
        public bool withAlternateParts { get; set; }
        public string reportAPI { get; set; }
        public bool isExcel { get; set; }
        public int? emailTemplete { get; set; }
        public int? isCompany { get; set; }

    }
}
