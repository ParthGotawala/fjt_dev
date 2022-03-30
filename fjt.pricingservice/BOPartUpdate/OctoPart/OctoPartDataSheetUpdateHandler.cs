using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Linq;
using System.Threading;
using static fjt.pricingservice.Helper.Helper;

namespace fjt.pricingservice.BOPartUpdate.OctoPart
{
    public class OctoPartDataSheetUpdateHandler : IOctoPartDataSheetUpdateHandler
    {
        private readonly ICommonApiPricing _ICommonApiPricing;
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        private readonly Irfq_consolidated_mfgpn_lineitem_alternateRepository _Irfq_consolidated_mfgpn_lineitem_alternateRepository;
        private readonly IRabbitMQ _IRabbitMQ;
        public OctoPartDataSheetUpdateHandler(ICommonApiPricing ICommonApiPricing, IsystemconfigrationsRepository IsystemconfigrationsRepository, Irfq_consolidated_mfgpn_lineitem_alternateRepository
            Irfq_consolidated_mfgpn_lineitem_alternateRepository, IRabbitMQ IRabbitMQ)
        {
            _ICommonApiPricing = ICommonApiPricing;
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
            _Irfq_consolidated_mfgpn_lineitem_alternateRepository = Irfq_consolidated_mfgpn_lineitem_alternateRepository;
            _IRabbitMQ = IRabbitMQ;
        }

        public int UpdateInsertDataSheets(ExternalPartVerificationRequestLog Item)
        {
            var octopartConfiguration = _IsystemconfigrationsRepository.GetSystemConfigurations(UpdateComponentSupplier.OctoPart.GetEnumStringValue()).ToList();
            try
            {
                var OctoPartApiKey = octopartConfiguration.FirstOrDefault(x => x.key == ConfigKeys.OctoPartApiKey.GetEnumStringValue());
                return SaveDataSheetDetail(Item.partNumber, OctoPartApiKey.values, Item.partID);
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = PricingAPINames.OctoPart.GetEnumStringValue(),
                    supplier = PricingAPINames.OctoPart.GetEnumStringValue(),
                    mfgPN = Item.partNumber
                };
                _IRabbitMQ.SendRequest(objErrorLog);
            }
            return 1;
        }

        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : convert response into common object for save 
        /// </summary>
        /// <param name="mfgPartNumber">string</param>
        /// <param name="octoPartKey">string</param>
        private int SaveDataSheetDetail(string mfgPartNumber, string octoPartKey, int? partID)
        {
            try
            {
                var response = CallApiGetResponse(ConstantHelper.OctoPartURI, octoPartKey, mfgPartNumber);
                response =  JsonConvert.DeserializeObject(response);
                if(response ==null || response.results == null)
                {
                    return 1;
                }
                foreach (var item in response.results)
                {
                    if (item == null)
                        continue;
                    foreach (var octoParts in item.items)
                    {
                        string mfrPartNumber = Convert.ToString(octoParts.mpn);
                        if (octoParts == null || mfrPartNumber != mfgPartNumber || (octoParts!=null && octoParts.datasheets==null))
                            continue;
                        string mfrName = Convert.ToString(octoParts.manufacturer.name);
                        ManufacturerViewModel objMfg = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetManufacturerDetail(mfrName, ConstantHelper.MFG);
                        if (objMfg != null && objMfg.id > 0) {
                            var objComponent = _Irfq_consolidated_mfgpn_lineitem_alternateRepository.GetComponentDataFromMFGPN(objMfg.id, mfgPartNumber);
                            if (objComponent != null && objComponent.id > 0)
                            {   
                                foreach (var dataSheetLink in octoParts.datasheets)
                                {
                                    string url = Convert.ToString(dataSheetLink.url);
                                    _Irfq_consolidated_mfgpn_lineitem_alternateRepository.saveDataSheetLinks(objComponent.id, url);
                                }
                            }
                        }
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                ServiceErrorLog objErrorLog = new ServiceErrorLog()
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    Source = PricingAPINames.OctoPart.GetEnumStringValue(),
                    supplier = PricingAPINames.OctoPart.GetEnumStringValue(),
                    mfgPN = mfgPartNumber
                };
                //_IRabbitMQ.SendRequest(objErrorLog);
            }
            return 1;
        }


        /// <summary>
        /// Author  : Champak Chaudhary
        /// Purpose : call octo api and get data sheet link detail
        /// </summary>
        /// <param name="baseurl">octopart api url</param>
        /// <param name="apiKey">octopart api key</param>
        /// <param name="partnumber">mfgPartNumber </param>
        
        private dynamic CallApiGetResponse(string baseurl, string apiKey, string mfgPartNumber)
        {
            Thread.Sleep(ConstantHelper.defaultSleep); //400 ms as it take 1 sec for 3 request
            baseurl = string.Format(baseurl, apiKey, mfgPartNumber);
            var client = new RestClient(baseurl);
            var request = new RestRequest(Method.GET);
            request.AddHeader(ConstantHelper.CacheControl, ConstantHelper.NoCache);
            request.AddHeader(ConstantHelper.Content, ConstantHelper.ApplicationJson);
            var response = client.Execute(request).Content;
            return response;
        }
    }
}
