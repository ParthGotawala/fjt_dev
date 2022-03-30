using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.AutoBackup.Email_Service
{
    public class ResponseResult
    {
        public string status { get; set; }
        public string errors { get; set; }
        public string userMessage { get; set; }
    }
}
