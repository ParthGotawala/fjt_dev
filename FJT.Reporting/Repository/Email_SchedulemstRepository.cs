using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;

namespace FJT.Reporting.Repository
{
    public class Email_SchedulemstRepository : Repository<email_schedulemst>, IEmail_SchedulemstRepository
    {
        public Email_SchedulemstRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }


        public void updateEmailSchedule(int refID)
        {
            string query = string.Format("update  email_schedulemst set lastEmailSendDate=current_timestamp where id={0}", refID);
            this.Context.Database.ExecuteSqlCommand(query);
        }
    }
}