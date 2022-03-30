using FJT.IdentityServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository.Interface
{
    public interface IEmailService
    {
        public void SendEmail(SendEmailModel model);
    }
}
