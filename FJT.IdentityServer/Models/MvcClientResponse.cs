using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    public class MvcClientResponse
    {
        public Response response { get; set; }
    }

    public class Response
    {
        public string apiStatus { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public object data { get; set; }
    }
}
