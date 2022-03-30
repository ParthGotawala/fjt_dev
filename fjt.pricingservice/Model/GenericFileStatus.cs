using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class GenericFileStatus
    {
        public string gencFileName { get; set; }
        public string tags { get; set; }
        public string activityUUID { get; set; }
    }

    public class GenericFilePathStatus
    {
        public string gencFileOwnerType { get; set; }
        public string oldDocumentPath { get; set; }
        public string newDocumentPath { get; set; }
        public int? refTransID { get; set; }


    }
}

