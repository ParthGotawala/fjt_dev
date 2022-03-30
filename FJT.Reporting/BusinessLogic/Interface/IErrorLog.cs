using FJT.Reporting.Models;

namespace FJT.Reporting.BusinessLogic.Interface
{
    public interface IErrorLog
    {
        void sendErrorLog(ServiceLog ServiceLog);

        void SaveReportLog(string pStrLogText);
    }

}