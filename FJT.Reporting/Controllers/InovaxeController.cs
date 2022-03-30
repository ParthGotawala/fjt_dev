using FJT.Reporting.ViewModels;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FJT.Reporting.Controllers
{
    [RoutePrefix("api/Inovaxe")]
    public class InovaxeController : ApiController
    {

        [Route("setConfiguration")]
        [HttpPost]
        public HttpResponseMessage setConfiguration(InoAutoConfiguration InoAutoConfiguration)
        {
            //POST->http://<MateialTowerIP>:<MateialTowerPort>/rest/api/setConfiguration
            var client = new RestClient(string.Format("{0}rest/api/setConfiguration", Constant.Constant.InovaxeAPIUrl));
            var request = new RestRequest(Method.POST);
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", JsonConvert.SerializeObject(InoAutoConfiguration), ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            return this.Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("getInventory")]
        [HttpPost]
        public HttpResponseMessage getInventory(InventoryRequest InventoryRequest)
        {

            //Use this call To pull information about the current inventory from The InoAuto System.
            //POST->http://<MaterialTowerIP>:<MaterialTowerPort>/rest/api/getInventory
            var client = new RestClient(string.Format("{0}rest/api/getInventory", Constant.Constant.InovaxeAPIUrl));
            var request = new RestRequest(Method.POST);
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", JsonConvert.SerializeObject(InventoryRequest), ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            return this.Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("requestReel")]
        [HttpPost]
        public HttpResponseMessage requestReel(ReelRequest ReelRequest)
        {


            //When a reel UID is scanned into the InoAuto system, InoAuto requests information about the Reel
            //UID from the IP address registered in setconfiguration.
            //If the reel is not none to the external system the information will be prompted for.
            //POST->http://<PanaCIMIP>:<PanaCIMPort>/api/Storage/requestReel
            ReelRequestResponse response = new ReelRequestResponse();
            return this.Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("checkInNotification")]
        [HttpPost]
        //public HttpResponseMessage checkInNotification(CheckInNotificationRequest CheckInNotificationRequest)
        public HttpResponseMessage checkInNotification()
        {
            try
            {
                string result = Request.Content.ReadAsStringAsync().Result;
                // return result;
                //string jsonObject = JsonConvert.SerializeObject(CheckInNotificationRequest);
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "------------checkInNotification------------");
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, result);
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "\n1--------------");
                //InoAuto will send a notification whenever a reel is inserted into the system.
                //This function needs to be implemented by the external system.
                //POST->http://<PanaCIMIP>:<PanaCIMPort>/api/Storage/checkInNotification
            }
            catch (Exception e)
            {
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "------------checkInNotification------------");
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "\n error");
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, e.Message.ToString());
            }
            return this.Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("deliverNotification")]
        [HttpPost]
        public HttpResponseMessage deliverNotification(DeliverNotificationRequest DeliverNotificationRequest)
        {
            try
            {
                //Receive
                //InoAuto will send a notification whenever a reel is removed from the system.
                //This function needs to be implemented by the external system.
                //POST->http://<PanaCIMIP>:<PanaCIMPort>/api/Storage/deliverNotification
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "------------deliverNotification------------");
                string jsonObject = JsonConvert.SerializeObject(DeliverNotificationRequest);
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, jsonObject);
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "\n--------------");
            }
            catch (Exception e)
            {
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "------------deliverNotification------------");
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, "\nerror");
                File.AppendAllText(Constant.Constant.InovaxeAPIResponseFilePath, e.Message.ToString());
            }
            return this.Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("deliverMaterial")]
        [HttpPost]
        public HttpResponseMessage deliverMaterial(DeliverMaterialRequest DeliverMaterialRequest)
        {
            //Call to InAuto
            //Deliver a set of Packages based on their UID.
            //POST->http://<MateialTowerIP>:<MateialTowerPort>/rest/api/deliverMaterial
            DeliverMaterialResponse response = new DeliverMaterialResponse();
            return this.Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("deliverMaterialParts")]
        [HttpPost]
        public HttpResponseMessage deliverMaterialParts(DeliverMaterialPartsRequest DeliverMaterialPartsRequest)
        {
            //Call to InAuto
            //Deliver a set of Packages based on request part numbers.
            //POST->http://<MateialTowerIP>:<MateialTowerPort>/rest/api/deliverMaterialParts
            DeliverMaterialPartsResponse response = new DeliverMaterialPartsResponse();
            return this.Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("countedPackages")]
        [HttpPost]
        public HttpResponseMessage countedPackages(CountedPackagesRequest CountedPackagesRequest)
        {
            //Call to Cart
            // POST->http://<Cart IP Address>:<Cart Port>/rest/api/countedPackages
            DeliverMaterialPartsResponse response = new DeliverMaterialPartsResponse();
            return this.Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
