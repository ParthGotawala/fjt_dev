using FJT.ReportDesigner.AppSettings;
using FJT.ReportDesigner.MySqlDBModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FJT.ReportDesigner.Helper;
using FJT.ReportDesigner.Models;
using FJT.ReportDesigner.Enums;
using Microsoft.Extensions.Logging;

namespace FJT.ReportDesigner.Controllers
{
    public class BaseController : Controller
    {
        protected readonly FJTSqlDBContext _FJTSqlDBContext;
        protected ConstantPath _constantPath;

        public BaseController(FJTSqlDBContext fjtSqlDBContext, IOptions<ConstantPath> constantPath)
        {
            _FJTSqlDBContext = fjtSqlDBContext;
            _constantPath = constantPath.Value;
        }
        protected string GetUserId()
        {
            try
            {
                var userid = string.Empty;
                var identityUserId = HttpContext.User.Claims.Count() != 0 ? HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value : null;
                if (identityUserId != null)
                {
                    userid = _FJTSqlDBContext.users.Where(x => x.IdentityUserId == identityUserId).Select(x => x.id).FirstOrDefault().ToString();
                }
                return userid;
            }
            catch
            {
                return string.Empty;
            }
        }
        protected string GetUserNameById(int? id)
        {
            var user = _FJTSqlDBContext.users.Find(id);
            return user != null ? user.username : string.Empty;
        }
    }
}
