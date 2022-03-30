
using System;
using System.ServiceProcess;
using System.Threading;


namespace fjt.pricingservice
{
    static class Program
    {
        public static PricingServices Service;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            Service = new PricingServices();
            ServiceBase[] ServicesToRun;
            if (!Environment.UserInteractive)
            {
                ServicesToRun = new ServiceBase[]
                {
                    new PricingServices()
                };
                ServiceBase.Run(ServicesToRun);
            }
            else
            {
                Service.Start(args);
                //Console.ReadLine();
                Thread.Sleep(Timeout.Infinite);
                Service.Stop();
            }
        }
    }
}
