using fjt.pricingservice.PricingApiAuthentication.Interface;
using fjt.pricingservice.Repository.Interface;
using System.Net;

namespace fjt.pricingservice.PricingApiAuthentication
{
    public class DigikeyApiAuthentication: IDigikeyApiAuthentication
    {
        //private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        public DigikeyApiAuthentication(IsystemconfigrationsRepository IsystemconfigrationsRepository)
        {
          //  _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
        }
        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : it will create connection and get token for digikey if not already
        /// </summary>
        public void CreateConnection()
        {
            //to enable protocol for call digikey api
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | SecurityProtocolType.Ssl3; 
            //string apiName = PricingAPINames.DigiKey.GetEnumStringValue();
            //var digiKeyConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(apiName);

            //if (digiKeyConfiguration.Count > 0)
            //{
            //    var AccessToken = digiKeyConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AccessToken.GetEnumStringValue());
            //    var code = digiKeyConfiguration.FirstOrDefault(x => x.key == ConfigKeys.DigiKeyCode.GetEnumStringValue());
            //    if (AccessToken == null && code!=null)
            //    {
            //        string DigiKeyCode = code.values;
            //        string DigiKeyClientId = digiKeyConfiguration.Where(x => x.key == ConfigKeys.DigiKeyClientID.GetEnumStringValue()).Select(x => x.values).FirstOrDefault();
            //        string DigiKeySecretKey = digiKeyConfiguration.Where(x => x.key == ConfigKeys.DigiKeySecretID.GetEnumStringValue()).Select(x => x.values).FirstOrDefault();
            //        var ObjRefreshToken = digiKeyConfiguration.FirstOrDefault(x => x.key == ConfigKeys.RefreshToken.GetEnumStringValue());
            //        var ObjAccessToken = digiKeyConfiguration.FirstOrDefault(x => x.key == ConfigKeys.AccessToken.GetEnumStringValue());

            //        var client = new RestClient(DigikeyAuthenticationURL);
            //        var request = new RestRequest(Method.POST);
            //        request.AddHeader(Helper.ConstantHelper.CacheControl, Helper.ConstantHelper.NoCache);
            //        request.AddHeader(Helper.ConstantHelper.Content, RequestFormat);
            //        request.AddParameter(RequestFormat, string.Format(Helper.ConstantHelper.DigiKeyURI, DigiKeyCode, DigiKeyClientId, DigiKeySecretKey, RedirectUri, GrantType), ParameterType.RequestBody);
            //        var data = client.Execute(request).Content;
            //        dynamic response = JsonConvert.DeserializeObject<dynamic>(data);
            //        if (response != null && response.access_token != null && response.refresh_token != null)
            //        {
            //            //update refresh token value
            //            ObjRefreshToken.values = response.refresh_token;
            //            ObjRefreshToken.updatedBy = Helper.ConstantHelper.UpdatedBy;
            //            ObjRefreshToken.updatedAt = GetCurrentDate();

            //            //update access token value
            //            ObjAccessToken.values = response.access_token;
            //            ObjAccessToken.updatedBy = Helper.ConstantHelper.UpdatedBy;
            //            ObjAccessToken.updatedAt = GetCurrentDate();

            //            _IsystemconfigrationsRepository.Update(ObjRefreshToken);
            //            _IsystemconfigrationsRepository.Update(ObjAccessToken);

            //            _IsystemconfigrationsRepository.Commit();
            //        }
            //    }
            //}
        }
    }
}
