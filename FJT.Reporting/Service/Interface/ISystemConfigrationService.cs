using FJT.Reporting.Models;
using System.Collections.Generic;

namespace FJT.Reporting.Service.Interface
{
    public interface ISystemConfigrationService
    {
        List<SystemConfigrations> GetSystemConfigrationList();
    }
}
