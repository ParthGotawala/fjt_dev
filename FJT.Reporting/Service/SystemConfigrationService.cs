using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service
{
    public class SystemConfigrationService : ISystemConfigrationService
    {
        private readonly ISystemConfigrationRepository _iSystemConfigrationsRepository;

        public SystemConfigrationService(ISystemConfigrationRepository iSystemConfigrationsRepository)
        {
            _iSystemConfigrationsRepository = iSystemConfigrationsRepository;
        }

        public List<SystemConfigrations> GetSystemConfigrationList()
        {
            return _iSystemConfigrationsRepository.All().ToList();
        }
    }
}