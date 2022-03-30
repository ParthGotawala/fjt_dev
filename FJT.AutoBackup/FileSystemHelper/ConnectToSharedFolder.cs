using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Net;

namespace FJT.AutoBackup.FileSystemHelper
{
    public class ConnectToSharedFolder : IDisposable
    {
        readonly string _networkName;
        public ConnectToSharedFolder(string networkName, NetworkCredential credentials)
        {
            //networkName = @"\\192.168.1.102\FJTBackup";
            _networkName = networkName;

            var netResource = new NetResource
            {
                Scope = ResourceScope.GlobalNetwork,
                ResourceType = ResourceType.Disk,
                DisplayType = ResourceDisplaytype.Directory,
                RemoteName = networkName // network shared path
            };

            var userName = string.IsNullOrEmpty(credentials.Domain)
                ? credentials.UserName
                : string.Format(@"{0}\{1}", credentials.Domain, credentials.UserName);

            var result = WNetAddConnection2(
                netResource,
                credentials.Password,
                userName,
                0); // If the connection fails because of an invalid password and the CONNECT_INTERACTIVE value is set in the dwFlags parameter, the function displays a dialog box asking the user to type the password.


            if (result != 0)
            {
                throw new Win32Exception(result, "Error connecting to network Drive.");
            }
        }

        ~ConnectToSharedFolder()
        {
            Dispose(false);
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            WNetCancelConnection2(_networkName, 0, true);
        }
        [DllImport("mpr.dll")]
        private static extern int WNetAddConnection2(NetResource netResource, string password, string username, int flags);

        [DllImport("mpr.dll")]
        private static extern int WNetCancelConnection2(string name, int flags, bool force);

        [StructLayout(LayoutKind.Sequential)]
        public class NetResource
        {
            public ResourceScope Scope;
            public ResourceType ResourceType;
            public ResourceDisplaytype DisplayType;
            public int Usage;
            public string LocalName;
            public string RemoteName;
            public string Comment;
            public string Provider;
        };
        public enum ResourceScope : int
        {
            Connected = 1, //Current connections to network resources.
            GlobalNetwork, // All network resources. These may or may not be connected.
            Remembered,
            Recent,
            Context // The network resources associated with the user's current and default network context. The meaning of this is provider-specific.
        };
        public enum ResourceType : int
        {
            Any = 0, // The resource matches more than one type, for example, a container of both print and disk resources, or a resource which is neither print or disk.
            Disk = 1, // The resource is a shared disk volume.
            Print = 2, // The resource is a shared printer.
            Reserved = 8,
        };
        public enum ResourceDisplaytype : int
        {
            Generic = 0x0, // The resource type is unspecified. This value is used by network providers that do not specify resource types.
            Domain = 0x01, // The resource is a collection of servers.
            Server = 0x02, // The resource is a server.
            Share = 0x03, // The resource is a share point.
            File = 0x04,
            Group = 0x05,
            Network = 0x06, // The resource is a network provider.
            Root = 0x07,
            Shareadmin = 0x08,
            Directory = 0x09, // The resource is a directory.
            Tree = 0x0a,
            Ndscontainer = 0x0b
        };
    }
}
