using Newtonsoft.Json;
using System;
using System.IO;
using System.Security.AccessControl;
using System.Threading;
using System.Web.Configuration;

namespace FJT.Scanner
{
    class Program
    {

        //static void Main(string[] args)
        //{
        //    ScanDetail scanDetail = new ScanDetail();
        //    string ScanDocuFilePath = WebConfigurationManager.AppSettings["ScanDocuFilePath"].ToString();
        //    try
        //    {
        //        int packingSlipID = 0;
        //        ScanRequestModel scanRequestModel = new ScanRequestModel();
        //        if (args.Length > 0)
        //        {
        //            string argsments = args[0];
        //            if (!string.IsNullOrEmpty(argsments))
        //            {
        //                scanRequestModel = JsonConvert.DeserializeObject<ScanRequestModel>(argsments);
        //            }
        //        }

        //        scanRequestModel.scanDocument = true;

        //        if (scanRequestModel.scanDocument)
        //        {
        //            File.AppendAllText(ScanDocuFilePath, string.Format("Execute console app: {0:MM/dd/yyyy hh:mm:ss}", DateTime.Now));
        //        }

        //        DeviceInfo device = new DeviceInfo();
        //        Console.Write("Enter 1 for Network and 2 for USB:");
        //        string connectionType = Console.ReadLine();
        //        switch (connectionType)
        //        {
        //            case "1":
        //                device.connectionType = InterfaceType.Network;
        //                device.nodeName = WebConfigurationManager.AppSettings["nodeName"];
        //                device.ipAddress = WebConfigurationManager.AppSettings["ipAddress"];
        //                Console.WriteLine("Connection: {0}, Node name: {1}, IPAddress: {2}", device.connectionType, device.nodeName, device.ipAddress);
        //                File.AppendAllText(ScanDocuFilePath, string.Format("Connection: {0}, Node name: {1}, IPAddress: {2} {3}", device.connectionType, device.nodeName, device.ipAddress, Environment.NewLine));
        //                break;
        //            default:
        //                device.connectionType = InterfaceType.Usb;
        //                device.modelName = WebConfigurationManager.AppSettings["modelName"];
        //                Console.WriteLine("Connection: {0}, Model name: {1}", device.connectionType, device.modelName);
        //                File.AppendAllText(ScanDocuFilePath, string.Format("Connection: {0}, Model name: {1} {2}", device.connectionType, device.modelName, Environment.NewLine));
        //                break;
        //        }


        //        using (var sdk = SDKWrapper.CreateInstance())
        //        {
        //            //var device = new DeviceInfo
        //            //{
        //            //    connectionType = InterfaceType.Usb,
        //            //    modelName = "Brother ADS-2800W",
        //            //    //nodeName = "BRN3C2AF49CED3F",
        //            //    //ipAddress = "192.168.1.141"
        //            //};

        //            //Console.WriteLine("Select device {0}", device.modelName);

        //            sdk.SelectDevice(device);
        //            //Console.WriteLine("Connected {0}", device.modelName);

        //            //File.AppendAllText(ScanDocuFilePath, string.Format("Connected: {0} {1}", device.modelName, Environment.NewLine));
        //            if (scanRequestModel.scanDocument)
        //            {
        //                var capabilities = sdk.QueryCapabilities();
        //                var parameters = sdk.GetScanParameter();
        //                //Console.WriteLine("GetScanParameter {0}", Environment.NewLine);
        //                //Console.ReadLine();
        //                //
        //                // Change parameter.
        //                //
        //                //if (capabilities.duplex)
        //                //{
        //                //    parameters.duplex = (DuplexType)Enum.Parse(typeof(DuplexType), scanRequestModel.scanSide, true);
        //                //}

        //                //parameters.colorType = (ColorType)Enum.Parse(typeof(ColorType), scanRequestModel.color, true);
        //                //parameters.scanArea.paperType = (PaperType)Enum.Parse(typeof(PaperType), scanRequestModel.size, true);
        //                //parameters.resolution = (Resolution)Enum.Parse(typeof(Resolution), scanRequestModel.resolution, true);

        //                Console.WriteLine("Resolution:");
        //                Console.WriteLine("5. 600 dpi");
        //                Console.WriteLine("6. 1200 dpi");
        //                Console.WriteLine("7. 2400 dpi");
        //                Console.WriteLine("8. 4800 dpi");
        //                Console.WriteLine("9. 9600 dpi");
        //                Console.WriteLine("10. 19200 dpi");


        //                Console.Write("Please enter resolution from above: ");
        //                string resolution = Console.ReadLine();

        //                ImageProcessing imageProcessingSkipPage = new ImageProcessing();
        //                imageProcessingSkipPage.execute = true;
        //                imageProcessingSkipPage.level = 0;

        //                parameters.skipBlankPage = imageProcessingSkipPage;


        //                parameters.duplex = DuplexType.DuplexLongBinding;
        //                parameters.colorType = ColorType.AutoColor;
        //                parameters.scanArea.paperType = PaperType.Letter;
        //                parameters.resolution = (Resolution)Enum.ToObject(typeof(Resolution), Convert.ToInt32(resolution)); //Resolution.reso600dpi;

        //                sdk.SetScanParameter(parameters);

        //                var fileParameter = sdk.GetFileParameter();
        //                fileParameter.fileType = FileType.Pdf;
        //                //fileParameter.folderPath = string.Format(@"{0}", WebConfigurationManager.AppSettings["ScanDocumentStoragePath"]);
        //                fileParameter.folderPath = string.Format(@"{0}", device.connectionType == InterfaceType.Network ? WebConfigurationManager.AppSettings["ScanDocumentNetworkPath"] : WebConfigurationManager.AppSettings["ScanDocumentUSBPath"]);
        //                fileParameter.filePrefix = !string.IsNullOrEmpty(scanRequestModel.filePrefix) ? scanRequestModel.filePrefix : string.Format("FJT_{0}_{1}", packingSlipID, DateTime.Now.ToString("MMddyyyyHHmmss"));
        //                sdk.SetFileParameter(fileParameter);

        //                //
        //                // Scan.
        //                //

        //                if (scanRequestModel.scanDocument)
        //                {
        //                    File.AppendAllText(ScanDocuFilePath, string.Format("Start Scan: {0:MM/dd/yyyy hh:mm:ss} {1}", DateTime.Now, Environment.NewLine));
        //                }

        //                Console.WriteLine("Start Scan: {0:MM/dd/yyyy hh:mm:ss}", DateTime.Now);
        //                sdk.ScanAsync();
        //                Console.WriteLine("Scanning ...");
        //                while (sdk.GetScanStatus() == ScanStatus.Scanning)
        //                {
        //                    //Console.Write("Checking Status: {0}", sdk.GetScanStatus());
        //                    Thread.Sleep(100);
        //                }
        //                var status = sdk.GetScanStatus();
        //                Console.WriteLine("Scan Completed: {0:MM/dd/yyyy hh:mm:ss}", DateTime.Now);

        //                if (status == ScanStatus.AllEnd || status == ScanStatus.Standby)
        //                {
        //                    var fileList = sdk.GetFileList();
        //                    foreach (var filePath in fileList)
        //                    {
        //                        scanDetail.FileName = Path.GetFileName(filePath);
        //                        Console.WriteLine("Document Prepared: {0:MM/dd/yyyy hh:mm:ss} {1} File: {2} {3}", DateTime.Now, Environment.NewLine, scanDetail.FileName, Environment.NewLine);
        //                        File.AppendAllText(ScanDocuFilePath, string.Format("Document Prepared: {0:MM/dd/yyyy hh:mm:ss} {1} File: {2} {3}", DateTime.Now, Environment.NewLine, scanDetail.FileName, Environment.NewLine));
        //                        //FileAttributes attributes = File.GetAttributes(filePath);
        //                        //File.SetAttributes(filePath, File.GetAttributes(filePath) | FileAttributes.ReadOnly);
        //                        //AddFileSecurity(filePath, @"Flex214\Administrator", FileSystemRights.ReadData, AccessControlType.Allow);
        //                        //AddFileSecurity(filePath, @"Flex214\IIS_IUSRS", FileSystemRights.ReadData, AccessControlType.Allow);
        //                        //AddFileSecurity(filePath, @"Everyone", FileSystemRights.FullControl, AccessControlType.Allow);
        //                        //AddFileSecurity(filePath, @"Flex214\Flex214", FileSystemRights.ReadData, AccessControlType.Allow);
        //                    }
        //                }
        //                else
        //                {
        //                    scanDetail.Error = sdk.GetScanError().ToString();
        //                }


        //            }
        //        }
        //    }
        //    catch (SDKException ex)
        //    {
        //        Console.WriteLine("Select device {0} exception {1}", ex.InnerException.Message, ex._error);
        
            //        scanDetail.Error = ex._error.ToString();
        //    }
        //    Console.Write(JsonConvert.SerializeObject(scanDetail));
        //    File.AppendAllText(ScanDocuFilePath, string.Format("Completed: {0} {1}", JsonConvert.SerializeObject(scanDetail), Environment.NewLine));
        //    Console.ReadLine();
        //}

        static void Main(string[] args)
        {
            ScanDetail scanDetail = new ScanDetail();
            string ScanDocuFilePath = WebConfigurationManager.AppSettings["ScanDocuFilePath"].ToString();
            try
            {
                //int refTransID = 0;
                ScanRequestModel scanRequestModel = new ScanRequestModel();
                if (args.Length > 0)
                {
                    File.AppendAllText(ScanDocuFilePath, string.Format("Argument: {0} {1}", args[0], Environment.NewLine));
                    string argsments = args[0];
                    if (!string.IsNullOrEmpty(argsments))
                    {
                        scanRequestModel = JsonConvert.DeserializeObject<ScanRequestModel>(argsments);
                        //File.AppendAllText(ScanDocuFilePath, string.Format("Argument 2: {0} {1}", scanRequestModel, Environment.NewLine));
                    }
                }

                if (scanRequestModel.scanDocument)
                {
                    File.AppendAllText(ScanDocuFilePath, string.Format("Execute console app: {0:MM/dd/yyyy hh:mm:ss} {1}", DateTime.Now, Environment.NewLine));
                }

                using (var sdk = SDKWrapper.CreateInstance())
                {
                    DeviceInfo device = new DeviceInfo();

                    if (!string.IsNullOrEmpty(scanRequestModel.connectionType))
                    {
                        device.connectionType = (InterfaceType)Enum.Parse(typeof(InterfaceType), scanRequestModel.connectionType, true);
                    }

                    if (device.connectionType == InterfaceType.Network)
                    {
                        device.ipAddress = !string.IsNullOrEmpty(scanRequestModel.ipAddress) ? scanRequestModel.ipAddress : null;
                        device.nodeName = !string.IsNullOrEmpty(scanRequestModel.nodename) ? scanRequestModel.nodename : null;
                    }
                    else if (device.connectionType == InterfaceType.Usb)
                    {
                        device.modelName = !string.IsNullOrEmpty(scanRequestModel.usbModelName) ? scanRequestModel.usbModelName : null;
                    }
                    sdk.SelectDevice(device);

                    File.AppendAllText(ScanDocuFilePath, string.Format("Connected: {0} {1}", JsonConvert.SerializeObject(device), Environment.NewLine));
                    if (scanRequestModel.scanDocument)
                    {
                        var capabilities = sdk.QueryCapabilities();
                        var parameters = sdk.GetScanParameter();

                        // Change parameter.
                        //
                        if (capabilities.duplex)
                        {
                            parameters.duplex = (DuplexType)Enum.Parse(typeof(DuplexType), scanRequestModel.scanSide, true);
                        }

                        parameters.colorType = (ColorType)Enum.Parse(typeof(ColorType), scanRequestModel.color, true);
                        parameters.scanArea.paperType = (PaperType)Enum.Parse(typeof(PaperType), scanRequestModel.size, true);
                        parameters.resolution = (Resolution)Enum.Parse(typeof(Resolution), scanRequestModel.resolution, true);

                        ImageProcessing imageProcessingSkipPage = new ImageProcessing();
                        imageProcessingSkipPage.execute = scanRequestModel.skipBlankPage;
                        imageProcessingSkipPage.level = 0;
                        parameters.skipBlankPage = imageProcessingSkipPage;

                        sdk.SetScanParameter(parameters);

                        var fileParameter = sdk.GetFileParameter();
                        fileParameter.fileType = FileType.Pdf;
                        fileParameter.folderPath = string.Format(@"{0}", WebConfigurationManager.AppSettings["ScanDocumentStoragePath"]);
                        fileParameter.filePrefix = !string.IsNullOrEmpty(scanRequestModel.filePrefix) ? scanRequestModel.filePrefix : string.Format("{0}-{1}", scanRequestModel.refTransID, DateTime.Now.ToString("MMddyyyyHHmmss"));
                        sdk.SetFileParameter(fileParameter);

                        //
                        // Scan.
                        //

                        if (scanRequestModel.scanDocument)
                        {
                            File.AppendAllText(ScanDocuFilePath, string.Format("Start Scan: {0:MM/dd/yyyy hh:mm:ss} {1}", DateTime.Now, Environment.NewLine));
                        }
                        sdk.ScanAsync();
                        while (sdk.GetScanStatus() == ScanStatus.Scanning)
                        {
                            Thread.Sleep(100);
                        }
                        var status = sdk.GetScanStatus();
                        if (scanRequestModel.scanDocument)
                        {
                            File.AppendAllText(ScanDocuFilePath, string.Format("Document Prepared: {0:MM/dd/yyyy hh:mm:ss} {1}", DateTime.Now, Environment.NewLine));
                        }
                        if (status == ScanStatus.AllEnd || status == ScanStatus.Standby)
                        {
                            var fileList = sdk.GetFileList();
                            foreach (var filePath in fileList)
                            {
                                scanDetail.FileName = Path.GetFileName(filePath);
                            }
                        }
                        else
                        {
                            scanDetail.Error = sdk.GetScanError().ToString();
                        }
                    }
                }
            }
            catch (SDKException ex)
            {
                scanDetail.Error = ex._error.ToString();
            }
            File.AppendAllText(ScanDocuFilePath, string.Format("Completed: {0} {1}", JsonConvert.SerializeObject(scanDetail), Environment.NewLine));
            Console.Write(JsonConvert.SerializeObject(scanDetail));
        }

        // Adds an ACL entry on the specified file for the specified account.
        static void AddFileSecurity(string filePath, string account, FileSystemRights rights, AccessControlType controlType)
        {


            // Get a FileSecurity object that represents the
            // current security settings.
            FileSecurity fSecurity = File.GetAccessControl(filePath);

            // Add the FileSystemAccessRule to the security settings.
            fSecurity.AddAccessRule(new FileSystemAccessRule(account,
                rights, controlType));

            // Set the new access settings.
            File.SetAccessControl(filePath, fSecurity);

        }
    }
}
