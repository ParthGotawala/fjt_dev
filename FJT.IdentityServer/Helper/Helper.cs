using FJT.IdentityServer.Repository;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http.Formatting;
using System.Security.Cryptography;
using System.Threading.Tasks;
using static FJT.IdentityServer.Helper.Constant;

namespace FJT.IdentityServer.Helper
{
    public static class Helper
    {
        private static Random random = new Random();
        public static string GenerateClientSecret()
        {
            //  const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var hmac = new HMACSHA256();
            var key = Convert.ToBase64String(hmac.Key);
            return key;
            //return new string(Enumerable.Repeat(chars, 6)
            //  .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static string GetFormatedString(string PlainText, string FormatedStrignFor)
        {
            if (!string.IsNullOrEmpty(PlainText) && !string.IsNullOrEmpty(FormatedStrignFor))
            {
                int StartingPosition = 0;
                int EndPosition = PlainText.Length;

                switch (FormatedStrignFor)
                {
                    case "Email":
                        StartingPosition = 4;
                        EndPosition = (PlainText.Length - StartingPosition);
                        break;
                    case "Phone":
                        StartingPosition = 0;
                        EndPosition = (PlainText.Length - StartingPosition) - 3;
                        break;
                }

                string substring = PlainText.Substring(StartingPosition, EndPosition);
                string starString = new String('*', substring.Length);
                return PlainText.Replace(substring, starString);
            }
            return string.Empty;
        }

        public static MediaTypeFormatter GetFormatter(Uri requestUri, System.Web.Http.HttpConfiguration Configuration)
        {
            var requestUriString = Convert.ToString(requestUri);
            if (requestUriString.Contains("format=xml"))
                return Configuration.Formatters.XmlFormatter;
            else
                return Configuration.Formatters.JsonFormatter;
        }
        public static string GetMediaType( Uri requestUri)
        {
            var requestUriString = Convert.ToString(requestUri);
            if (requestUriString.Contains("format=xml"))
                return "application/xml";
            else
                return "application/json";
        }
        public static string GetDisplayValue(this Enum instance)
        {
            var fieldInfo = instance.GetType().GetMember(instance.ToString()).Single();
            var descriptionAttributes = fieldInfo.GetCustomAttributes(typeof(DisplayAttribute), false) as DisplayAttribute[];
            if (descriptionAttributes == null) return instance.ToString();
            return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].GetName() : instance.ToString();
        }
        public static DateTime GetDateTime()
        {
            return DateTime.UtcNow;
        }
    }
}
