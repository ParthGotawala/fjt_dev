using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace fjt.emailservice
{
    static class Program
    {
        public static EmailServices Service;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
      public  static void Main(string[] args)
        {
            Service = new EmailServices();
            ServiceBase[] ServicesToRun;
            if (!Environment.UserInteractive)
            {
                ServicesToRun = new ServiceBase[]
                {
                    new EmailServices()
                };
                ServiceBase.Run(ServicesToRun);
            }
            else
            {
                Service.Start(args);
                Thread.Sleep(Timeout.Infinite);
                Service.Stop();
            }
        }
    }
}
