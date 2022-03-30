using FJT.Reporting.ViewModels;

namespace FJT.Reporting.Service.Interface
{
    public interface IRFQService
    {
        QuoteSummaryDet GetQuoteSummaryDetails(QuoteSummaryModel quoteSummaryModel, string APIProjectURL);
        QuoteIsSubjectToFollowingDet GetQuoteisSubjectToFollowingDetails(QuoteSummaryModel quoteSummaryModel);
        byte[] QuoteSummaryReportBytes(QuoteSummaryDet QuoteSummaryDet, QuoteIsSubjectToFollowingDet quoteIsSubjectToFollowingDet, bool showAvailableStock, string companyCode, bool isCustomPartDetShowInReport, int format);
    }
}
