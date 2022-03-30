using FJT.IdentityServer.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Helper
{
    public class WhereClause
    {
        public static string GenerateWhereClause(List<SearchColumn> SearchColumns)
        {
            string whereClause = string.Empty;
            foreach (var item in SearchColumns)
            {
                if(item.ColumnDataType != null)
                {
                    if (item.ColumnDataType == Enums.SearchDataType.StringEquals.ToString())
                    {
                        whereClause += string.Format("and `{0}` = '{1}' ", item.ColumnName, item.SearchString);
                    }
                    else if (item.ColumnDataType == Enums.SearchDataType.Number.ToString())
                    {
                        int? value = null;
                        if (!string.IsNullOrEmpty(item.SearchString))
                            value = int.Parse(item.SearchString);
                        whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, value);
                    }

                    else if (item.ColumnDataType == Enums.SearchDataType.DateTime.ToString())
                    {
                        if (!string.IsNullOrEmpty(item.SearchString))
                        {
                            try
                            {
                                DateTime? value = Convert.ToDateTime(item.SearchString);
                                whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, value.ToString());
                            }
                            catch
                            {
                                whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, null);
                            }
                        }
                        else
                        {
                            whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, null);
                        }
                    }
                    else if (item.ColumnDataType == Enums.SearchDataType.Date.ToString())
                    {
                        if (!string.IsNullOrEmpty(item.SearchString))
                        {
                            try
                            {
                                DateTime? value = Convert.ToDateTime(item.SearchString);
                                whereClause += string.Format("and cast({0} as date) = cast('{1}' as date)", item.ColumnName, value);
                            }
                            catch
                            {
                                whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, "null");
                            }
                        }
                        else
                        {
                            whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, "null");
                        }
                    }

                    else if (item.ColumnDataType == Enums.SearchDataType.Decimal.ToString())
                    {
                        decimal? value = null;
                        if (!string.IsNullOrEmpty(item.SearchString))
                            value = decimal.Parse(item.SearchString);
                        whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, value);
                    }
                    else if (item.ColumnDataType == Enums.SearchDataType.LongNumber.ToString())
                    {
                        long? value = null;
                        if (!string.IsNullOrEmpty(item.SearchString))
                            value = long.Parse(item.SearchString);
                        whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, value);
                    }
                    else if (item.ColumnDataType == Enums.SearchDataType.Boolean.ToString())
                    {
                        int? value = null;
                        if (!string.IsNullOrEmpty(item.SearchString))
                            value = int.Parse(item.SearchString);
                        whereClause += string.Format("and `{0}` = {1} ", item.ColumnName, value);
                    }
                    else
                    {
                        /* Enums.SearchDataType.StringContains */
                        whereClause += string.Format("and `{0}` like '%{1}%' ", item.ColumnName, item.SearchString);
                    }
                }
                else
                {
                    whereClause += string.Format("and `{0}` like '%{1}%' ", item.ColumnName, item.SearchString);
                }
            }
            return whereClause;
        }
    }
}
