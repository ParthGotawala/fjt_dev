using FJT.AutoBackup.Email_Service;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Web.Configuration;
using MongoDB.Driver;
using System.Net;
using System.Net.Sockets;
using FJT.AutoBackup.FileSystemHelper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO.Compression;
using System.ServiceProcess;

namespace FJT.AutoBackup
{
    class Program
    {
        static string _adminEmailID = WebConfigurationManager.AppSettings["adminEmailID"].ToString();

        public static class Globals
        {
            public static bool boolMysqlBackupSuccessful = false;
            public static bool boolMysqlIdentityBackupSuccessful = false;
            public static bool boolMongoBackupSuccessful = false;
            public static bool boolElasticSearchBackupSuccessful = false;
            public static bool boolFolderBackupSuccessful = false;
            public static bool boolDatasheetBackupSuccessful = false;
            public static bool boolNotAException = true;
            public static bool boolTakeDatasheetBackup = false;

            public static DateTime _today = DateTime.Now;
            public static string _scanDocuFilePath = WebConfigurationManager.AppSettings["BackupFolder"].ToString();
            public static string _MysqlDBName = WebConfigurationManager.AppSettings["mysqlDBName"].ToString();
            public static string _MysqlIdentityDBName = WebConfigurationManager.AppSettings["mysqlIdentityDBName"].ToString();
            public static string _mongoDbDatabaseName = WebConfigurationManager.AppSettings["mongoDbDatabaseName"].ToString();
            public static string _elasticIndicesName = WebConfigurationManager.AppSettings["elasticIndicesName"].ToString();
            public static string _backupSystemDetails = WebConfigurationManager.AppSettings["BackupSystemDetails"].ToString();
            public static string isTakeBackupUploadFolder = WebConfigurationManager.AppSettings["TakeUploadFolderBackup"].ToString();
            public static string _psFilePath = WebConfigurationManager.AppSettings["BackUpFilePath"].ToString();
            public static string _datasheetFilePath = WebConfigurationManager.AppSettings["DatasheetBackUpFilePath"].ToString();
            public static string _takeDatasheetBackupDays = WebConfigurationManager.AppSettings["TakeDatasheetBackupDays"].ToString();
            public static string _isCompressedBackup = WebConfigurationManager.AppSettings["IsCompressedBackup"].ToString();
            public static string _7ZipExeFilePath = WebConfigurationManager.AppSettings["7ZipExeFilePath"].ToString();
            public static string _compressedFileExtension = WebConfigurationManager.AppSettings["CompressedFileExtension"].ToString();
            public static string _mySqlServiceName = WebConfigurationManager.AppSettings["MySqlServiceName"].ToString();
            public static string _mongoDBServiceName = WebConfigurationManager.AppSettings["MongoDBServiceName"].ToString();
            public static string _elasticsearchServiceName = WebConfigurationManager.AppSettings["ElasticsearchServiceName"].ToString();
            public static string _mysqlBackupFile, _gZipMysqlBackupFile = null;
            public static string _mysqlIdentityBackupFile, _gZipMysqlIdentityBackupFile = null;
            public static string _elasticBackupFile = null;
            public static string _uploadFolderBackupFile = null;
            public static string _datasheetFolderBackupFile = null;
            public static string _backupFolderPath = string.Format("{0}{1:MMddyyyy}" + "\\" + "{2:MMddyyyyHHmmss}", _scanDocuFilePath, _today, _today);
            public static string _mysqlBackupFileSize, _mongoBackupFileSize, _elasticBackupFileSize, _folderBackupFileSize, _datasheetBackupFileSize, _mysqlIdentityBackupFileSize;
            public static string _mysqlBackupFileTime, _mongoBackupFileTime, _elasticBackupFileTime, _folderBackupFileTime, _datasheetBackupFileTime, _deleteOldBackupTime, _mysqlIdentityBackupFileTime;
            public static TimeSpan _totalMySQLBackupTime, _totalMongoDBBackupTime, _totalElasticBackupTime, _totalFolderBackupTime, _totalDataSheetBackupTime, _totalExternalBackupTime, _totalBackupTime, _totalDeleteOldBackupTime, _totalMySQLIdentityBackupTime;
            public static string _backupDriveSpace, _externalBackupDriveSpace, _driveNotFoundMessage;
            public static string _errorStackTrace = "";
        }

        static async Task Main(string[] args)
        {

            Globals._mysqlBackupFileSize = Globals._mongoBackupFileSize = Globals._elasticBackupFileSize = Globals._folderBackupFileSize = Globals._datasheetBackupFileSize = Globals._mysqlIdentityBackupFileSize = "<b>Failed</b>";
            Globals._mysqlBackupFileTime = Globals._mongoBackupFileTime = Globals._elasticBackupFileTime = Globals._folderBackupFileTime = Globals._datasheetBackupFileTime = Globals._deleteOldBackupTime = Globals._mysqlIdentityBackupFileTime = "<b>NA</b>";
            Globals._totalMySQLBackupTime = Globals._totalMongoDBBackupTime = Globals._totalElasticBackupTime = Globals._totalFolderBackupTime = Globals._totalDataSheetBackupTime = Globals._totalExternalBackupTime = Globals._totalDeleteOldBackupTime = Globals._totalMySQLIdentityBackupTime = TimeSpan.Zero;
            Globals._backupDriveSpace = Globals._externalBackupDriveSpace = Globals._driveNotFoundMessage = "<b>Drive Not Found</b>";
            try
            {
                if (!string.IsNullOrEmpty(Globals._takeDatasheetBackupDays))
                {
                    string[] _backupDays = Globals._takeDatasheetBackupDays.ToUpper().Split(new char[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (_backupDays.Contains(Convert.ToString(Globals._today.DayOfWeek).ToUpper()))
                    {
                        Globals.boolTakeDatasheetBackup = true;
                    }
                }

                string driveLetter = Path.GetPathRoot(Globals._scanDocuFilePath);
                if (!Directory.Exists(driveLetter))
                {
                    Globals._mysqlBackupFileSize = Globals._mysqlIdentityBackupFileSize = Globals._driveNotFoundMessage;
                    return;
                }

                //Date wise folder create if not exists
                if (!Directory.Exists(string.Format("{0}{1:MMddyyyy}", Globals._scanDocuFilePath, Globals._today)))
                {
                    Directory.CreateDirectory(string.Format("{0}{1:MMddyyyy}", Globals._scanDocuFilePath, Globals._today));
                }

                Directory.CreateDirectory(Globals._backupFolderPath);

                #region Folder Back up
                var uploadBackupTask = Task.Factory.StartNew(() => TakeUploadFolderBackupAsync(driveLetter));
                var dataSheetBackupTask = Task.Factory.StartNew(() => TakeDataSheetFolderBackupAsync(driveLetter));
                #endregion

                #region My Sql Backup
                var mySQLDBBackupTask = Task.Factory.StartNew(() => TakeMySQLDBBackupAsync());
                #endregion

                #region My Sql Identity Backup
                var mySQLIdentityDBBackupTask = Task.Factory.StartNew(() => TakeMySQLIdentityDBBackupAsync());
                #endregion

                #region MongoBackup
                var mongoDBBackupTask = Task.Factory.StartNew(() => TakeMongoDBBackupAsync());
                #endregion

                #region ElasticSearch
                var elasticDBBackupTask = Task.Factory.StartNew(() => TakeElasticDBBackupAsync());
                #endregion

                await Task.WhenAll(uploadBackupTask, dataSheetBackupTask, mySQLDBBackupTask, mongoDBBackupTask, elasticDBBackupTask, mySQLIdentityDBBackupTask);
                Console.WriteLine("All task completed!!");
            }
            catch (AggregateException e)
            {
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", e.Message, e.StackTrace);
                Globals.boolNotAException = false;
                foreach (var ex in e.InnerExceptions)
                {
                    SaveErrorLog(ex);
                }
            }
            catch (Exception ex)
            {
                Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                Globals.boolNotAException = false;
                SaveErrorLog(ex);
            }
            finally
            {
                string _subject = string.Empty;
                string _body = string.Empty;
                try
                {
                    bool bkupStatus = (Globals.boolNotAException && Globals.boolMysqlBackupSuccessful && Globals.boolMongoBackupSuccessful && Globals.boolElasticSearchBackupSuccessful && Globals.boolMysqlIdentityBackupSuccessful);

                    if (bkupStatus == true && Globals.isTakeBackupUploadFolder == "1" && !Globals.boolFolderBackupSuccessful)
                    {
                        bkupStatus = false;
                    }
                    if (bkupStatus == true && Globals.boolTakeDatasheetBackup && !Globals.boolDatasheetBackupSuccessful)
                    {
                        bkupStatus = false;
                    }

                    string currentDate = DateTime.UtcNow.ToString("MM-dd-yyyy HH:mm");
                    string bodyMessage = (bkupStatus == true) ? "Auto Backup Completed Successfully." : "Auto Backup Failed.";
                    string bodyCSSClass = (bkupStatus == true) ? "#0fd00f" : "#ff6a6a";
                    string _fileSizeMessage = "<b>File Size:</b> {0}";
                    string _backupTimeMessage = "<b>Backup Time:</b> {0}";


                    if (Globals.isTakeBackupUploadFolder == "1")
                    {
                        if (Globals.boolFolderBackupSuccessful && Globals._uploadFolderBackupFile != null && Directory.Exists(Globals._uploadFolderBackupFile))
                        {
                            double size = GetDirectorySize(Globals._uploadFolderBackupFile);
                            Globals._folderBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._folderBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalFolderBackupTime));
                        }

                    }
                    if (Globals.boolTakeDatasheetBackup)
                    {
                        if (Globals.boolDatasheetBackupSuccessful && Globals._datasheetFolderBackupFile != null && Directory.Exists(Globals._datasheetFolderBackupFile))
                        {
                            double size = GetDirectorySize(Globals._datasheetFolderBackupFile);
                            Globals._datasheetBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._datasheetBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalDataSheetBackupTime));
                        }
                    }

                    if (Globals._isCompressedBackup == "1")
                    {
                        if (Globals.boolMysqlBackupSuccessful && Globals._gZipMysqlBackupFile != null
                        && File.Exists(Globals._gZipMysqlBackupFile))
                        {
                            FileInfo file = new FileInfo(Globals._gZipMysqlBackupFile);
                            double size = Math.Round(((double)file.Length / 1024 / 1024), 2);
                            Globals._mysqlBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._mysqlBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalMySQLBackupTime));

                        }
                        if (Globals.boolMysqlIdentityBackupSuccessful && Globals._gZipMysqlIdentityBackupFile != null && File.Exists(Globals._gZipMysqlIdentityBackupFile))
                        {
                            FileInfo file = new FileInfo(Globals._gZipMysqlIdentityBackupFile);
                            double size = Math.Round(((double)file.Length / 1024 / 1024), 2);
                            Globals._mysqlIdentityBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._mysqlIdentityBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalMySQLIdentityBackupTime));
                        }
                    }
                    else
                    {
                        if (Globals.boolMysqlBackupSuccessful && Globals._mysqlBackupFile != null
                        && File.Exists(Globals._mysqlBackupFile))
                        {
                            FileInfo file = new FileInfo(Globals._mysqlBackupFile);
                            double size = Math.Round(((double)file.Length / 1024 / 1024), 2);
                            Globals._mysqlBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._mysqlBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalMySQLBackupTime));

                        }
                        if (Globals.boolMysqlIdentityBackupSuccessful && Globals._mysqlIdentityBackupFile != null && File.Exists(Globals._mysqlIdentityBackupFile))
                        {
                            FileInfo file = new FileInfo(Globals._mysqlIdentityBackupFile);
                            double size = Math.Round(((double)file.Length / 1024 / 1024), 2);
                            Globals._mysqlIdentityBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                            Globals._mysqlIdentityBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalMySQLIdentityBackupTime));
                        }
                    }

                    if (Globals.boolMongoBackupSuccessful && Globals._backupFolderPath != null && Directory.Exists(Globals._backupFolderPath))
                    {
                        double size = GetDirectorySize(Globals._backupFolderPath + "\\" + Globals._mongoDbDatabaseName);
                        Globals._mongoBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                        Globals._mongoBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalMongoDBBackupTime));
                    }
                    if (Globals.boolElasticSearchBackupSuccessful && Globals._elasticBackupFile != null && Directory.Exists(Globals._elasticBackupFile))
                    {
                        double size = GetDirectorySize(Globals._elasticBackupFile);
                        Globals._elasticBackupFileSize = string.Format(_fileSizeMessage, GetConvertedSize(size));
                        Globals._elasticBackupFileTime = string.Format(_backupTimeMessage, GetTimeInText(Globals._totalElasticBackupTime));
                    }

                    string _ipAddress = GetLocalIPAddress();
                    string _systemName = Environment.MachineName;
                    string _subjectDiskWarningMessage = string.Empty;
                    _subject = (bkupStatus == true) ? "{0}: Auto Backup Completed Successfully" : "{0}: Auto Backup Failed";
                    _body = string.Format("<b style=\"background: {0};\">Backup Status: {1} </b><br/><br/>" +
                        "<b>Release:</b> {9} <br/>" + "" +
                        "<b>System Name(IP Address):</b> {11}({10}) <br/>" + "" +
                        "<b>On Date:</b> {2} (UTC) (24Hrs) <br/>" + "" +
                        "<b>MySql Q2C Database:</b> {3} ; {4}; {12} <br/> " + "" +
                        "<b>MySql Identity Database:</b> {15} ; {16}; {17} <br/> " + "" +
                        "<b>MongoDB:</b> {5} ; {6}; {13} <br/> " + "" +
                        "<b>Enterprise Search Database:</b> {7} ; {8}; {14}",
                        bodyCSSClass,
                        bodyMessage,
                        currentDate,
                        Globals._MysqlDBName,
                        Globals._mysqlBackupFileSize,
                        Globals._mongoDbDatabaseName,
                        Globals._mongoBackupFileSize,
                        Globals._elasticIndicesName,
                        Globals._elasticBackupFileSize,
                        Globals._backupSystemDetails,
                        _ipAddress,
                        _systemName,
                        Globals._mysqlBackupFileTime,
                        Globals._mongoBackupFileTime,
                        Globals._elasticBackupFileTime,
                        Globals._MysqlIdentityDBName,
                        Globals._mysqlIdentityBackupFileSize,
                        Globals._mysqlIdentityBackupFileTime);

                    if (Globals.isTakeBackupUploadFolder == "1")
                    {
                        _body += "<br/> <b>Uploaded Documents:</b> {0}; {1}";
                        _body = string.Format(_body, Globals._folderBackupFileSize, Globals._folderBackupFileTime);

                    }
                    if (Globals.boolTakeDatasheetBackup)
                    {
                        _body += "<br/> <b>Part Downloaded DataSheets:</b> {0}; {1}";
                        _body = string.Format(_body, Globals._datasheetBackupFileSize, Globals._datasheetBackupFileTime);
                    }

                    string isCopyFolderExternalDrive = WebConfigurationManager.AppSettings["IsCopyFolderExternalDrive"].ToString();
                    string _externalDriveBackupPath = WebConfigurationManager.AppSettings["ExternalDriveBackupPath"].ToString();
                    string _networkDriveMapLetter = WebConfigurationManager.AppSettings["NetworkDriveMapLetter"].ToString();
                    string _deleteOldBackupDays = WebConfigurationManager.AppSettings["DeleteOldBackupDays"].ToString();
                    #region Copy Backup on Another Drive
                    if (isCopyFolderExternalDrive == "1")
                    {
                        try
                        {
                            Console.WriteLine("Started Backup copy on drive");
                            DateTime _externalBackupStartTime = DateTime.Now;
                            Globals._uploadFolderBackupFile = Globals._backupFolderPath;
                            var _externalDriveBackupFolder = string.Format("{0}" + "\\" + "{1:MMddyyyy}" + "\\" + "{2:MMddyyyyHHmmss}", _externalDriveBackupPath, Globals._today, Globals._today);
                            string _isCheckNetworkCredentails = WebConfigurationManager.AppSettings["IsCheckNetworkCredentails"].ToString();
                            if (_isCheckNetworkCredentails == "1")
                            {
                                string _networkUser = WebConfigurationManager.AppSettings["NetworkUser"].ToString();
                                string _networkPassword = WebConfigurationManager.AppSettings["NetworkPassword"].ToString();
                                NetworkCredential credentials = new NetworkCredential(_networkUser, _networkPassword);

                                using (new ConnectToSharedFolder(_externalDriveBackupPath, credentials))
                                {
                                    // If the destination directory doesn't exist, create it.
                                    if (!Directory.Exists(_externalDriveBackupFolder))
                                    {
                                        Directory.CreateDirectory(_externalDriveBackupFolder);
                                    }
                                    DirectoryCopy(Globals._uploadFolderBackupFile, _externalDriveBackupFolder, true, ref Globals._errorStackTrace);
                                }
                            }
                            else
                            {
                                // If the destination directory doesn't exist, create it.
                                if (!Directory.Exists(_externalDriveBackupFolder))
                                {
                                    Directory.CreateDirectory(_externalDriveBackupFolder);
                                }
                                DirectoryCopy(Globals._uploadFolderBackupFile, _externalDriveBackupFolder, true, ref Globals._errorStackTrace);
                            }
                            DateTime _externalBackupEndTime = DateTime.Now;
                            Globals._totalExternalBackupTime = _externalBackupEndTime.Subtract(_externalBackupStartTime);

                            _body += "<br/> <b>Backup Copy Time:</b> {0}";
                            _body = string.Format(_body, GetTimeInText(Globals._totalExternalBackupTime));
                            Console.WriteLine("Completed Backup copy on drive");
                        }
                        catch (Exception ex)
                        {
                            Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                        }
                    }
                    #endregion

                    //Delete Old Backup folders
                    if (_deleteOldBackupDays != null)
                    {
                        DateTime _deleteOldBackupStartTime = DateTime.Now;
                        Console.WriteLine("Started Delete old folder from drive");
                        int oldBackupDeleteDays = int.Parse(_deleteOldBackupDays);
                        if (Directory.Exists(Globals._scanDocuFilePath))
                        {
                            DeleteOldBackupFolders(Globals._scanDocuFilePath, oldBackupDeleteDays, ref Globals._errorStackTrace);
                        }
                        if (Directory.Exists(_externalDriveBackupPath))
                        {
                            DeleteOldBackupFolders(_externalDriveBackupPath, oldBackupDeleteDays, ref Globals._errorStackTrace);
                        }
                        DateTime _deleteOldBackupEndTime = DateTime.Now;
                        Globals._totalDeleteOldBackupTime = _deleteOldBackupEndTime.Subtract(_deleteOldBackupStartTime);
                        if (Globals._totalDeleteOldBackupTime.TotalSeconds > 0)
                        {
                            _body += "<br/> <b>Old Backup Delete Time:</b> {0}";
                            string _stringDeleteTime = GetTimeInText(Globals._totalDeleteOldBackupTime);
                            _body = string.Format(_body, (_stringDeleteTime != "" ? _stringDeleteTime : "less then a second"));
                        }
                        Console.WriteLine("Completed Delete old folder from drive");
                    }

                    #region Check Disk Space
                    DriveInfo[] allDrives = DriveInfo.GetDrives();
                    DirectoryInfo backupDir = new DirectoryInfo(Globals._scanDocuFilePath);
                    DirectoryInfo externalDir = new DirectoryInfo(_networkDriveMapLetter);
                    double backupDriveSpaceMB = 0, externalBackupDriveSpaceMB = 0;
                    foreach (DriveInfo d in allDrives)
                    {
                        //==>>check BackUp folder drive size
                        if (backupDir.Root.FullName == d.Name)
                        {
                            backupDriveSpaceMB = ((d.AvailableFreeSpace / 1024) / 1024);
                            Globals._backupDriveSpace = GetConvertedSize(backupDriveSpaceMB);
                        }
                        //<<==check BackUp folder drive size

                        //==>>check External BackUp folder drive size
                        if (externalDir.Root.FullName == d.Name)
                        {
                            externalBackupDriveSpaceMB = ((d.AvailableFreeSpace / 1024) / 1024);
                            Globals._externalBackupDriveSpace = GetConvertedSize(externalBackupDriveSpaceMB);
                        }
                        //<<==check External BackUp folder drive size
                    }
                    if (Globals._backupDriveSpace != Globals._driveNotFoundMessage && (Globals._externalBackupDriveSpace != Globals._driveNotFoundMessage || isCopyFolderExternalDrive != "1"))
                    {
                        double _backupTotalSizeMB = GetDirectorySize(Globals._backupFolderPath);
                        double _backupPrecautionarySizeMB = _backupTotalSizeMB * 7;//multiply by 7 days to forecast required space for next 7 days
                        if (_backupPrecautionarySizeMB > backupDriveSpaceMB || (_backupPrecautionarySizeMB > externalBackupDriveSpaceMB && isCopyFolderExternalDrive == "1"))
                        {
                            _subjectDiskWarningMessage = " LOW DISK SPACE WARNING!";
                        }
                        else if (_backupTotalSizeMB > backupDriveSpaceMB || (_backupTotalSizeMB > externalBackupDriveSpaceMB && isCopyFolderExternalDrive == "1"))
                        {
                            _subjectDiskWarningMessage = " INSUFFICIENT SPACE ON DISK";
                        }
                        if (_subjectDiskWarningMessage != string.Empty)
                        {
                            _subject += _subjectDiskWarningMessage;
                        }
                    }

                    _body += string.Format("<br/><br/> <b>Available Space on Backup Drive:</b> {0} <b>{1}</b>", backupDir.Root.FullName, Globals._backupDriveSpace);
                    if (isCopyFolderExternalDrive == "1")
                    {
                        _body += string.Format("<br/> <b>Available Space on External Backup Drive:</b> {0} <b>{1}</b>", externalDir.Root.FullName, Globals._externalBackupDriveSpace);
                    }
                    #endregion

                    DateTime _endTime = DateTime.Now;
                    Globals._totalBackupTime = _endTime.Subtract(Globals._today);
                    string _timeSuffix = GetTimeInText(Globals._totalBackupTime);
                    _body += string.Format("<br/><br/> <b>Total Time Taken to Complete Backup:</b> {0}", _timeSuffix);

                    if (!string.IsNullOrEmpty(Globals._errorStackTrace))
                    {
                        _body += ("<br/><br/><br/><br/>Error:<br/>" + Globals._errorStackTrace);
                    }
                }
                catch (Exception ex)
                {
                    Globals._errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
                }
                try
                {
                    EmailModel emailModel = new EmailModel()
                    {
                        To = _adminEmailID,
                        Subject = string.Format(_subject, Globals._backupSystemDetails),
                        Body = _body
                    };
                    EmailService emailService = new EmailService();
                    emailService.SendEmail(emailModel);
                    Environment.Exit(0);
                }
                catch (Exception ex)
                {
                    SaveErrorLog(ex);
                }
            }
        }

        public static async Task TakeUploadFolderBackupAsync(string driveLetter)
        {
            try
            {
                if (Globals.isTakeBackupUploadFolder == "1")
                {
                    driveLetter = Path.GetPathRoot(Globals._psFilePath);
                    if (!Directory.Exists(driveLetter))
                    {
                        Globals.boolFolderBackupSuccessful = false;
                        Globals._folderBackupFileSize = "Source " + Globals._driveNotFoundMessage;
                    }
                    else
                    {
                        Globals._uploadFolderBackupFile = string.Format("{0}{1:MMddyyyy}" + "\\" + "{2:MMddyyyyHHmmss}" + "\\uploads", Globals._scanDocuFilePath, Globals._today, Globals._today);
                        driveLetter = Path.GetPathRoot(Globals._uploadFolderBackupFile);
                        if (!Directory.Exists(driveLetter))
                        {
                            Globals.boolFolderBackupSuccessful = false;
                            Globals._folderBackupFileSize = "Destination " + Globals._driveNotFoundMessage;
                        }
                        else
                        {
                            Console.WriteLine("Started Backup for folder");
                            DateTime _uploadBackupStartTime = DateTime.Now;
                            Globals.boolFolderBackupSuccessful = BackUpFolderCopy(Globals._psFilePath, Globals._uploadFolderBackupFile, Globals._today, ref Globals._errorStackTrace);
                            DateTime _uploadBackupEndTime = DateTime.Now;
                            Globals._totalFolderBackupTime = _uploadBackupEndTime.Subtract(_uploadBackupStartTime);
                            Console.WriteLine("Completed Backup for folder");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
        public static async Task TakeDataSheetFolderBackupAsync(string driveLetter)
        {
            try
            {
                if (Globals.boolTakeDatasheetBackup)
                {
                    driveLetter = Path.GetPathRoot(Globals._datasheetFilePath);
                    if (!Directory.Exists(driveLetter))
                    {
                        Globals.boolDatasheetBackupSuccessful = false;
                        Globals._datasheetBackupFileSize = "Source " + Globals._driveNotFoundMessage;
                    }
                    else
                    {
                        Globals._datasheetFolderBackupFile = string.Format("{0}{1:MMddyyyy}" + "\\" + "{2:MMddyyyyHHmmss}" + "\\datasheets", Globals._scanDocuFilePath, Globals._today, Globals._today);
                        driveLetter = Path.GetPathRoot(Globals._datasheetFolderBackupFile);
                        if (!Directory.Exists(driveLetter))
                        {
                            Globals.boolDatasheetBackupSuccessful = false;
                            Globals._datasheetBackupFileSize = "Destination " + Globals._driveNotFoundMessage;
                        }
                        else
                        {
                            Console.WriteLine("Started Backup for Datasheet");
                            DateTime _dataSheetBackupStartTime = DateTime.Now;
                            Globals.boolDatasheetBackupSuccessful = BackUpFolderCopy(Globals._datasheetFilePath, Globals._datasheetFolderBackupFile, Globals._today, ref Globals._errorStackTrace);
                            DateTime _dataSheetBackupEndTime = DateTime.Now;
                            Globals._totalDataSheetBackupTime = _dataSheetBackupEndTime.Subtract(_dataSheetBackupStartTime);
                            Console.WriteLine("Completed Backup for Datasheet");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }

        // set error message for Service status
        public static void SetServiceStatusErrorMessage(string pServiceName, string pServiceStatus)
        {
            Globals._errorStackTrace += string.Format("<br/><br/>{0} service is not running! Current Status: <b>{1}</b>", pServiceName, pServiceStatus);
        }

        public static async Task TakeMySQLDBBackupAsync()
        {
            try
            {
                ServiceController scMysqlServiceStatus = new ServiceController(Globals._mySqlServiceName);

                if (scMysqlServiceStatus.Status == ServiceControllerStatus.Running)
                {
                    Console.WriteLine("Started Backup for mysql");
                    DateTime _mySQLBackupStartTime = DateTime.Now;
                    string _mySqlBackupBatchFile = WebConfigurationManager.AppSettings["mysqlBackupBatchFile"].ToString();
                    string _MysqlDbDumpExePath = WebConfigurationManager.AppSettings["mysqlDbDumpExePath"].ToString();
                    string _MysqlUserName = WebConfigurationManager.AppSettings["mysqlUserName"].ToString();
                    string _MysqlPassword = WebConfigurationManager.AppSettings["mysqlPassword"].ToString();
                    Globals._mysqlBackupFile = string.Format("{0}{1:MMddyyyy}\\{2:MMddyyyyHHmmss}\\{4}_{3:MMddyyyyHHmmss}.sql", Globals._scanDocuFilePath, Globals._today, Globals._today, Globals._today, Globals._MysqlDBName);
                    string _str = string.Format("\"" + @_MysqlDbDumpExePath + "\"" + " -u " + _MysqlUserName + " -p" + _MysqlPassword + " --lock-tables=false --single-transaction --add-drop-table -R -E --databases " + Globals._MysqlDBName + " > {0}", Globals._mysqlBackupFile);

                    // for compress need to check this setting level from 0 to 9 
                    // ref link https://dev.mysql.com/doc/mysql-enterprise-backup/4.1/en/backup-compression-options.html
                    //--compress--compress - level = 5   

                    File.WriteAllText(@_mySqlBackupBatchFile, _str);

                    //Create process start information
                    ProcessStartInfo DBProcessStartInfo = new ProcessStartInfo(@_mySqlBackupBatchFile)
                    {
                        //The output display window need not be flashed onto the front.
                        WindowStyle = ProcessWindowStyle.Normal,
                        UseShellExecute = false
                    };

                    //Create the process and run it
                    Process dbProcess;
                    dbProcess = Process.Start(DBProcessStartInfo);
                    dbProcess.WaitForExit();
                    //Backup created successfully
                    if (Globals._isCompressedBackup == "1")
                    {
                        Globals._gZipMysqlBackupFile = Globals._mysqlBackupFile + Globals._compressedFileExtension;
                        CompressToZipFileAndDeleteOriginal(Globals._mysqlBackupFile);
                    }
                    if (dbProcess.ExitCode == 0)
                    {
                        Globals.boolMysqlBackupSuccessful = true;
                    }
                    dbProcess.Close();
                    DateTime _mySQLBackupEndTime = DateTime.Now;
                    Globals._totalMySQLBackupTime = _mySQLBackupEndTime.Subtract(_mySQLBackupStartTime);
                    Console.WriteLine("Completed Backup for mysql");
                }
                else
                {
                    SetServiceStatusErrorMessage(Globals._mySqlServiceName, scMysqlServiceStatus.Status.ToString());
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
        public static async Task TakeMySQLIdentityDBBackupAsync()
        {
            try
            {
                ServiceController scMysqlServiceStatus = new ServiceController(Globals._mySqlServiceName);

                if (scMysqlServiceStatus.Status == ServiceControllerStatus.Running)
                {
                    Console.WriteLine("Started Backup for identity database");
                    DateTime _mySQLIdentityBackupStartTime = DateTime.Now;
                    string _mysqlIdentityBackupBatchFile = WebConfigurationManager.AppSettings["mysqlIdentityBackupBatchFile"].ToString();
                    string _MysqlIdentityDbDumpExePath = WebConfigurationManager.AppSettings["mysqlDbDumpExePath"].ToString();
                    string _MysqlIdentityUserName = WebConfigurationManager.AppSettings["mysqlUserName"].ToString();
                    string _MysqlIdentityPassword = WebConfigurationManager.AppSettings["mysqlPassword"].ToString();
                    Globals._mysqlIdentityBackupFile = string.Format("{0}{1:MMddyyyy}\\{2:MMddyyyyHHmmss}\\{4}_{3:MMddyyyyHHmmss}.sql", Globals._scanDocuFilePath, Globals._today, Globals._today, Globals._today, Globals._MysqlIdentityDBName);
                    string _strIdentity = string.Format("\"" + @_MysqlIdentityDbDumpExePath + "\"" + " -u " + _MysqlIdentityUserName + " -p" + _MysqlIdentityPassword + " --lock-tables=false --single-transaction --add-drop-table -R -E --databases " + Globals._MysqlIdentityDBName + " > {0}", Globals._mysqlIdentityBackupFile);

                    // for compress need to check this setting level from 0 to 9 
                    // ref link https://dev.mysql.com/doc/mysql-enterprise-backup/4.1/en/backup-compression-options.html
                    //--compress--compress - level = 5   

                    File.WriteAllText(@_mysqlIdentityBackupBatchFile, _strIdentity);

                    //Create process start information
                    ProcessStartInfo DBProcessStartInfo = new ProcessStartInfo(@_mysqlIdentityBackupBatchFile)
                    {
                        //The output display window need not be flashed onto the front.
                        WindowStyle = ProcessWindowStyle.Normal,
                        UseShellExecute = false
                    };

                    //Create the process and run it
                    Process dbProcess;
                    dbProcess = Process.Start(DBProcessStartInfo);
                    dbProcess.WaitForExit();
                    if (dbProcess.ExitCode == 0)
                    {
                        //Backup created successfully
                        if (Globals._isCompressedBackup == "1")
                        {
                            Globals._gZipMysqlIdentityBackupFile = Globals._mysqlIdentityBackupFile + Globals._compressedFileExtension;
                            CompressToZipFileAndDeleteOriginal(Globals._mysqlIdentityBackupFile);
                        }
                        Globals.boolMysqlIdentityBackupSuccessful = true;
                    }
                    dbProcess.Close();
                    DateTime _mySQLIdentityBackupEndTime = DateTime.Now;
                    Globals._totalMySQLIdentityBackupTime = _mySQLIdentityBackupEndTime.Subtract(_mySQLIdentityBackupStartTime);
                    Console.WriteLine("Completed Backup for identity database");
                }
                else
                {
                    SetServiceStatusErrorMessage(Globals._mySqlServiceName, scMysqlServiceStatus.Status.ToString());
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
        public static async Task TakeMongoDBBackupAsync()
        {
            try
            {
                ServiceController scMongoDBServiceStatus = new ServiceController(Globals._mongoDBServiceName);

                if (scMongoDBServiceStatus.Status == ServiceControllerStatus.Running)
                {
                    Console.WriteLine("Started Backup for mongo db");
                    DateTime _mongoDBBackupStartTime = DateTime.Now;
                    string _mongoDbDumpExePath = WebConfigurationManager.AppSettings["mongoDbDumpExePath"].ToString(); //"C:\Program Files\MongoDB\Server\4.4\bin\";
                    string _mongoDbHostName = WebConfigurationManager.AppSettings["mongoDbHostName"].ToString();
                    string _mongoDbPort = WebConfigurationManager.AppSettings["mongoDbPort"].ToString();
                    string _mongoDBUserName = WebConfigurationManager.AppSettings["mongoDBUserName"].ToString();
                    string _mongoDBPassword = WebConfigurationManager.AppSettings["mongoDBPassword"].ToString();

                    string _mongoDbBackupBatFilePath = WebConfigurationManager.AppSettings["mongoBackupBatchFile"].ToString();
                    string shellCmd = "\"" + @_mongoDbDumpExePath + "mongodump" + "\"" + " --host " + _mongoDbHostName + " --port " + _mongoDbPort + " --username " + _mongoDBUserName + " --password " + _mongoDBPassword + " --db " + Globals._mongoDbDatabaseName + " --authenticationDatabase admin " + " --out " + "\"" + Globals._backupFolderPath + "\"";

                    File.WriteAllText(@_mongoDbBackupBatFilePath, shellCmd);
                    ProcessStartInfo _mongoDbBackupProcess = new ProcessStartInfo(@_mongoDbBackupBatFilePath)
                    {
                        WindowStyle = ProcessWindowStyle.Normal,
                        UseShellExecute = false
                    };

                    var dbClient = new MongoClient("mongodb://" + _mongoDBUserName + ":" + _mongoDBPassword + "@" + _mongoDbHostName + ":" + _mongoDbPort + "");
                    var dbList = dbClient.ListDatabases().ToList();
                    if (dbList != null && dbList.Count > 0)
                    {
                        foreach (var item in dbList)
                        {
                            Console.WriteLine(item);
                            if (item["name"].AsString == Globals._mongoDbDatabaseName)
                            {
                                //Create the process and run it
                                Process mongodbProcess;
                                mongodbProcess = Process.Start(_mongoDbBackupProcess);
                                mongodbProcess.WaitForExit();
                                if (mongodbProcess.ExitCode == 0)
                                {
                                    //Backup created successfully
                                    Globals.boolMongoBackupSuccessful = true;
                                }
                                mongodbProcess.Close();
                            }
                        }
                    }
                    DateTime _mongoDBBackupEndTime = DateTime.Now;
                    Globals._totalMongoDBBackupTime = _mongoDBBackupEndTime.Subtract(_mongoDBBackupStartTime);
                    Console.WriteLine("Completed Backup for mongo db");
                }
                else
                {
                    SetServiceStatusErrorMessage(Globals._mongoDBServiceName, scMongoDBServiceStatus.Status.ToString());
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
        public static async Task TakeElasticDBBackupAsync()
        {
            try
            {
                ServiceController scElasticSearchServiceStatus = new ServiceController(Globals._elasticsearchServiceName);

                if (scElasticSearchServiceStatus.Status == ServiceControllerStatus.Running)
                {
                    Console.WriteLine("Started Backup for elastic db");
                    DateTime _elasticBackupStartTime = DateTime.Now;
                    string elasticCreateBackupAPIUrl = WebConfigurationManager.AppSettings["elasticCreateBackupAPIUrl"].ToString();

                    string repositoryName = string.Format("{0:MMddyyyy}", Globals._today);
                    string backupName = string.Format("{0:MMddyyyy}", Globals._today);
                    string destDirName = string.Format(@"{0}{1:MMddyyyy}\{2:MMddyyyyHHmmss}\Elastic\{3:MMddyyyy}", Globals._scanDocuFilePath, Globals._today, Globals._today, Globals._today);
                    //BackupAPICall(_today, _scanDocuFilePath).Wait();
                    HttpResponseMessage elasticBackupResponse = BackupAPICall(Globals._today, Globals._elasticIndicesName, destDirName, ref Globals._errorStackTrace);
                    if (elasticBackupResponse != null && elasticBackupResponse.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        Globals.boolElasticSearchBackupSuccessful = true;
                        Globals._elasticBackupFile = destDirName;
                    }
                    DateTime _elasticBackupEndTime = DateTime.Now;
                    Globals._totalElasticBackupTime = _elasticBackupEndTime.Subtract(_elasticBackupStartTime);
                    Console.WriteLine("Completed Backup for elastic db");
                }
                else
                {
                    SetServiceStatusErrorMessage(Globals._elasticsearchServiceName, scElasticSearchServiceStatus.Status.ToString());
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
        public static void TakeCopyFolderOnDriveAsync()
        {
        }

        public static void DeleteOldBackupFolders(string pBackupPath, int pOldBackupDays, ref string _errorStackTrace)
        {
            var deleteFilePath = string.Empty;
            try
            {
                if (Directory.Exists(pBackupPath))
                {
                    DirectoryInfo dir = new DirectoryInfo(pBackupPath);
                    var dirTemp = dir.GetDirectories();
                    foreach (var dirInfo in dirTemp)
                    {
                        TimeSpan difference = DateTime.Now - dirInfo.CreationTime;
                        if (difference.Days > pOldBackupDays)
                        {
                            deleteFilePath = dirInfo.FullName;
                            Directory.Delete(dirInfo.FullName, true);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
                _errorStackTrace += string.Format("<br/><br/>{0}<br/>{1}<br/>{2}", deleteFilePath, ex.Message, ex.StackTrace);
            }
        }

        public static string GetConvertedSize(double sizeInMB)
        {
            if (sizeInMB >= 1024)
            {
                return Math.Round((sizeInMB / 1024), 2) + " GB";
            }
            else
            {
                return Math.Round((sizeInMB > 0 ? sizeInMB : 0), 2) + " MB";
            }
        }

        public static void SaveErrorLog(Exception ex)
        {
            try
            {
                string _ErrorLogFilePath = WebConfigurationManager.AppSettings["ErrorLogFilePath"].ToString();
                //Console.WriteLine(ex.Message.ToString() + "" + ex.StackTrace.ToString());
                string strLogText = ex.Message.ToString();
                if (ex.StackTrace != null)
                {
                    strLogText = strLogText + "" + ex.StackTrace.ToString();
                }

                // Create a writer and open the file:
                StreamWriter log;

                if (!File.Exists(_ErrorLogFilePath))
                {
                    log = new StreamWriter(_ErrorLogFilePath);
                }
                else
                {
                    log = File.AppendText(_ErrorLogFilePath);
                }

                // Write to the file:
                log.WriteLine(DateTime.Now);
                log.WriteLine(strLogText);
                log.WriteLine();

                // Close the stream:
                log.Close();
            }
            catch (Exception)
            {
                //intentionaly left blank, if error come while save log then it will not disturb other routine
            }
        }

        private static HttpResponseMessage BackupAPICall(DateTime _today, string elasticIndicesName, string destDirName, ref string _errorStackTrace)
        {
            string elasticCreateBackupAPIUrl = WebConfigurationManager.AppSettings["elasticCreateBackupAPIUrl"].ToString();
            //string elasticIndicesName = WebConfigurationManager.AppSettings["elasticIndicesName"].ToString();
            string publishMode = WebConfigurationManager.AppSettings["publishMode"].ToString();

            string repositoryName = publishMode + string.Format("{0:MMddyyyyHHmmss}", _today);
            string backupName = publishMode + string.Format("{0:MMddyyyyHHmmss}", _today);
            HttpClient client = new HttpClient();
            var backupModel = new
            {
                IndicesName = elasticIndicesName,
                RepositoryName = repositoryName,
                BackupName = backupName,
                BackupFolderName = backupName
            };
            var dataAsString = JsonConvert.SerializeObject(backupModel);
            var content = new StringContent(dataAsString);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var response = client.PostAsync(elasticCreateBackupAPIUrl, content).Result;
            if (response != null)
            {
                Console.WriteLine("Elastic Backup Response:" + response.Content.ReadAsStringAsync().Result);
            }
            var elasticBackUpPath = WebConfigurationManager.AppSettings["elasticBackUpPath"].ToString();

            var sourceDirName = elasticBackUpPath + backupName;
            //string _scanDocuFilePath = WebConfigurationManager.AppSettings["BackupFolder"].ToString();

            var timeoutForCopyBackupFolder = WebConfigurationManager.AppSettings["timeoutForCopyBackupFolder"].ToString();

            Thread.Sleep(int.Parse(timeoutForCopyBackupFolder));
            DirectoryCopy(sourceDirName, destDirName, true, ref _errorStackTrace);
            try
            {
                foreach (string folder in Directory.GetDirectories(sourceDirName))
                {
                    Directory.Delete(folder, true);
                }
                Directory.Delete(sourceDirName, true);
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            };
            return response;
        }

        private static Boolean BackUpFolderCopy(string _psFilePath, string _uploadFolderBackupFile, DateTime _today, ref string _errorStackTrace)
        {
            try
            {
                DirectoryCopy(_psFilePath, _uploadFolderBackupFile, true, ref _errorStackTrace);
                return true;
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
                return false;
            }
        }

        private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs, ref string _errorStackTrace)
        {
            try
            {
                // Get the subdirectories for the specified directory.
                DirectoryInfo dir = new DirectoryInfo(sourceDirName);

                if (!dir.Exists)
                {
                    throw new DirectoryNotFoundException(
                        "Source directory does not exist or could not be found: "
                        + sourceDirName);
                }
                DirectoryInfo[] dirs = dir.GetDirectories();
                // If the destination directory doesn't exist, create it.
                if (!Directory.Exists(destDirName))
                {
                    Directory.CreateDirectory(destDirName);
                }

                // Get the files in the directory and copy them to the new location.
                FileInfo[] files = dir.GetFiles();
                foreach (FileInfo file in files)
                {
                    string temppath = Path.Combine(destDirName, file.Name);
                    file.CopyTo(temppath, false);
                }

                // If copying subdirectories, copy them and their contents to new location.
                if (copySubDirs)
                {
                    foreach (DirectoryInfo subdir in dirs)
                    {
                        string temppath = Path.Combine(destDirName, subdir.Name);
                        DirectoryCopy(subdir.FullName, temppath, copySubDirs, ref _errorStackTrace);
                    }
                }
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
                _errorStackTrace = _errorStackTrace + string.Format("<br/><br/>{0}<br/>{1}", ex.Message, ex.StackTrace);
            }
        }


        //Get Time in Text
        private static string GetTimeInText(TimeSpan time)
        {
            string _timeSuffix = "";
            if (time != null)
            {
                _timeSuffix += time.Hours > 0 ? (time.Hours.ToString() + " Hours ") : "";
                _timeSuffix += time.Minutes > 0 ? (time.Minutes.ToString() + " Minutes ") : "";
                _timeSuffix += time.Seconds > 0 ? (time.Seconds.ToString() + " Seconds ") : "";
            }
            return _timeSuffix;
        }


        //Get Directory Size in MB
        private static double GetDirectorySize(string path)
        {
            long size = 0;
            var dirInfo = new DirectoryInfo(path);
            if (dirInfo.Exists)
            {
                foreach (FileInfo fi in dirInfo.GetFiles("*", SearchOption.AllDirectories))
                {
                    size += fi.Length;
                }
            }
            return Math.Round(((double)size / 1024 / 1024), 2);
        }

        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        public static void CompressToZipFileAndDeleteOriginal(string pathWithFileName)
        {
            try
            {
                string sZipped = pathWithFileName + Globals._compressedFileExtension;
                // 1
                // Initialize process information.
                //
                ProcessStartInfo p = new ProcessStartInfo
                {
                    FileName = Globals._7ZipExeFilePath,

                    // 2
                    // Use 7-zip
                    // specify a=archive and -tgzip=gzip
                    // and then target file in quotes followed by source file in quotes
                    //
                    Arguments = "a -t7z \"" + sZipped + "\" \"" + pathWithFileName,
                    WindowStyle = ProcessWindowStyle.Hidden
                };

                // 3.
                // Start process and wait for it to exit
                //
                Process x = Process.Start(p);
                x.WaitForExit();
                File.Delete(pathWithFileName);
            }
            catch (Exception ex)
            {
                SaveErrorLog(ex);
            }
        }
    }
}
