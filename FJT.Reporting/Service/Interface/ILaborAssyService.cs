using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service.Interface
{
    public interface ILaborAssyService
    {
        List<LaborAssyDetailModel> GetLaborAssyDetail(LaborAssyRequestModel laborRequestModel, string APIProjectURL);
        byte[] LaborAssyReportBytes(List<LaborAssyDetailModel> laborAssytDet);
        LaborComparisonEsimatedvsActualDetail GetLaborComparisonEstimatedvsActualDetail(LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel, string APIProjectURL);
        byte[] GetLaborComparisonEstimatedvsActualDetailReportBytes(LaborComparisonEsimatedvsActualDetail laborComparisonEsimatedvsActualDetail, LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel);
    }
}