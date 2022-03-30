using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FJT.ReportViewer.Enums;
using FJT.ReportViewer.Helper;
using FJT.ReportViewer.Models;
using FJT.ReportViewer.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using static FJT.ReportViewer.Helper.ConstantHelper;

namespace FJT.ReportViewer.Controllers
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
        public IActionResult Error(ErrorViewModel errorViewModel)
        {
            return View("Error", errorViewModel);
        }
    }
}
