using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FJT.ReportDesigner.Enums;
using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Models;
using FJT.ReportDesigner.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Controllers
{
    [AllowAnonymous]
    public class AuthorizeController : Controller
    {
        private readonly IDynamicMessageService _dynamicMessageService;
        public AuthorizeController(IDynamicMessageService dynamicMessageService)
        {
            _dynamicMessageService = dynamicMessageService;
        }

        public async Task<IActionResult> AccessDenied()
        {
            var accessDeniedMSG = await _dynamicMessageService.Get(POPUP_ACCESS_DENIED);
            return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.ACCESS_DENIED, Message = string.Format(accessDeniedMSG.message, REQUESTED) });
        }
        public async Task<IActionResult> NotFound()
        {
            var notFoundMSG = await _dynamicMessageService.Get(NOT_FOUND);
            return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.PAGE_NOT_FOUND, Message = string.Format(notFoundMSG.message, REQUESTED_PAGE) });
        }
        public IActionResult Error(ErrorViewModel errorViewModel)
        {
            return View("Error", errorViewModel);
        }
    }
}
