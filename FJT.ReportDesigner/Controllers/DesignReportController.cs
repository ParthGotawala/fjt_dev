using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FJT.ReportDesigner.AppSettings;
using FJT.ReportDesigner.Enums;
using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Models;
using FJT.ReportDesigner.MySqlDBModel;
using FJT.ReportDesigner.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stimulsoft.Report;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Mvc;
using static FJT.ReportDesigner.Helper.ConstantHelper;

namespace FJT.ReportDesigner.Controllers
{
    [DeveloperAuthorizationAttribute]
    public class DesignReportController : BaseController
    {
        private readonly IDynamicMessageService _dynamicMessageService;
        private readonly ILogger<DesignerController> _logger;

        static DesignReportController()
        {
            /* Activate Stimulsoft Report */
            Stimulsoft.Base.StiLicense.LoadFromFile("license.key");
        }
        public DesignReportController(FJTSqlDBContext fjtSqlDBContext, IOptions<ConstantPath> constantPath, IDynamicMessageService dynamicMessageService, ILogger<DesignerController> logger) : base(fjtSqlDBContext, constantPath)
        {
            _constantPath = constantPath.Value;
            _dynamicMessageService = dynamicMessageService;
            _logger = logger;
        }

        /// <summary>
        /// Main Method(Entry Point For Designer). Index View Contain Stimulsoft report like DesignerEvent,GetReport,SaveREport etc..
        /// </summary>
        /// <param name="id">Report GUID</param>
        /// <returns></returns>
        public IActionResult SystemGeneratedReport()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">REPORT GUID</param>
        /// <returns></returns>
        public async Task<IActionResult> GetReport()
        {
            try
            {
                /* Create the report object */
                var report = new StiReport();
                return await StiNetCoreDesigner.GetReportResultAsync(this, report);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
                return View("Error", new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message });
            }
        }

        /// <summary>
        /// DesignerEvent - Stimulsoft Report.
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> DesignerEvent()
        {
            return await StiNetCoreDesigner.DesignerEventResultAsync(this);
        }

        /// <summary>
        /// Preview Report.
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> PreviewReport()
        {
            StiReport report = StiNetCoreDesigner.GetActionReportObject(this);
            return await StiNetCoreDesigner.PreviewReportResultAsync(this, report);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> SaveReport()
        {
            return await StiNetCoreDesigner.SaveReportResultAsync(this);
        }

        public async Task<IActionResult> Error()
        {
            var somethingWrongMSG = await _dynamicMessageService.Get(SOMTHING_WRONG);
            return View(new ErrorViewModel { StatusCode = (int)APIStatusCode.INTERNAL_SERVER_ERROR, Message = somethingWrongMSG.message });
        }

    }
}