using fjt.pricingservice.BOPartUpdate;
using fjt.pricingservice.BOPartUpdate.Arrow;
using fjt.pricingservice.BOPartUpdate.Avnet;
using fjt.pricingservice.BOPartUpdate.DigiKey;
using fjt.pricingservice.BOPartUpdate.Heilind;
using fjt.pricingservice.BOPartUpdate.Mouser;
using fjt.pricingservice.BOPartUpdate.Newark;
using fjt.pricingservice.BOPartUpdate.OctoPart;
using fjt.pricingservice.BOPartUpdate.TTI;
using fjt.pricingservice.BOPricing;
using fjt.pricingservice.BOPricing.Arrow;
using fjt.pricingservice.BOPricing.Avnet;
using fjt.pricingservice.BOPricing.DigiKeyV3;
using fjt.pricingservice.BOPricing.Heilind;
using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.BOPricing.Mouser;
using fjt.pricingservice.BOPricing.Newark;
using fjt.pricingservice.BOPricing.TTI;
using fjt.pricingservice.ErrorLog.Interface;
using fjt.pricingservice.Handlers;
using fjt.pricingservice.Handlers.Interfaces;
using fjt.pricingservice.Helper;
using fjt.pricingservice.MongoDBModel;
using fjt.pricingservice.MongoDBModel.Interface;
using fjt.pricingservice.PricingApiAuthentication;
using fjt.pricingservice.PricingApiAuthentication.Interface;
using fjt.pricingservice.Repository;
using fjt.pricingservice.Repository.Interface;
using System;
using System.Reflection;
using Unity;
using Unity.RegistrationByConvention;
using static fjt.pricingservice.Helper.Helper;


namespace fjt.pricingservice
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterTypes(AllClasses.FromAssemblies(
              Assembly.GetAssembly(typeof(IDigikeyV3ApiRequestHandler)),
              Assembly.GetAssembly(typeof(Irfq_assy_quantityRepository))
                 ), WithMappings.FromMatchingInterface, WithName.Default, WithLifetime.PerThread);
            container.RegisterType<IDBContext, FJTMongoDBContext>();
            container.RegisterType<IDigikeyPricingRepository, DigikeyPricingRepository>();
            container.RegisterType<IDigikeyApiAuthentication, DigikeyApiAuthentication>();
            container.RegisterType<ICommonApiPricing, CommonApiPricing>();
            container.RegisterType<IMouserPartHandler, MouserPartUpdateHandler>(ConstantHelper.MouserSOAPAPI);
            container.RegisterType<IMouserPartHandler, MouserJSONPartUpdateHandler>(ConstantHelper.MouserJSONAPI);
            container.RegisterType<INewarkPartHandler, NewarkPartUpdateHandler>();
            container.RegisterType<IAvnetPartHandler, AvnetPartHandler>();
            container.RegisterType<IArrowPartUpdateHandler, ArrowPartUpdateHandler>();
            container.RegisterType<ITTIPartUpdateHandler, TTIPartUpdateHandler>();
            container.RegisterType<IDigiKeySchedulePartUpdateHandler, DigiKeySchedulePartUpdateHandler>();
            container.RegisterType<IHeilindPartUpdateHandler, HeilindPartUpdateHandler>();
            container.RegisterType<IPartPictureRequestHandler, PartPictureRequestHandler>();
            #region Pricing Api class region
            container.RegisterType<IPricingRequest, DigikeyPricingRequestV3>(PricingAPINames.DigiKeyV3.ToString());
            container.RegisterType<IPricingRequest, MouserPricingRequest>(ConstantHelper.MouserSOAPAPI);
            container.RegisterType<IPricingRequest, MouserJSONPricingRequest>(ConstantHelper.MouserJSONAPI);
            container.RegisterType<IPricingRequest, NewarkPricingRequest>(PricingAPINames.Newark.ToString());
            container.RegisterType<IPricingRequest, ArrowPricingRequest>(PricingAPINames.Arrow.ToString());
            container.RegisterType<IPricingRequest, AvnetPricingRequest>(PricingAPINames.Avnet.ToString());
            container.RegisterType<IPricingRequest, TTIPricingRequest>(PricingAPINames.TTI.ToString());
            container.RegisterType<IPricingRequest, HeilindPricingRequest>(PricingAPINames.Heilind.ToString());
            container.RegisterType<IErrorLogRequestHandler, ErrorLogRequestHandler>();
            container.RegisterType<IErrorLog, ErrorLog.ErrorLog>();
            container.RegisterType<IBOSendPricingMail, BOSendPricingMail>();
            container.RegisterType<IOctoPartRequestHandler, OctopartRequestHandler>();
            container.RegisterType<IOctoPartDataSheetUpdateHandler, OctoPartDataSheetUpdateHandler>();
            #endregion
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
        }
    }
}