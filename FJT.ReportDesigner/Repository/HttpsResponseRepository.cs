using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Repository
{
    public class HttpsResponseRepository : IHttpsResponseRepository
    {
        private readonly IDynamicMessageService _dynamicMessageService;
        public HttpsResponseRepository(IDynamicMessageService dynamicMessageService)
        {
            _dynamicMessageService = dynamicMessageService;
        }

        public OkObjectResult ReturnResult(APIStatusCode apiStatusCode, APIState apiState, object Data, UserMessage userMessage)
        {
            ApiResponse response = new ApiResponse()
            {
                apiStatusCode = apiStatusCode,
                status = apiState.GetDisplayValue(),
                data = Data,
                userMessage = userMessage
            };
            return new OkObjectResult(response);
        }

        public async Task<OkObjectResult> ReturnExceptionResponse(Exception e)
        {
            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
            ApiResponse response = new ApiResponse()
            {
                apiStatusCode = APIStatusCode.ERROR,
                status = APIState.FAILED.GetDisplayValue(),
                userMessage = new UserMessage { messageContent = new MessageContent { messageType = somethingWrongMSG.messageType, messageCode = somethingWrongMSG.messageCode, message = somethingWrongMSG.message, err = new ErrorVM { message = e.Message, stack = e.StackTrace } } }
            };
            return new OkObjectResult(response);
        }
    }

    public class ApiResponse
    {
        public APIStatusCode apiStatusCode { get; set; }
        public string status { get; set; }
        public UserMessage userMessage { get; set; }
        public object data { get; set; }
    }

    public class UserMessage
    {
        public string message { get; set; }
        public MessageContent messageContent { get; set; }
    }

    public class MessageContent
    {
        public string message { get; set; }
        public string messageCode { get; set; }
        public string messageType { get; set; }
        public ErrorVM err { get; set; }
    }

    public class ErrorVM
    {
        public string message { get; set; }
        public string stack { get; set; }
    }
}
