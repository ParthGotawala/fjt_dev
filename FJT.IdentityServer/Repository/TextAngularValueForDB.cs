using FJT.IdentityServer.Appsettings;
using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Repository
{
    public class TextAngularValueForDB : ITextAngularValueForDB
    {
        private readonly IFJTIdentityDbContext _fjtIdentityDbContext;
        private readonly PageURLs _pageURLs;
        private string textAngularAPIKeyCode = string.Empty;
        private string textAngularWebKeyCode = string.Empty;

        public TextAngularValueForDB(IFJTIdentityDbContext fjtIdentityDbContext, IOptions<PageURLs> pageURLs)
        {
            _fjtIdentityDbContext = fjtIdentityDbContext;
            _pageURLs = pageURLs.Value;
        }

        public void SetKeyCode()
        {
            var value = _fjtIdentityDbContext.Systemconfigrations.Where(x => x.key == "TextAngularKeyCode" && x.isDeleted == false).Select(x => x.values).FirstOrDefault();
            JObject json = JObject.Parse(value);
            textAngularAPIKeyCode = json.GetValue("textAngularAPIKeyCode").ToString();
            textAngularWebKeyCode = json.GetValue("textAngularWebKeyCode").ToString();
        }

        public string SetTextAngularValueForDB(string content)
        {
            if(string.IsNullOrEmpty(textAngularAPIKeyCode) || string.IsNullOrEmpty(textAngularWebKeyCode))
            {
                SetKeyCode();
            }
            return content.Replace(_pageURLs.ApiURL, textAngularAPIKeyCode).Replace(_pageURLs.UIURL, textAngularWebKeyCode);
        }

        public string GetTextAngularValueForDB(string content)
        {
            if (string.IsNullOrEmpty(textAngularAPIKeyCode) || string.IsNullOrEmpty(textAngularWebKeyCode))
            {
                SetKeyCode();
            }
            return content.Replace(textAngularAPIKeyCode, _pageURLs.ApiURL).Replace(textAngularWebKeyCode, _pageURLs.UIURL);
        }

    }
}
