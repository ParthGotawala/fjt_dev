using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.Model
{
    public class GenericFileDetail
    {
        public string gencFileOwnerType { get; set; }
        public string gencFileName { get; set; }
        public long fileSize { get; set; }
        public string gencOriginalName { get; set; }
        public string roleID { get; set; }
        public string tags { get; set; }
        public string fileGroupBy { get; set; }
        public string imagePath { get; set; }
        public string documentType { get; set; }
        public int assyID { get; set; }
        public int createdBy { get; set; }
        public int createdByRoleId { get; set; }
        public string folderName { get; set; }
        public string entityID { get; set; }
        public string gencFileExtension { get; set; }
        public string activityUUID { get; set; }


    }
}
