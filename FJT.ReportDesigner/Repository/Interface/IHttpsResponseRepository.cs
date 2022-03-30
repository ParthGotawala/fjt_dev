using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Repository.Interface
{
    public interface IHttpsResponseRepository
    {
        OkObjectResult ReturnResult(APIStatusCode apiStatusCode, APIState apiState, object Data, UserMessage Message);
        Task<OkObjectResult> ReturnExceptionResponse(Exception e);
    }
}
