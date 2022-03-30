using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace FJT.Reporting.Repository
{
    public class AgreementRepository : Repository<Agreement>, IAgreementRepository
    {
        public AgreementRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        
    }
}