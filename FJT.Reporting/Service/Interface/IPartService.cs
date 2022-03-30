using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Service.Interface
{
    public interface IPartService
    {
        ObsolatePartDet GetObsolatePartDetails(ObsoletePartRequestModel obsoletePartRequestModel);
        ObsolatePartDet GetObsolatePartCSVDetails(ObsoletePartRequestModel obsoletePartRequestModel);
        PartUsageDetailMain GetPartUsageDetails(PartUsageRequestModel partUsageRequestModel);
        byte[] ObsolatePartReportBytes(ObsolatePartDet obsolatePartDet, ObsoletePartRequestModel obsoletePartRequestModel);
        byte[] GetPartUsageReportBytes(PartUsageDetailMain partUsageDetailMain);
        byte[] ObsolatePartCSVBytes(ObsolatePartDet obsolatePartDet, ObsoletePartRequestModel obsoletePartRequestModel);
        /// <summary>
        /// Get Reversal Part Details
        /// </summary>
        /// <param name="reversalPartRequestModel"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns>ReversalPartDet</returns>
        ReversalPartDet GetReversalPartDetails(ReversalPartRequestModel reversalPartRequestModel, string APIProjectURL);
        /// <summary>
        /// Reversal Part Report Bytes
        /// </summary>
        /// <param name="reversalPartDet"></param>
        /// <param name="reversalPartRequestModel"></param>
        /// <returns>byte[]</returns>
        byte[] ReversalPartReportBytes(ReversalPartDet reversalPartDet, ReversalPartRequestModel reversalPartRequestModel);
        /// <summary>
        /// Reversal Part CSV Bytes
        /// </summary>
        /// <param name="reversalPartDet"></param>
        /// <returns>byte[]</returns>
        byte[] ReversalPartCSVBytes(ReversalPartDet reversalPartDet);
        /// <summary>
        /// Obsolete Part Details for company owner
        /// </summary>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <param name="APIProjectURL"></param>
        /// <returns>ObsolatePartDetailForCompany</returns>
        ObsoletePartDetForCompany GetObsoletePartDetailsForCompany(ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest, string APIProjectURL);

        /// <summary>
        /// Obsolete Part details for Company CSV Bytes
        /// </summary>
        /// <param name="obsolatePartDetailForCompany"></param>
        /// <param name="obsoletePartForCompanyRequest"></param>
        /// <returns>byte[]</returns>
        byte[] GetObsoletePartDetailsForCompanyReportBytes(ObsoletePartDetForCompany obsolatePartDetailForCompany, ObsoletePartForCompanyRequestModel obsoletePartForCompanyRequest);
        /// <summary>
        /// Obsolete Part For Company CSV Bytes
        /// </summary>
        /// <param name="obsoletePartDet"></param>
        /// <returns>byte[]</returns>
        byte[] ObsoletePartForCompanyCSVBytes(ObsoletePartDetForCompany obsoletePartDet);
    }
}
