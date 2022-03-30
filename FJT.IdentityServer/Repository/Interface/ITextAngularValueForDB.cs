using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository.Interface
{
    public interface ITextAngularValueForDB
    {
        public string SetTextAngularValueForDB(string content);
        public string GetTextAngularValueForDB(string content);
    }
}
