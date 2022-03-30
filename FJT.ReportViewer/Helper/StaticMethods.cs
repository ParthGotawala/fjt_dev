using Microsoft.AspNetCore.Mvc;
using Stimulsoft.Report;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Helper
{
    public static class StaticMethods
    {
        /// <summary>
        /// Generates the JWT.
        /// </summary>
        /// <param name="instance">The Enum instance.</param>
        /// <returns>Enum Display string value</returns>
        public static string GetDisplayValue(this Enum instance)
        {
            var fieldInfo = instance.GetType().GetMember(instance.ToString()).Single();
            var descriptionAttributes = fieldInfo.GetCustomAttributes(typeof(DisplayAttribute), false) as DisplayAttribute[];
            if (descriptionAttributes == null) return instance.ToString();
            return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].GetName() : instance.ToString();
        }
        public static DateTime GetUtcDateTime()
        {
            return DateTime.UtcNow;
        }
    }
}
