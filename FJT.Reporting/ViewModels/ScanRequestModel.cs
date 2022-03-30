namespace FJT.Reporting.ViewModels
{
    public class ScanRequestModel
    {
        public string connectionType { get; set; }
        public string ipAddress { get; set; }
        public string nodename { get; set; }
        public string usbModelName { get; set; }
        public bool skipBlankPage { get; set; }
        public int skipBlankPageLevel { get; set; }
        public bool scanDocument { get; set; }
        public string size { get; set; }
        public string color { get; set; }
        public string resolution { get; set; }
        public string scanSide { get; set; }
        public string filePrefix { get; set; }
        public int refTransID { get; set; }
    }
}