using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Utility.Models
{
    public class DatasheetComponentModel
    {
        public int id { get; set; }
        public string datasheetName { get; set; }
        public string datasheetURL { get; set; }
        public string documentPath { get; set; }
        public int refComponentID { get; set; }
        public string mfgPN { get; set; }
    }
}
