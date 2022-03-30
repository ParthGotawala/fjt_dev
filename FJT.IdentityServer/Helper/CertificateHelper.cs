using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Helper
{
    public class CertificateHelper
    {
        public static X509Certificate2 LoadCertificateByThumbPrint(string thumbPrint)
        {
            thumbPrint = Regex.Replace(thumbPrint, @"[^\da-fA-F]", string.Empty).ToUpper();
            var storelocation = StoreLocation.LocalMachine;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT_STORELOCATION") == "CurrentUser")
            {
                storelocation = StoreLocation.CurrentUser;
            }

            using (X509Store computerCaStore = new X509Store(StoreName.My, storelocation))
            {
                computerCaStore.Open(OpenFlags.ReadOnly);
                var certificateCollection = computerCaStore.Certificates.Find(X509FindType.FindByThumbprint, thumbPrint, false);
                if (certificateCollection == null || certificateCollection.Count == 0)
                {
                    throw new Exception("SSL Certificate Not Found");
                }
                return certificateCollection[0];
            }

        }
    }
}
