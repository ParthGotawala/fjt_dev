using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Service.Interface
{
    public interface IManufacturerService
    {
        ManufacturerDetail GetManufacturerDetail(ManufacturerRequestModel manufacturerListModel, string APIProjectURL);
        byte[] GetManufacturerDetailReportBytes(ManufacturerDetail manufacturerDetail, ManufacturerRequestModel manufacturerListModel);
    }
}
