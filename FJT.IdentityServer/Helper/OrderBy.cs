using FJT.IdentityServer.Models.ViewModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Helper
{
    public class OrderBy
    {
        public static string GenerateOrderBy(List<string[]> sortColumns)
        {
            //string orderBy = "`agreementType` ASC";
            string orderBy = string.Empty;

            var applyComa = false;
            foreach (var item in sortColumns)
            {
                if (applyComa == true)
                {
                    orderBy += ",";
                }

                orderBy += string.Format(" `{0}` {1}", item[0], item[1]);
                applyComa = true;
            }

            return orderBy;
        }
    }
}
