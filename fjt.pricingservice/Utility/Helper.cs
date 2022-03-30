using fjt.pricingservice.Utility;
using RabbitMQ.Client;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace fjt.pricingservice.Helper
{
    public static class Helper
    {
        public static IConnection connection = null;
        public static string MouserAPIName = "MouserJSONAPI";
        public static string DigikeyAuthenticationURL = "https://sso.digikey.com/as/token.oauth2";
        public static string DigikeyAuthenticationURLV3 = "https://api.digikey.com/v1/oauth2/token";
        public static string RequestFormat = "application/x-www-form-urlencoded";
        public static string RedirectUri = "https://www.digikey.in";
        public static string GrantType = "authorization_code";
        public static string KeywordSearchApi = "https://api.digikey.com/services/partsearch/v2/keywordsearch";
        public static string KeywordSearchApiV3 = "https://api.digikey.com/Search/v3/Products/Keyword";
        public static string KeywordPartSearch = "https://api.digikey.com/services/partsearch/v2/partdetails";
        public static string KeywordPartSearchV3 = "https://api.digikey.com/Search/v3/Products/{0}";
        public static string FJTApiUrl = Convert.ToString(ConfigurationManager.AppSettings["FJTAPIUrl"]);
        public static string ReportAPIUrl = Convert.ToString(ConfigurationManager.AppSettings["ReportAPIUrl"]);
        public enum CommonStatus
        {
            [StringValue("Unknown")]
            UNKNOWN,
            [StringValue("Yes")]
            YES,
            [StringValue("No")]
            NO,
            [StringValue("Y")]
            Y,
            [StringValue("N")]
            N
        }

        public enum AuthorizeSeller
        {
            [StringValue("Yes")]
            YES,
            [StringValue("No")]
            NO
        }
        public enum DKVersion
        {
            [StringValue("V2")]
            V2,
            [StringValue("V3")]
            V3
        }
        public enum PartStatus
        {
            [StringValue("YES")]
            YES,
            [StringValue("NO")]
            NO,
            [StringValue("Active")]
            Active,
            [StringValue("Inactive")]
            Inactive,
            [StringValue("Obsolete")]
            Obsolete
        }
        public enum ReelingValues
        {
            [StringValue("DigiKeyReelText")]
            DigiKeyReelText
        }
        public enum Currency
        {
            [StringValue("USD")]
            DefaultUSD
        }
        public enum SourceOfPricing
        {
            [StringValue("Excel")]
            ImportPricing,
            [StringValue("AutoPrice")]
            OctoPartPricingService,
            [StringValue("Manual")]
            ManualPricing,
            [StringValue("Mouser")]
            MouserPartPricingService,
            [StringValue("Newark")]
            NewarkPartPricingService,
            [StringValue("Arrow")]
            ArrowPricingService,
            [StringValue("DigiKey")]
            DigiKeyPricingService,
            [StringValue("Avnet")]
            AvnetPricingService,
            [StringValue("TTI")]
            TTIPricingService,
            [StringValue("AvnetAPI")]
            AvnetCSPAPIPricingService,
            [StringValue("Heilind")]
            HeilindPricingService,
        }
        public static string GetEnumStringValue(this Enum value)
        {
            // Get the type
            Type type = value.GetType();

            // Get fieldinfo for this type
            MemberInfo memberInfo = type.GetField(value.ToString());

            // Get the stringvalue attributes
            return memberInfo.GetCustomAttributes(true).Length > 0 ? ((StringValueAttribute)memberInfo.GetCustomAttributes(true)[0]).Value : null;
        }
        public enum unitOfTime
        {
            [StringValue("D")]
            Day,
            [StringValue("W")]
            Week
        }
        public enum PricingAPINames
        {
            [StringValue("DigiKey")]
            DigiKey,
            [StringValue("DigiKeyV3")]
            DigiKeyV3,
            [StringValue("Mouser")]
            Mouser,
            [StringValue("Newark")]
            Newark,
            [StringValue("Arrow")]
            Arrow,
            [StringValue("Avnet")]
            Avnet,
            [StringValue("TTI")]
            TTI,
            [StringValue("OctoPart")]
            OctoPart,
            [StringValue("Heilind")]
            Heilind,
        }
        public enum PricingSupplierID
        {
            DigiKey = -1,
            DigiKeyV3 = -1,
            Newark = -2,
            Mouser = -3,
            TTI = -4,
            Arrow = -5,
            Avnet = -6,
            Heilind =-12
        }

        public enum CleanType
        {
            [StringValue("BOM")]
            BOM,
            [StringValue("Part")]
            Part,
        }

        public enum ConfigKeys
        {
            [StringValue("DigiKeyClientID")]
            DigiKeyClientID,
            [StringValue("DigiKeySecretID")]
            DigiKeySecretID,
            [StringValue("DigiKeyCode")]
            DigiKeyCode,
            [StringValue("DigiKeyRefreshToken")]
            RefreshToken,
            [StringValue("DigiKeyAccessToken")]
            AccessToken,
            [StringValue("NewarkApiKey")]
            NewarkApiKey,
            [StringValue("MouserApiKey")]
            MouserApiKey,
            [StringValue("MouserAPIRequestsLimit")]
            MouserAPIRequestsLimit,
            [StringValue("ArrowLoginKey")]
            ArrowLoginKey,
            [StringValue("ArrowApiKey")]
            ArrowApiKey,
            [StringValue("AvnetStoreID")]
            AvnetStoreID,
            [StringValue("AvnetAuthToken")]
            AvnetAuthToken,
            [StringValue("AvnetWCToken")]
            AvnetWCToken,
            [StringValue("AvnetWCTrustedToken")]
            AvnetWCTrustedToken,
            [StringValue("AvnetAPIHostName")]
            AvnetAPIHostName,
            [StringValue("AvnetAPIPath")]
            AvnetAPIPath,
            [StringValue("AvnetSubscriptionKey")]
            AvnetSubscriptionKey,
            [StringValue("TTIAccessToken")]
            TTIAccessToken,
            [StringValue("TTIHeader")]
            TTIHeader,
            [StringValue(("DigiKeyCustomeID"))]
            DigiKeyCustomeID,
            [StringValue(("DigikeyRecordCount"))]
            DigikeyRecordCount,
            [StringValue(("ComponentUpdateTimeInHrs"))]
            ComponentUpdateTimeInHrs,
            [StringValue(("NewarkCustomerID"))]
            NewarkCustomerID,
            [StringValue("NewarkSecretKey")]
            NewarkSecretKey,
            [StringValue("NewarkAPIRequestsLimit")]
            NewarkAPIRequestsLimit,
            [StringValue("OctoPartApiKey")]
            OctoPartApiKey,
            [StringValue("HeilindPartnerName")]
            HeilindPartnerName,
            [StringValue("HeilindAccessToken")]
            HeilindAccessToken
        }
        public static DateTime GetCurrentDate()
        {
            return DateTime.UtcNow;
        }
        public static DateTime GetCurrentLocalDate()
        {
            return DateTime.Now;
        }
        public static string GetCurrentUTCDateString()
        {
            return DateTime.UtcNow.Date.ToString("MM/dd/yyyy");
        }
        public enum Status
        {
            SendRequest = 0,
            NotPricing = 1,
            Success = 2
        }
        public enum NewarkApiError
        {
            [StringValue("200003")]
            QueryKeyword,
            [StringValue("200001")]
            SKUNOtValid,
            [StringValue("200002")]
            KeywordNotValid,
            [StringValue("200002")]
            MfgNotValid,
        }
        public enum PricingSelectionSetting
        {
            NotApplied = 0,
            Highest = 1,
            Lowest = 2
        }
        public static HttpClient CreateHttpClient()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(FJTApiUrl);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            return client;
        }
        public static HttpClient CreateGetHttpClient()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(FJTApiUrl);
            return client;
        }

        public static HttpClient CreateHttpClientReport()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(ReportAPIUrl);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            return client;
        }
        public enum PriceStatus
        {
            [StringValue("Special")]
            Special,
            [StringValue("Standard")]
            Standard,
        }
        public enum UpdateComponentSupplier
        {
            [StringValue("DK")]
            DigiKey,
            [StringValue("MO")]
            Mouser,
            [StringValue("NW")]
            Newark,
            [StringValue("AR")]
            Arrow,
            [StringValue("AV")]
            Avnet,
            [StringValue("TTI")]
            TTI,
            [StringValue("HEILIND")]
            HEILIND,
            [StringValue("OctoPart")]
            OctoPart,
        }
        public enum EntityIDs
        {
            [StringValue("operations")]
            Operation = -1,

            [StringValue("component")]
            Component = -9
        }
        public static string Encode(string input, string key)
        {
            byte[] secretBytes = Encoding.UTF8.GetBytes(key);
            HMACSHA1 hmac = new HMACSHA1(secretBytes);

            byte[] dataBytes = Encoding.UTF8.GetBytes(input);
            byte[] calcHash = hmac.ComputeHash(dataBytes);
            string calcHashString = Convert.ToBase64String(calcHash);
            return calcHashString;
            //return calcHashString;
            //byte[] mykey = Encoding.ASCII.GetBytes(key);
            //HMACSHA1 myhmacsha1 = new HMACSHA1(mykey);
            //byte[] byteArray = Encoding.ASCII.GetBytes(input);
            //MemoryStream stream = new MemoryStream(byteArray);
            //return myhmacsha1.ComputeHash(stream).Aggregate("", (s, e) => s + string.Format("{0:x2}", e), s => s);
        }

        public enum aliasTable
        {
            [StringValue("rfq_mountingtypemst")]
            rfq_mountingtypemst,
            [StringValue("Uoms")]
            Uoms,
            [StringValue("rfq_parttypemst")]
            rfq_parttypemst,
            [StringValue("rfq_connectertypemst")]
            rfq_connectertypemst,
            [StringValue("rfq_rohsmst")]
            rfq_rohsmst,
            [StringValue("component_packagingmst")]
            component_packagingmst,
            [StringValue("component_partstatusmst")]
            component_partstatusmst,
            [StringValue("rfq_packagecasetypemst")]
            rfq_packagecasetypemst,

        }

        public enum ErrorType
        {
            [StringValue("MFGNOTADDED")]
            MFGNOTADDED,
            [StringValue("PARTINVALID")]
            PARTINVALID,
            [StringValue("AUTHFAILED")]
            AUTHFAILED,
            [StringValue("UNKNOWN")]
            UNKNOWN,
            [StringValue("MOUNTNOTADDED")]
            MOUNTNOTADDED,
            [StringValue("MOUNTINACTIVE")]
            MOUNTINACTIVE,
            [StringValue("UOMNOTADDED")]
            UOMNOTADDED,
            [StringValue("UOMINACTIVE")]
            UOMINACTIVE,
            [StringValue("UOMCLASSNOTADDED")]
            UOMCLASSNOTADDED,
            [StringValue("UOMCLASSINACTIVE")]
            UOMCLASSINACTIVE,
            [StringValue("PARTTYPENOTADDED")]
            PARTTYPENOTADDED,
            [StringValue("PARTTYPEINACTIVE")]
            PARTTYPEINACTIVE,
            [StringValue("ROHSNOTADDED")]
            ROHSNOTADDED,
            [StringValue("ROHSINACTIVE")]
            ROHSINACTIVE,
            [StringValue("CONNECTNOTADDED")]
            CONNECTNOTADDED,
            [StringValue("CONNECTINACTIVE")]
            CONNECTINACTIVE,
            [StringValue("PACKAGINGNOTADDED")]
            PACKAGINGNOTADDED,
            [StringValue("PACKAGINGINACTIVE")]
            PACKAGINGINACTIVE,
            [StringValue("CONTACTADMIN")]
            CONTACTADMIN,
            [StringValue("PARTSTATUSNOTADDED")]
            PARTSTATUSNOTADDED,
            [StringValue("PARTSTATUSINACTIVE")]
            PARTSTATUSINACTIVE,
        }
        public enum MailScheduleType
        {
            Daily = 1,
            Weekly = 2,
            Monthly = 3,
            SemiAnnually = 4,
            Quarterly = 5,
            Annually = 6
        }
        public static object CloneObject<T>(T objSource)
        {
            //step : 1 Get the type of source object and create a new instance of that type
            Type typeSource = objSource.GetType();
            object objTarget = Activator.CreateInstance(typeSource);

            //Step2 : Get all the properties of source object type
            PropertyInfo[] propertyInfo = typeof(T).GetProperties(); //typeSource.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

            //Step : 3 Assign all source property to taget object 's properties
            foreach (PropertyInfo property in propertyInfo)
            {
                if (property.CustomAttributes.Any(ca => ca.AttributeType == typeof(IgnorePropertyCompareAttribute)))
                    continue;

                //Check whether property can be written to
                if (property.CanWrite)
                {
                    //Step : 4  property type is object/complex types, so need to recursively call this method until the end of the tree is reached

                    object objPropertyValue = property.GetValue(objSource, null);
                    if (objPropertyValue == null)
                    {
                        property.SetValue(objTarget, null, null);
                    }
                    else
                    {
                        property.SetValue(objTarget, CloneObject(objPropertyValue), null);
                    }

                }
            }

            return objTarget;
        }
    }
}
