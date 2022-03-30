using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Repository.Interface
{
    public interface IObsoletePartReportRepository : IRepository<SystemConfigrations>
    {
        ObsolatePartDet GetObsolatePartDetails(ObsoletePartRequestModel obsoletePartRequestModel);
        ObsolatePartDet GetObsolatePartCSVDetails(ObsoletePartRequestModel obsoletePartRequestModel);

        ReversalPartDet GetReversalPartDetails(ReversalPartRequestModel reversalPartRequestModel, string APIProjectURL);
        ObsolatePartDet GetRohsPartDetails(int pmfgPnId, int pLineItemID, string radioFilterValue);
        ObsolatePartDet GetAlternatePartDetails(int pmfgPnId, int pLineItemID, string radioFilterValue);
        ObsolatePartDet GetAssemblyManualPartDetail(int partID);

        /// <summary>
        /// Get Obsolete Part Details For Company
        /// </summary>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns></returns>
        ObsoletePartDetForCompany GetObsoletePartDetailsForCompany(ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest, string APIProjectURL);
    }
}
