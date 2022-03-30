using FJT.Reporting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Repository.Interface
{
    public interface IEmail_SchedulemstRepository:IRepository<email_schedulemst>
    {
        void updateEmailSchedule(int refID);
    }
}