using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

delegate void delReaderCallback(string evnt, Object value, Object obj);

internal class WACallback
    {
    internal delReaderCallback callback = null;
    internal Object obj = null;
    internal bool isAsync = false;
    internal Object call(string evnt, Object value)
        {
        if (callback != null)
            callback(evnt, value, obj);
        return null;
        }
    }

public class WABarcodeReader
    {
    string _serverUrl = "wabr.inliteresearch.com";
    string _authorization = "";

    internal delReaderCallback diagCallback = null;
    internal string _image = "";

    WABarcode[] _barcodes = new WABarcode[] { };
    string _error = "";

    void _ReaderCallback(string evnt, Object value, Object obj)
        {
        if (value == null || obj == null) return;
        WABarcodeReader wabr = (WABarcodeReader)obj;
        if (evnt == "error")
            wabr._error = value.ToString();
        else if (evnt == "barcodes")
            wabr._barcodes = (WABarcode[])value;
        if (diagCallback != null)
            diagCallback(evnt, value, _image);
        return;
        }

    public WABarcodeReader(string serverUrl, string authorization = "")
        {
        _serverUrl = serverUrl;
        _authorization = authorization;
        }


    public static string validtypes = "1d,Code39,Code128,Code93,Codabar,Ucc128,Interleaved2of5," +
                                      "Ean13,Ean8,Upca,Upce," +
                                      "2d,Pdf417,DataMatrix,QR," +
                                      "DrvLic," +
                                      "postal,imb,bpo,aust,sing,postnet," +
                                      "Code39basic,Patch";

    public string types = "";
    public string directions = "";
    public uint tbr_code = 0;


    internal WABarcode[] Read(string image, string types = "", string directions = "", uint tbr_code = 0)
        {
        ReadAsync(image, null, null, types, directions, tbr_code);
        if (_error != "")
            throw new Exception(_error);
        return _barcodes;

        }

    internal void ReadAsync(string image, delReaderCallback callback, Object obj, string types = "", string directions = "", uint tbr_code = 0)
        {
        _barcodes = new WABarcode[] { };
        _error = "";

        WACallback cb = new WACallback();
        if (callback != null)
            {
            cb.callback = callback;
            cb.obj = obj;
            cb.isAsync = true;
            }
        else
            {
            cb.callback = _ReaderCallback;
            cb.obj = this;
            cb.isAsync = false;
            }
        _image = image;
        cb.call("image", image);

        string[] names = image.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
        List<string> urls = new List<string>(), files = new List<string>(), images = new List<string>();
        foreach (string name1 in names)
            {
            string name = name1.Trim();
            string s = name.ToLower();
            if (s.StartsWith("http://") || s.StartsWith("https://") || s.StartsWith("ftp://") || s.StartsWith("file://"))
                urls.Add(name);
            else if (File.Exists(name))
                files.Add(name);
            else if (name.StartsWith("data:") || WAUtils.isBase64(name))
                images.Add(name);
            else
                throw new Exception("Invalid image source: " + name.Substring(0, Math.Min(name.Length, 256)));
            }



        ReadLocal(urls, files, images, types, directions, tbr_code, cb);
        }

    public static WABarcode[] ParseResponse(string txtResponse)
        {
        List<WABarcode> barcodes = new List<WABarcode>();
        if (txtResponse.StartsWith("<"))
            {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(txtResponse);
            foreach (XmlNode nodeBarcode in doc.DocumentElement.SelectNodes("//Barcode"))
                {
                WABarcode barcode = new WABarcode();
                barcode.Text = WAUtils.nodeValue(nodeBarcode, "Text", "");
                barcode.Left = WAUtils.nodeValue(nodeBarcode, "Left", 0);
                barcode.Right = WAUtils.nodeValue(nodeBarcode, "Right", 0);
                barcode.Top = WAUtils.nodeValue(nodeBarcode, "Top", 0);
                barcode.Bottom = WAUtils.nodeValue(nodeBarcode, "Bottom", 0);
                barcode.Length = WAUtils.nodeValue(nodeBarcode, "Length", 0);
                barcode.Data = WAUtils.decodeBase64(WAUtils.nodeValue(nodeBarcode, "Data", ""));
                barcode.Page = WAUtils.nodeValue(nodeBarcode, "Page", 0);
                barcode.File = WAUtils.nodeValue(nodeBarcode, "File", "");
                barcode.Meta = WAUtils.nodeToXmlDocument(nodeBarcode, "Meta");

                barcode.Type = WAUtils.nodeValue(nodeBarcode, "Type", "");
                barcode.Rotation = WAUtils.nodeValue(nodeBarcode, "Rotation", "");

                XmlDocument docValues = WAUtils.nodeToXmlDocument(nodeBarcode, "Values");
                if (docValues != null)
                    {
                    foreach (XmlNode node in docValues.DocumentElement.ChildNodes)
                        barcode.Values.Add(node.Name, node.InnerText);
                    }

                barcodes.Add(barcode);
                }
            }
        return barcodes.ToArray();
        }



    void ReadLocal(List<string> urls, List<string> files, List<string> images, string types_, string dirs_, uint tbr_, WACallback cb)
        {
        string server = _serverUrl;
        if (server == "")
            server = "https://wabr.inliteresearch.com"; // default server
        Dictionary<string, string> queries = new Dictionary<string, string>();

        string url = "";
        foreach (string s in urls)
            {
            if (url != "") url += "|";
            url += s;
            }
        if ("url" != "")
            queries.Add("url", url);

        string image = "";
        foreach (string s in images)
            {
            if (image != "") image += "|";
            image += s;
            }
        if ("image" != "")
            queries.Add("image", image);

        queries.Add("format", "xml");
        queries.Add("fields", "meta");
        if (types_ != "")
            queries.Add("types", types_);
        if (dirs_ != "")
            queries.Add("options", dirs_);
        if (tbr_ != 0)
            queries.Add("tbr", tbr_.ToString());

        string serverUrl = String.Format("{0}/barcodes", server);
        WAHttpRequest http = new WAHttpRequest();

        http.ExecRequest(serverUrl, _authorization, files, queries, cb);
        }
    }

/// <summary>
///    Web API  Barcode class
/// </summary>
public class WABarcode
    {
    public WABarcode()
        {
        Values = new Dictionary<string, string>();
        }
    /// <summary>
    /// Barcode data as a string 
    /// </summary>
    public string Text
    { get; set; }
    /// <summary>
    /// Barcode data as a byte array 
    /// </summary>
    public byte[] Data
    { get; set; }

    /// <summary>
    /// Barcode type (symbology) 
    /// </summary>
    public string Type
    { get; set; }

    /// <summary>
    /// Length of barcode data 
    /// </summary>
    public int Length
    { get; set; }

    /// <summary>
    /// Page number in the image file containing the barcode
    /// </summary>
    public int Page
    { get; set; }

    /// <summary>
    /// Direction of the barcode rotation on an image 
    /// </summary>
    public string Rotation
    { get; set; }

    /// <summary>
    /// Left coordinate of enclosing rectangle
    /// </summary>
    public int Left
    { get; set; }

    /// <summary>
    /// Top coordinate of enclosing rectangle
    /// </summary>
    public int Top
    { get; set; }

    /// <summary>
    /// Right coordinate of enclosing rectangle
    /// </summary>
    public int Right
    { get; set; }

    /// <summary>
    /// Bottom coordinate of enclosing rectangle
    /// </summary>
    public int Bottom
    { get; set; }


    /// <summary>
    /// Name of the image file containing the barcode. 
    /// </summary>
    public string File
    { get; set; }


    /// <summary>
    /// Barcode reference information  (XML-formatted)
    /// </summary>
    public XmlDocument Meta
    { get; set; }

    /// <summary>
    ///  Decoded Values (e.g. Driver License/ID Data)
    /// </summary>
    public Dictionary<string, string> Values
    { get; set; }

    }


internal class WAHttpRequest
    {
    internal static int _timeoutSec = 0;
    internal static string _method = "post";  // gen be "get", "post", "postenc"


    private string procWebException(WebException e, WACallback cb)
        {
        string err = "";
        using (WebResponse response = e.Response)
            {
            HttpWebResponse result = (HttpWebResponse)response;
            if (result != null)
                err = "HttpError " + ((int)result.StatusCode).ToString() + ".  " + result.StatusDescription;
            else
                err = "ResponseError: " + e.Message;
            cb.call("response", err);
            if (response != null)
                {
                // WAUtils.printLine("Error code: {0}", httpResponse.StatusCode);
                using (Stream data = response.GetResponseStream())
                    if (data != null)
                        using (var reader = new StreamReader(data))
                            {
                            string message = reader.ReadToEnd();
                            if (!message.StartsWith("<!DOCTYPE")) // Do not display HTML message
                                err += ".  " + message;
                            }
                }
            }
        return err;
        }

    private string procWebResponse(HttpWebResponse result, WACallback cb)
        {
        try
            {
            cb.call("response", result);
            using (Stream stream = result.GetResponseStream())
                {
                using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
                    {
                    string txtResponse = reader.ReadToEnd();
                    return txtResponse;
                    }
                }
            }
        finally
            {
            result.Close();
            }
        }

    private async Task performRequest(string url, string auth, string method, string type, byte[] data, WACallback cb, int retries)
        {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        if (auth == null) auth = "";
        if (auth == "")
            {
            string env = Environment.GetEnvironmentVariable("WABR_AUTH");
            if (env != null) auth = env;
            }

        request.Method = method;
        if (type != "")
            request.ContentType = type;
        if (auth != "")
            request.Headers.Add("Authorization", auth);
        try
            {
            if (_timeoutSec != 0) // default is 100sec
                request.Timeout = _timeoutSec * 1000;

            if (data != null)
                {
                try
                    {
                    request.ContentLength = data.Length;
                    if (cb.isAsync)
                        using (Stream stream = await request.GetRequestStreamAsync())
                            {
                            stream.Write(data, 0, data.Length);
                            stream.Close();
                            }
                    else
                        using (Stream stream = request.GetRequestStream())
                            {
                            stream.Write(data, 0, data.Length);
                            stream.Close();
                            }
                    }
                catch (Exception ex)
                    {
                    string err = "RequestError: " + ex.Message;
                    cb.call("error", err);
                    }
                }
            HttpWebResponse result = null;
            if (cb.isAsync)
                result = (HttpWebResponse)(await request.GetResponseAsync());
            else
                result = (HttpWebResponse)(request.GetResponse());
            string txtResponse = procWebResponse(result, cb);
            WABarcode[] barcodes = WABarcodeReader.ParseResponse(txtResponse);
            cb.call("barcodes", barcodes);
            }
        catch (Exception ex)
            {
            WebException e = null;
            if (ex is WebException) e = (WebException)ex;
            else if (ex.InnerException is WebException) e = (WebException)ex.InnerException;
            string err = ""; // getResponse (request);
            if (e != null)
                {
                // Receive failure can be result of Server closing without notifying connection
                // e.g. if Server stopped than started or W3WP.exe was killed  
                if (e.Status == WebExceptionStatus.KeepAliveFailure && retries < 2)
                    performRequest(url, auth, method, type, data, cb, retries + 1);
                else if (e.Response != null && e.Response.ResponseUri != null &&
                    e.Response.ResponseUri.ToString().ToLower() != url.ToLower() && retries < 3) // Possible redirect retry, e.g using http:// instead of https://
                    performRequest(e.Response.ResponseUri.ToString(), auth, method, type, data, cb, retries + 1);
                else
                    err = procWebException(e, cb);
                }
            else
                {
                err = "FAILURE: " + ex.Message + " {" + ex.GetType().ToString() + "}";
                }
            if (err != "")
                cb.call("error", err);
            }
        }


    private static byte[] GetMultipartFormData(Dictionary<string, string> queries, List<string> files, string boundary)
        {
        Encoding encoding = Encoding.UTF8;
        Stream formDataStream = new System.IO.MemoryStream();
        bool needsCLRF = false;
        foreach (var param in queries)
            {
            if (needsCLRF)
                formDataStream.Write(encoding.GetBytes("\r\n"), 0, encoding.GetByteCount("\r\n"));
            needsCLRF = true;
            string postData = string.Format("--{0}\r\nContent-Disposition: form-data; name=\"{1}\"\r\n\r\n{2}",
                boundary,
                param.Key,
                param.Value);
            formDataStream.Write(encoding.GetBytes(postData), 0, encoding.GetByteCount(postData));
            }

        foreach (var file in files)
            {
            if (needsCLRF)
                formDataStream.Write(encoding.GetBytes("\r\n"), 0, encoding.GetByteCount("\r\n"));
            string header = string.Format("--{0}\r\nContent-Disposition: form-data; name=\"{1}\"; filename=\"{2}\"\r\n\r\n",
                boundary,
                "file",
                Path.GetFileName(file));

            formDataStream.Write(encoding.GetBytes(header), 0, encoding.GetByteCount(header));

            using (FileStream fileStream = new FileStream(file, FileMode.Open, System.IO.FileAccess.Read))
                {
                fileStream.CopyTo(formDataStream);
                }
            }

        // Add the end of the request.  Start with a newline
        string footer = "\r\n--" + boundary + "--\r\n";
        formDataStream.Write(encoding.GetBytes(footer), 0, encoding.GetByteCount(footer));

        // Dump the Stream into a byte[]
        formDataStream.Position = 0;
        byte[] formData = new byte[formDataStream.Length];
        formDataStream.Read(formData, 0, formData.Length);
        formDataStream.Close();

        var request = System.Text.Encoding.Default.GetString(formData); // TEMP  testing

        return formData;
        }
    internal void ExecRequest(string serverUrl, string auth, List<string> files, Dictionary<string, string> queries, WACallback cb = null)
        {
        try
            {

            switch (WAHttpRequest._method)
                {
                case "get":
                        {
                        string query = "";
                        foreach (string key in queries.Keys)
                            {
                            if (key != "image")
                                query += key + "=" + HttpUtility.UrlEncode(queries[key]) + "&";
                            }
                        performRequest(serverUrl + "?" + query, auth, "GET", "", null, cb, 0);

                        }
                    break;
                case "post":
                        {
                        string formDataBoundary = String.Format("----------{0:N}", Guid.NewGuid());
                        byte[] formData = GetMultipartFormData(queries, files, formDataBoundary);
                        performRequest(serverUrl, auth, "POST", "multipart/form-data; boundary=" + formDataBoundary, formData, cb, 0);

                        }
                    break;
                case "postenc":
                        {
                        string query = "";
                        foreach (string key in queries.Keys)
                            query += key + "=" + HttpUtility.UrlEncode(queries[key]) +
                                    "&";
                        byte[] data = Encoding.ASCII.GetBytes(query);
                        performRequest(serverUrl, auth, "POST", "application/x-www-form-urlencoded", data, cb, 0);

                        }
                    break;
                default:
                    string err = "Invalid HTTP method: " + WAHttpRequest._method;
                    cb.call("error", err);
                    break;
                }
            }
        catch (Exception ex)
            {
            cb.call("error", ex.Message);
            }
        }

    }

delegate void delPrintLine(string msg);

internal class WAUtils
    {
    internal static delPrintLine fncPrintLine = null;



    internal static string signature(string image)
        {
        if (image == null || image == "") return "";
        return " [" + image.Substring(0, Math.Min(80, image.Length)) + "] ";
        }

    internal static void printLine(string msg = "")
        {
        if (fncPrintLine != null)
            fncPrintLine(msg);
        }

    internal static string stringAppend(string str, string add, string sep)
        {
        if (sep == "") sep = " ,";
        if (add == "")
            return str;
        else
            {
            string sout = str;
            if (sout != "") sout += sep;
            sout += add;
            return sout;
            }
        }

    internal static string nodeValue(XmlNode nodeParent, string name, string def)
        {
        string sout = def;
        XmlNode node = nodeParent.SelectSingleNode(name);
        if (node != null) sout = node.InnerText;
        return sout;
        }

    internal static string nodeValueXml(XmlNode nodeParent, string name, string def)
        {
        string sout = def;
        XmlNode node = nodeParent.SelectSingleNode(name);
        if (node != null) sout = node.InnerXml;
        return sout;
        }

    internal static int nodeValue(XmlNode nodeParent, string name, int def)
        {
        int nout = def;
        XmlNode node = nodeParent.SelectSingleNode(name);
        if (node != null) Int32.TryParse(node.InnerText, out nout);
        return nout;
        }

    internal static byte[] decodeBase64(string base64)
        {
        if (String.IsNullOrEmpty(base64))
            return null;

        try
        { return Convert.FromBase64String(base64); }
        catch (FormatException)
        { return null; }
        }

    internal static XmlDocument nodeToXmlDocument(XmlNode nodeParent, string name)
        {
        XmlNode node = nodeParent.SelectSingleNode(name);
        if (node == null)
            return null;

        if (String.IsNullOrEmpty(node.InnerXml))
            return null;
        try
            {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(node.InnerXml);
            return doc;
            }
        catch (Exception)
        { return null; }
        }

    internal static string FileToBase64(string file)
        {
        try
            {
            FileStream fs = new FileStream(file, FileMode.Open, FileAccess.Read);
            byte[] filebytes = new byte[fs.Length];
            fs.Read(filebytes, 0, Convert.ToInt32(fs.Length));
            string base64 = Convert.ToBase64String(filebytes, Base64FormattingOptions.InsertLineBreaks);
            string ext = Path.GetExtension(file).Replace(".", "");
            base64 = "data:image/" + ext + ";base64," + base64;
            // Optionally attach suffix with reference file name to be placed in Barcode.File property
            base64 = base64 + ":::" + Path.GetFileName(file);
            return base64;
            }
        catch (Exception ex)
            {
            WAUtils.printLine();
            WAUtils.printLine(ex.Message);
            return "";
            }
        }

    internal static Boolean isBase64(String value) // IsBase64String
        {
        string v = value;
        // replace formating characters
        v = v.Replace("\r\n", "");
        v = v.Replace("\r", "");
        // remove reference file name, if  present
        int ind = v.IndexOf(":::");
        if (ind > 0)
            v = v.Substring(0, ind);

        if (v == null || v.Length == 0 || (v.Length % 4) != 0)
            return false;
        var index = v.Length - 1;
        if (v[index] == '=')
            index--;
        if (v[index] == '=')
            index--;
        for (var i = 0; i <= index; i++)
            if (IsInvalidBase64char(v[i]))
                return false;
        return true;
        }

    private static Boolean IsInvalidBase64char(char value)
        {
        var intValue = (Int32)value;
        if (intValue >= 48 && intValue <= 57)
            return false;
        if (intValue >= 65 && intValue <= 90)
            return false;
        if (intValue >= 97 && intValue <= 122)
            return false;
        return intValue != 43 && intValue != 47;
        }
    }

