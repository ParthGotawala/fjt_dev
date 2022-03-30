using FJT.Reporting.ViewModels;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Service.Interface
{
    public interface IBaseService
    {
        void SetReportCommonParameters(ref ReportParameter[] pParams);
    }
}
