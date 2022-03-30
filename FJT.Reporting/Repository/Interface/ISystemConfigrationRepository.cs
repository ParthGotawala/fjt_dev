using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;

namespace FJT.Reporting.Repository.Interface
{
    public interface ISystemConfigrationRepository : IRepository<SystemConfigrations>
    {
        QuoteSummaryDet GetQuoteSummaryDetails(QuoteSummaryModel quoteSummaryModel, string aPIProjectURL);
        QuoteIsSubjectToFollowingDet GetQuoteisSubjectToFollowingDetails(QuoteSummaryModel quoteSummaryModel);
    }
}
