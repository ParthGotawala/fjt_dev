using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace FJT.Reporting.Repository
{
    public class ManufacturerRepository : Repository<SystemConfigrations>, IManufacturerRepository
    {
        public ManufacturerRepository(UnitOfWork unitOfWork)
           : base(unitOfWork.Context)
        {
        }
        public ManufacturerDetail GetManufacturerDetail(ManufacturerRequestModel manufacturerListModel, string APIProjectURL)
        {

            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("pFromDate", manufacturerListModel.fromdate),
                  new MySqlParameter("pToDate", manufacturerListModel.todate),
                  new MySqlParameter("pEmployeeID",manufacturerListModel.loginUserEmployeeID),
              };

            ManufacturerDetail ObjManufacturerDetail = new ManufacturerDetail();
            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetManufacturerList";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                ObjManufacturerDetail.ManufacturerDetailResponse = ((IObjectContextAdapter)Context).ObjectContext.Translate<ManufacturerDetailResponse>(reader).ToList();

                reader.NextResult();
                ObjManufacturerDetail.CompanyDetails = ((IObjectContextAdapter)Context).ObjectContext.Translate<Company_Detail>(reader).ToList();


                return ObjManufacturerDetail;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return ObjManufacturerDetail;
            }
            finally
            {
                Context.Database.Connection.Close();
            }

            throw new NotImplementedException();
        }
    }
}