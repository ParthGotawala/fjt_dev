using MySql.Data.Entity;
using System.Data.Entity;

namespace FJT.Reporting.Models
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class FJTSqlDBContext : DbContext
    {
        public FJTSqlDBContext()
              : base("FJT")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

        }
    }
}