using fjt.emailservice.BOEmail.Interface;
using fjt.emailservice.Handlers;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Unity;

namespace fjt.emailservice
{
    public partial class EmailServices : ServiceBase
    {

        public EmailServices()
        {
            InitializeComponent();
        }
        public void Start(string[] args)
        {
            OnStart(args);
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                IEmailApiRequestHandler emailConsumerHandler = UnityConfig.Container.Resolve<IEmailApiRequestHandler>();
                emailConsumerHandler.Process();
            }
            catch (Exception ex)
            {

            }
        }

        protected override void OnStop()
        {
            base.OnStop();
        }
    }
}
