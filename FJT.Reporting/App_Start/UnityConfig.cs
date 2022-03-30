using FJT.Reporting.BusinessLogic;
using FJT.Reporting.BusinessLogic.Interface;
using FJT.Reporting.Repository;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.Service;
using FJT.Reporting.Service.Interface;
using System;
using System.Reflection;
using System.Web.Http;
using Unity;
using Unity.RegistrationByConvention;
using Unity.WebApi;

namespace FJT.Reporting
{
    public static class UnityConfig
    {
        private static Lazy<IUnityContainer> container =
         new Lazy<IUnityContainer>(() =>
         {
             var container = new UnityContainer();
             RegisterComponents(container);
             return container;
         });

        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        public static void RegisterComponents(UnityContainer container)
        {
            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();
            container.RegisterTypes(AllClasses.FromAssemblies(
              Assembly.GetAssembly(typeof(ISystemConfigrationService)),
              Assembly.GetAssembly(typeof(ISystemConfigrationRepository)),
              Assembly.GetAssembly(typeof(IAgreementRepository))
                 ), WithMappings.FromMatchingInterface, WithName.Default, WithLifetime.PerResolve);
            container.RegisterType<ISystemConfigrationService, SystemConfigrationService>();
            container.RegisterType<ISystemConfigrationRepository, SystemConfigrationRepository>();
            container.RegisterType<IAgreementRepository, AgreementRepository>();
            container.RegisterType<IErrorLog, ErrorLog>();

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}