using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportDesigner.MySqlDBModel
{
    public class FJTSqlDBContext : DbContext
    {
        public FJTSqlDBContext(DbContextOptions<FJTSqlDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<entity> entity { get; set; }        
        public virtual DbSet<genericcategory> genericcategory { get; set; }
        public virtual DbSet<reportmaster> reportmaster { get; set; }
        public virtual DbSet<report_parameter_setting_mapping> report_parameter_setting_mapping { get; set; }
        public virtual DbSet<report_change_logs> report_change_logs { get; set; }
        public virtual DbSet<users> users { get; set; }
        public virtual DbSet<reportviewerparameter> reportviewerparameter { get; set; }
        public virtual DbSet<reportmasterparameter> reportmasterparameter { get; set; }
        public virtual DbSet<FixedEntityDataelement> FixedEntityDataelements { get; set; }
        public virtual DbSet<Systemconfigrations> Systemconfigrations { get; set; }
    }
}
