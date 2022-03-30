using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class ResponseVM
    {
        public string status { get; set; }
        public object data { get; set; }
        public UserMessageVM userMessage { get; set; }
        public string  message { get; set; }

    }

    public class UserMessageVM
    {
        public string message { get; set; }
        public string messageCode { get; set; }
        public string messageType { get; set; }
    }
}
