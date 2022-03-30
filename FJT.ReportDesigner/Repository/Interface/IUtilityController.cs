using FJT.ReportDesigner.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.Repository.Interface
{
    public interface IUtilityController
    {
        public ResponseModel CheckStatusOfReportFile(string fileName, bool isEndUserReport, string reportGenerationType);
        public Task<ResponseModel> GetReportByteData(string fileName, bool isEndUserReport, string reportGenerationType);
    }
}
