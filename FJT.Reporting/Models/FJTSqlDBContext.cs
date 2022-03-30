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
        public virtual DbSet<SystemConfigrations> SystemConfigrations { get; set; }
        public virtual DbSet<email_schedulemst> email_schedulemst { get; set; }
        public virtual DbSet<Agreement> Agreement { get; set; }

        public override int SaveChanges()
        {
            return base.SaveChanges();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

        }
    }
}