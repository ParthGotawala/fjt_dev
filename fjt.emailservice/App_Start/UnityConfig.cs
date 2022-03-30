using fjt.emailservice.BOEmail;
using fjt.emailservice.BOEmail.Interface;
using fjt.emailservice.BOEmail.Mailgun;
using fjt.emailservice.BOEmail.Smtp;
using fjt.emailservice.Handlers;
using fjt.emailservice.Handlers.Interfaces;
using System;
using System.Reflection;
using Unity;
using Unity.RegistrationByConvention;
using static fjt.emailservice.Utility.Helper;

namespace fjt.emailservice
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
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            // container.RegisterType<IProductRepository, ProductRepository>();

            container.RegisterTypes(AllClasses.FromAssemblies(
              Assembly.GetAssembly(typeof(IEmailApiRequestHandler))
                 ), WithMappings.FromMatchingInterface, WithName.Default, WithLifetime.PerThread);
            container.RegisterType<ICommonApiEmail, MailgunEmailRequest>(EmailAPINames.Mailgun.ToString());
            container.RegisterType<ICommonApiEmail, SmtpEmailRequest>(EmailAPINames.Smtp.ToString());
            container.RegisterType<IErrorLog, ErrorLog>();
        }
    }
}