using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Drawing;
using FJT.Reporting.Models;
using FJT.Utility.Models;
using System.Data.Entity.Core.Metadata.Edm;
using System.Net;
using System.Net.NetworkInformation;
using RestSharp;
using RestSharp.Extensions;
using ZXing;
using ZXing.Common;
using ZXing.Multi;
using ZXing.Client.Result;
using Patagames.Ocr;
using Patagames.Ocr.Enums;

namespace FJT.Utility
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Press {0} " +
                "1. To check corrupted PDF Files {0} " +
                "2. To check corrupted Image Files {0} " +
                "3. Sync Datasheet List Files {0} " +
                "4. Zxing: Scan Multiple Barcode from Image {0} " +
                "5. Inlite: Scan Multiple Barcode from Image {0} " +
                "6. Scan Multiple Text from Image {0} " +
                "{0}" +
                "Your input: ", Environment.NewLine);
            switch (Console.ReadLine())
            {
                case "1":
                    CheckCorruptedPDFFile();
                    break;
                case "2":
                    CheckCorruptedImageFile();
                    break;
                case "3":
                    SyncComponentDatasheet();
                    break;
                case "4":
                    ScanMultipleBarcodeFromImage();
                    break;
                case "5":
                    ScanMultipleBarcodeWithInlite();
                    break;
                case "6":
                    ScanMultipleTextFromImage();
                    break;
                default:
                    break;

            }
        }

        static void CheckCorruptedPDFFile()
        {
            string fileName = string.Empty;
            string folder = string.Empty;
            string CheckCorruptedPDFFileFolder = WebConfigurationManager.AppSettings["CheckCorruptedPDFFileFolder"].ToString();
            string CheckCorruptedPDFFilePath = WebConfigurationManager.AppSettings["CheckCorruptedPDFFilePath"].ToString();
            string CopyPDFFromFilePath = WebConfigurationManager.AppSettings["CopyPDFFromFilePath"].ToString();
            try
            {
                List<string> pdfFiles = Directory.GetFiles(CheckCorruptedPDFFileFolder, "*.pdf", SearchOption.AllDirectories).Select(System.IO.Path.GetFullPath).ToList();

                File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("---------------------" +
                    "{0}" +
                     "[{1}] Total Files: {2} [Path: {3}] {0}" +
                    "--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), pdfFiles.Count(), CheckCorruptedPDFFileFolder));

                pdfFiles.ForEach(file =>
                {
                    fileName = file;
                    string fileFolderPath = System.IO.Path.GetDirectoryName(fileName);
                    if (fileFolderPath != folder)
                    {
                        folder = fileFolderPath;
                        Console.Write(string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                        // File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                    }
                    if (File.Exists(fileName))
                    {
                        try
                        {
                            PdfReader pdfReader = new PdfReader(fileName);
                            pdfReader.Close();
                        }
                        catch (Exception ex)
                        {
                            // Uncomment below code to replace corrupted file with correct file from backup
                            //string sourceFilePath = fileName.Replace(CheckCorruptedPDFFileFolder, CopyPDFFromFilePath);
                            // File.Copy(sourceFilePath, fileName, true);
                            //Console.Write("Exception: SourceFile: {0} {2} Destination File: {1} {2}", sourceFilePath, fileName, Environment.NewLine);
                            Console.Write("Exception: {0} {1}", fileName, Environment.NewLine);
                            File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("=====> Corrupted: {0} {1}", fileName, Environment.NewLine));
                        }
                    }
                });
            }
            catch (Exception ex)
            {

                Console.Write("Exception: {0} {1}", fileName, Environment.NewLine);
                File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("=====> Exception: {0} {1} {2}", fileName, ex.InnerException?.Message, Environment.NewLine));
            }
            File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("---------------------{1}--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt")));
            Console.Write(string.Format("---------------------{1}--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt")));
        }

        static void CheckCorruptedImageFile()
        {
            string fileName = string.Empty;
            string folder = string.Empty;
            string CheckCorruptedImageFileFolder = WebConfigurationManager.AppSettings["CheckCorruptedImageFileFolder"].ToString();
            string CheckCorruptedImageFilePath = WebConfigurationManager.AppSettings["CheckCorruptedImageFilePath"].ToString();
            try
            {
                List<String> imageFiles = new List<String>();
                var filters = new String[] { "jpg", "jpeg", "png", "gif", "tiff", "bmp", "svg" };
                foreach (var filter in filters)
                {
                    imageFiles.AddRange(Directory.GetFiles(CheckCorruptedImageFileFolder, String.Format("*.{0}", filter), SearchOption.AllDirectories));
                }

                File.AppendAllText(CheckCorruptedImageFilePath, string.Format("---------------------" +
                    "{0}" +
                    "[{1}] Total Files: {2} [Path: {3}] {0}" +
                    "--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), imageFiles.Count(), CheckCorruptedImageFileFolder));

                imageFiles.ForEach(file =>
                {
                    fileName = file;
                    string fileFolderPath = System.IO.Path.GetDirectoryName(fileName);
                    if (fileFolderPath != folder)
                    {
                        folder = fileFolderPath;
                        Console.Write(string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                        // File.AppendAllText(CheckCorruptedImageFilePath, string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                    }
                    try
                    {
                        //Image img = Image.FromFile(fileName);
                        using (var bmp = new Bitmap(fileName))
                        {
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.Write("Exception: {0} {1}", fileName, Environment.NewLine);
                        File.AppendAllText(CheckCorruptedImageFilePath, string.Format("=====> Corrupted: {0} {1}", fileName, Environment.NewLine));
                    }
                });


            }
            catch (Exception ex)
            {

                Console.Write("Exception: {0}", fileName);
                File.AppendAllText(CheckCorruptedImageFilePath, string.Format("Exception: {0} {1} {2}", fileName, ex.InnerException?.Message, Environment.NewLine));
            }
            File.AppendAllText(CheckCorruptedImageFilePath, string.Format("---------------------{1}--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt")));
            Console.Write(string.Format("---------------------{1}--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt")));
        }

        static void SyncComponentDatasheet()
        {
            using (var context = new FJTSqlDBContext())
            {
                string checkCorruptedPDFFilePath = WebConfigurationManager.AppSettings["CheckCorruptedDatasheetPDFFilePath"].ToString();
                File.WriteAllText(checkCorruptedPDFFilePath, string.Empty);
                string notReturnPDFContainFilePath = WebConfigurationManager.AppSettings["NotReturnPDFContainFilePath"].ToString();
                File.WriteAllText(notReturnPDFContainFilePath, string.Empty);
                var dataSheetList = context.Database.SqlQuery<DatasheetComponentModel>("call Sproc_SyncComponentDatasheet ()").ToList();
                int counter = 0;
                int errorCounter = 0;
                foreach (var item in dataSheetList)
                {
                    try
                    {
                        if (item.datasheetURL.Contains(".pdf"))
                        {
                            // logic for overcome duplicate '.pdf' extension 
                            // e.g https://multimedia.3m.com/mws/media/805581O/3m-heat-shrink-tubing-product-selection-guide-low-res-pdf.pdf

                            var fileNameDetail = (item.datasheetName).Split('.');
                            item.datasheetName = String.Format("{0}.pdf", fileNameDetail[0]);
                        }
                        Uri uri = new Uri(item.datasheetURL);
                        string filename = String.Empty;

                        string datasheetPath = WebConfigurationManager.AppSettings["PartDataSheetUploadPath"].ToString();
                        string root = string.Concat(datasheetPath, item.documentPath, "\\datasheets");

                        string filePath = root + "\\" + item.datasheetName;
                        if (File.Exists(filePath))
                        {
                            try
                            {
                                PdfReader pdfReader = new PdfReader(filePath);
                                pdfReader.Close();
                                counter++;
                                Console.WriteLine(string.Format("State => Total Datasheet: {0} || Downoloaded File: {1} || Failed Download: {2} || Remain to Download: {4} {3}", dataSheetList.Count, counter, errorCounter, Environment.NewLine, (dataSheetList.Count - errorCounter - counter)));
                            }
                            catch (Exception ex)
                            {
                                DownloadDatasheet(checkCorruptedPDFFilePath, dataSheetList, ref counter, ref errorCounter, item, root, filePath, context, notReturnPDFContainFilePath);
                            }
                        }
                        else
                        {
                            DownloadDatasheet(checkCorruptedPDFFilePath, dataSheetList, ref counter, ref errorCounter, item, root, filePath, context, notReturnPDFContainFilePath);
                        }
                    }
                    catch (Exception ex)
                    {
                        errorCounter = errorCounter + 1;
                        File.AppendAllText(checkCorruptedPDFFilePath, string.Format("{0} {5}.(Execption) Error Message: {1} {0} ================= {0} 1. Datasheet URL:  {2} {0} 2. Datasheet Name: {3} {0} 3. Document Path Path: {4} {0} ",
                            Environment.NewLine, ex.Message, item.datasheetURL, item.datasheetName, item.documentPath, errorCounter));
                    };
                }
                File.AppendAllText(checkCorruptedPDFFilePath, string.Format("{4} {4} {4} State => Total Datasheet: {0} || Downoloaded File: {1} || Failed Download: {2} || Remain to Download: {3}",
                    dataSheetList.Count, counter, errorCounter, (dataSheetList.Count - errorCounter - counter), Environment.NewLine));
                Console.WriteLine("======================================================================================");
                Console.WriteLine("Sync-up datasheet completed with below result");
                Console.WriteLine(string.Format("State => Total Datasheet: {0} || Downoloaded File: {1} || Failed Download: {2} || Remain to Download: {4} {3}", dataSheetList.Count, counter, errorCounter, Environment.NewLine, (dataSheetList.Count - errorCounter - counter)));
                Console.ReadLine();
            }
        }

        static void ScanMultipleBarcodeFromImage()
        {
            string fileName = string.Empty;
            string folder = string.Empty;
            var totalProcessTime = new System.Diagnostics.Stopwatch();
            int processedFileCount = 0;
            int unProcessedFileCount = 0;
            totalProcessTime.Start();
            string ScanMultipleBarcodeFileFolder = WebConfigurationManager.AppSettings["ScanMultipleBarcodeFileFolder"].ToString();
            string ScanMultipleBarcodeFilePath = WebConfigurationManager.AppSettings["ScanMultipleBarcodeFile"].ToString();
            try
            {
                List<String> imageFiles = new List<String>();
                var filters = new String[] { "jpg", "jpeg", "png", "gif", "tiff", "bmp", "svg" };
                foreach (var filter in filters)
                {
                    imageFiles.AddRange(Directory.GetFiles(ScanMultipleBarcodeFileFolder, String.Format("*.{0}", filter), SearchOption.AllDirectories));
                }

                File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("---------------------" +
                    "{0}" +
                    "[{1}] Zxing Barcode Scanner: Total Files: {2} [Path: {3}] {0}" +
                    "--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), imageFiles.Count(), ScanMultipleBarcodeFileFolder));

                imageFiles.ForEach(file =>
                {
                    var watch = new System.Diagnostics.Stopwatch();
                    watch.Start();
                    fileName = file;
                    string fileFolderPath = System.IO.Path.GetDirectoryName(fileName);
                    if (fileFolderPath != folder)
                    {
                        folder = fileFolderPath;
                        Console.Write(string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                        // File.AppendAllText(CheckCorruptedImageFilePath, string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                    }
                    try
                    {
                        //string url = "D:\\Desktop\\FlexTron\\Flextron\\Docs\\Module - Receiving\\Barcode\\Photos (26)\\Cropped Image\\20180313_151409.jpg";
                        Uri myUri = new Uri(file);
                        var testBarcode = decodeMulti(myUri, null);
                        File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("---------------------" +
                            "{0}" + "{1}{2}{0}" +
                            "--------------------------{0}", Environment.NewLine, "Scan Multiple Barcode From Image: ", fileName));
                        if (testBarcode != null)
                        {
                            File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("No of Barcode Found: {0}{1}", testBarcode.Length, Environment.NewLine));
                            processedFileCount++;
                            foreach (var barcode in testBarcode)
                            {
                                File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("{1}{0}", Environment.NewLine, Convert.ToString(barcode.Text)));
                            }
                        }
                        else
                        {
                            File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("{1}{0}", Environment.NewLine, "Unable to scan Barcode"));
                            unProcessedFileCount++;
                        }
                        watch.Stop();
                    }
                    catch (Exception ex)
                    {
                        watch.Stop();
                        unProcessedFileCount++;
                        Console.Write("Exception: {0} {1}", fileName, Environment.NewLine);
                        File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("=====> Invalid Barcode: {0} {1}", fileName, Environment.NewLine));
                        Console.WriteLine("EXCEPTION: " + ex.Message);
                    }
                    File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("--------------------------{0}" + "{1}{0}" +
                   "--------------------------{0}{0}", Environment.NewLine, $"Execution Time: {TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds).TotalSeconds} sec"));
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }
            totalProcessTime.Stop();
            File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format(
               "{0}--------------------------{0}" +
              "Total Processed Files: {1}{0}Total Unprocessed Files: {2}{0}Total Time: {3} sec{0}" +
               "--------------------------{0}", Environment.NewLine, processedFileCount, unProcessedFileCount, TimeSpan.FromMilliseconds(totalProcessTime.ElapsedMilliseconds).TotalSeconds));
        }

        static void ScanMultipleBarcodeWithInlite()
        {
            string fileName = string.Empty;
            string folder = string.Empty;
            var totalProcessTime = new System.Diagnostics.Stopwatch();
            int processedFileCount = 0;
            int unProcessedFileCount = 0;
            totalProcessTime.Start();
            string ScanMultipleBarcodeFileFolder = WebConfigurationManager.AppSettings["ScanMultipleBarcodeFileFolder"].ToString();
            string ScanMultipleBarcodeFilePath = WebConfigurationManager.AppSettings["ScanMultipleBarcodeFile"].ToString();

            string authorization = "";
            string serverUrl = "";
            string types = "";
            string directions = "";
            uint tbr_code = 0;
            WABarcodeReader reader = new WABarcodeReader(serverUrl, authorization);

            try
            {
                List<String> imageFiles = new List<String>();
                var filters = new String[] { "jpg", "jpeg", "png", "gif", "tiff", "bmp", "svg" };
                foreach (var filter in filters)
                {
                    imageFiles.AddRange(Directory.GetFiles(ScanMultipleBarcodeFileFolder, String.Format("*.{0}", filter), SearchOption.AllDirectories));
                }

                File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("---------------------" +
                    "{0}" +
                    "[{1}] Inlite Barocode Scanner: Total Files: {2} [Path: {3}] {0}" +
                    "--------------------------{0}", Environment.NewLine, DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), imageFiles.Count(), ScanMultipleBarcodeFileFolder));

                imageFiles.ForEach(file =>
                {
                    var watch = new System.Diagnostics.Stopwatch();
                    watch.Start();
                    fileName = file;
                    string fileFolderPath = System.IO.Path.GetDirectoryName(fileName);
                    if (fileFolderPath != folder)
                    {
                        folder = fileFolderPath;
                        Console.Write(string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                        // File.AppendAllText(CheckCorruptedImageFilePath, string.Format("[{0}] Folder: {1} {2}", DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt"), fileFolderPath, Environment.NewLine));
                    }
                    try
                    {
                        File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("---------------------" +
                           "{0}" + "{1}{2}{0}" +
                           "--------------------------{0}", Environment.NewLine, "Scan Multiple Barcode From Image: ", fileName));
                        WABarcode[] barcodes = reader.Read(file, types, directions, tbr_code);
                        File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("No of Barcode Found: {0}{1}", barcodes.Length, Environment.NewLine));
                        if (barcodes.Length > 0)
                        {
                            processedFileCount++;
                            foreach (var barcode in barcodes)
                            {
                                Console.WriteLine(string.Format("{1}{0}", Environment.NewLine, Convert.ToString(barcode.Text)));
                                File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("{1}{0}", Environment.NewLine, Convert.ToString(barcode.Text)));
                            }
                        }
                        else
                        {
                            File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("{1}{0}", Environment.NewLine, "Unable to scan Barcode"));
                            unProcessedFileCount++;
                        }
                        watch.Stop();
                    }
                    catch (Exception ex)
                    {
                        watch.Stop();
                        unProcessedFileCount++;
                        Console.Write("Exception: {0} {1}", fileName, Environment.NewLine);
                        File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("=====> Invalid Barcode: {0} {1}", fileName, Environment.NewLine));
                    }
                    File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("--------------------------{0}" + "{1}{0}" +
                   "--------------------------{0}{0}", Environment.NewLine, $"Execution Time: {TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds).TotalSeconds} sec"));
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }
            totalProcessTime.Stop();
            File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format(
               "{0}--------------------------{0}" +
              "Total Processed Files: {1}{0}Total Unprocessed Files: {2}{0}Total Time: {3} sec{0}" +
               "--------------------------{0}", Environment.NewLine, processedFileCount, unProcessedFileCount, TimeSpan.FromMilliseconds(totalProcessTime.ElapsedMilliseconds).TotalSeconds));
        }

        static void ScanMultipleTextFromImage()
        {
            var ocrtext = string.Empty;
            string url = "D:\\Barcode_Testing\\20180313_150349_Cropped.jpg";
            using (var api = OcrApi.Create())
            {
                string ScanMultipleBarcodeFilePath = WebConfigurationManager.AppSettings["ScanMultipleBarcodeFile"].ToString();
                api.Init(Languages.English);
                string plainText = api.GetTextFromImage(url);

                File.AppendAllText(ScanMultipleBarcodeFilePath, "Scan Multiple Text From Image");
                File.AppendAllText(ScanMultipleBarcodeFilePath, string.Format("{0} {1}", Environment.NewLine, plainText));
                //Console.WriteLine(plainText);
                //Console.Read();
            }
            //using (var engine = new TesseractEngine(url, "eng", EngineMode.Default))
            //{
            //    using (var img = PixConverter.ToPix(ConvertToBitmap(url)))
            //    {
            //        using (var page = engine.Process(img))
            //        {
            //            ocrtext = page.GetText();
            //        }
            //    }
            //};
            //Console.WriteLine(ocrtext);
        }

        public static Result[] decodeMulti(Uri uri, IDictionary<DecodeHintType, object> hints)
        {
            Bitmap image;
            try
            {
                image = (Bitmap)Bitmap.FromFile(uri.LocalPath);
            }
            catch (Exception)
            {
                throw new FileNotFoundException("Resource not found: " + uri);
            }

            LuminanceSource source;
            //if (config.Crop == null)
            //{
            source = new BitmapLuminanceSource(image);
            //}
            //else
            //{
            //    int[] crop = config.Crop;
            //    source = new BitmapLuminanceSource(image).crop(crop[0], crop[1], crop[2], crop[3]);
            //}
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            //if (config.DumpBlackPoint)
            //{
            //dumpBlackPoint(uri, image, bitmap);
            //}

            MultiFormatReader multiFormatReader = new MultiFormatReader();
            GenericMultipleBarcodeReader reader = new GenericMultipleBarcodeReader(
                  multiFormatReader);
            Result[] results = reader.decodeMultiple(bitmap, hints);
            if (results != null && results.Length > 0)
            {
                //if (config.Brief)
                //{
                //    Console.Out.WriteLine(uri + ": Success");
                //}
                //else
                //{
                foreach (var result in results)
                {
                    ParsedResult parsedResult = ResultParser.parseResult(result);
                    Console.Out.WriteLine(uri + " (format: "
                                            + result.BarcodeFormat + ", type: "
                                            + parsedResult.Type + "):\nRaw result:\n"
                                            + result.Text + "\nParsed result:\n"
                                            + parsedResult.DisplayResult);
                    Console.Out.WriteLine("Found " + result.ResultPoints.Length + " result points.");
                    for (int i = 0; i < result.ResultPoints.Length; i++)
                    {
                        ResultPoint rp = result.ResultPoints[i];
                        if (rp != null)
                        {
                            Console.Out.WriteLine("  Point " + i + ": (" + rp.X + ',' + rp.Y + ')');
                        }
                    }
                }
                //}
                return results;
            }
            else
            {
                Console.Out.WriteLine(uri + ": No barcode found");
            }
            return null;
        }
        private static void DownloadDatasheet(string CheckCorruptedPDFFilePath, List<DatasheetComponentModel> dataSheetList, ref int counter, ref int errorCounter, DatasheetComponentModel item, string root, string filePath, FJTSqlDBContext context, string notReturnPDFContainFilePath)
        {
            try
            {
                var client = new RestClient(item.datasheetURL);
                var request = new RestRequest(Method.GET);
                IRestResponse response = client.Execute(request);
                if (response.ContentType.ToLower() == "application/pdf")
                {
                    try
                    {
                        byte[] fileData = client.DownloadData(request);
                        File.WriteAllBytes(filePath, fileData);
                        PdfReader pdfReader = new PdfReader(filePath);
                        pdfReader.Close();
                        updateDatasheetName(context, item.datasheetName, item.id);

                        counter++;
                        Console.WriteLine(string.Format("State => Total Datasheet: {0} || Downoloaded File: {1} || Failed Download: {2} || Remain to Download: {4} {3}", dataSheetList.Count, counter, errorCounter, Environment.NewLine, (dataSheetList.Count - errorCounter - counter)));
                    }
                    catch (Exception ex)
                    {
                        errorCounter = errorCounter + 1;
                        File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("{0} {5}. Download File but Corrupted: {1} {0} ================= {0} 1. Datasheet URL:  {2} {0} 2. Datasheet Name: {3} {0} 3. Document Path Path: {4} {0} ",
                            Environment.NewLine, ex.Message, item.datasheetURL, item.datasheetName, item.documentPath, errorCounter));
                    }
                }
                else
                {
                    errorCounter = errorCounter + 1;
                    File.AppendAllText(notReturnPDFContainFilePath, string.Format("================= {0}.Not Return PDF File: " +
                        "{0} ================= {0} 1. MPN: {1} {0} 2. Component ID: {5} {0} 3. Datasheet URL:  {2} {0} 4. Datasheet Name: {3} {0} 5. Document Path Path: {4} {0} ",
                   Environment.NewLine, item.mfgPN, item.datasheetURL, item.datasheetName, item.documentPath, item.refComponentID));
                }
            }
            catch (Exception ex)
            {
                errorCounter = errorCounter + 1;
                File.AppendAllText(CheckCorruptedPDFFilePath, string.Format("{0} {5}.(Execption) Error Message: {1} {0} ================= {0} 1. Datasheet URL:  {2} {0} 2. Datasheet Name: {3} {0} 3. Document Path Path: {4} {0} ",
                   Environment.NewLine, ex.Message, item.datasheetURL, item.datasheetName, item.documentPath, errorCounter));
            }
        }
        private static void updateDatasheetName(FJTSqlDBContext context, string datasheetName, int id)
        {
            string query = string.Format("update component_datasheets set datasheetName = '{0}', updatedBy = 'Auto' where id = {1}", datasheetName, id);
            context.Database.ExecuteSqlCommand(query);
        }

        public static Bitmap ConvertToBitmap(string fileName)
        {
            Bitmap bitmap;
            using (Stream bmpStream = System.IO.File.Open(fileName, System.IO.FileMode.Open))
            {
                Image image = Image.FromStream(bmpStream);
                bitmap = new Bitmap(image);
            }
            return bitmap;
        }
    }
}

