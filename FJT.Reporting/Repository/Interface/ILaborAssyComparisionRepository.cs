using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System.Collections.Generic;

namespace FJT.Reporting.Repository.Interface
{
    public interface ILaborAssyComparisionRepository : IRepository<SystemConfigrations>
    {
        List<LaborAssyDetailModel> GetLaborAssyDetail(LaborAssyRequestModel laborAssyRequestModel, string APIProjectURL);
        LaborComparisonEsimatedvsActualDetail GetLaborComparisonEstimatedvsActualDetail(LaborComparisonEstimatedvsActualRequestModel laborComparisonEstimatedvsActualRequestModel, string APIProjectURL);
    }
}