using FJT.Reporting.Models;
using FJT.Reporting.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FJT.Reporting.Repository.Interface
{
    public interface IManufacturerRepository : IRepository<SystemConfigrations>
    {
        ManufacturerDetail GetManufacturerDetail(ManufacturerRequestModel manufacturerListModel, string APIProjectURL);
    }
}
