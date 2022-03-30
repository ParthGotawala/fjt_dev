using MySql.Data.Entity;
using System.Data.Entity;

namespace fjt.pricingservice.MySqlDBModel
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class FJTSqlDBContext : DbContext
    {
        public FJTSqlDBContext()
            : base("FJT")
        {
        }
        public virtual DbSet<rfq_lineitems> rfq_lineitems { get; set; }
        public virtual DbSet<rfq_lineitems_alternatepart> rfq_lineitems_alternetpart { get; set; }
        public virtual DbSet<rfq_assemblies> rfq_assemblies { get; set; }
        public virtual DbSet<rfq_assy_quantity> rfq_assy_quantity { get; set; }
        public virtual DbSet<rfq_assy_quantity_turn_time> rfq_assy_quantity_turn_time { get; set; }
        public virtual DbSet<rfq_assy_autopricingstatus> rfq_assy_autopricingstatus { get; set; }
        public virtual DbSet<rfq_lineitem_autopricingstatus> rfq_lineitem_autopricingstatus { get; set; }
        public virtual DbSet<rfq_assy_bom> rfq_assy_bom { get; set; }
        public virtual DbSet<rfq_consolidated_mfgpn_lineitem> rfq_consolidated_mfgpn_lineitem { get; set; }
        public virtual DbSet<rfq_consolidate_mfgpn_lineitem_quantity> rfq_consolidate_mfgpn_lineitem_quantity { get; set; }
        public virtual DbSet<rfq_consolidated_mfgpn_lineitem_alternate> rfq_consolidated_mfgpn_lineitem_alternate { get; set; }
        public virtual DbSet<rfq_assy_quantity_price_selection_setting> rfq_assy_quantity_price_selection_setting { get; set; }
        public virtual DbSet<genericfiles> genericfiles { get; set; }

        public override int SaveChanges()
        {
            return base.SaveChanges();
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<rfq_lineitems>()
             .HasMany(e => e.rfq_lineitems_alternatepart)
             .WithRequired(e => e.rfq_lineitems)
             .HasForeignKey(e => e.rfqLineItemsID)
             .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assemblies>()
              .HasMany(e => e.rfq_assy_quantity)
              .WithRequired(e => e.rfq_assemblies)
              .HasForeignKey(e => e.rfqAssyID)
              .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assy_quantity>()
              .HasMany(e => e.rfq_assy_quantity_turn_time)
              .WithRequired(e => e.rfq_assy_quantity)
              .HasForeignKey(e => e.rfqAssyQtyID)
              .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assemblies>()
              .HasMany(e => e.rfq_lineitems)
              .WithRequired(e => e.rfq_assemblies)
              .HasForeignKey(e => e.rfqAssyID)
              .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assy_bom>()
              .HasMany(e => e.rfq_lineitems)
              .WithRequired(e => e.rfq_assy_bom)
              .HasForeignKey(e => e.rfqAssyBomID)
              .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assemblies>()
              .HasMany(e => e.rfq_consolidated_mfgpn_lineitem)
              .WithRequired(e => e.rfq_assemblies)
              .HasForeignKey(e => e.rfqAssyID)
              .WillCascadeOnDelete(false);

            //modelBuilder.Entity<rfq_assy_bom>()
            // .HasMany(e => e.rfq_consolidated_mfgpn_lineitem)
            // .WithRequired(e => e.rfq_assy_bom)
            // .HasForeignKey(e => e.rfqAssyBomID)
            // .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_consolidated_mfgpn_lineitem>()
            .HasMany(e => e.rfq_consolidate_mfgpn_lineitem_quantity)
            .WithRequired(e => e.rfq_consolidated_mfgpn_lineitem)
            .HasForeignKey(e => e.consolidateID)
            .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assy_quantity>()
           .HasMany(e => e.rfq_consolidate_mfgpn_lineitem_quantity)
           .WithRequired(e => e.rfq_assy_quantity)
           .HasForeignKey(e => e.qtyID)
           .WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_consolidated_mfgpn_lineitem>()
          .HasMany(e => e.rfq_consolidated_mfgpn_lineitem_alternate)
          .WithRequired(e => e.rfq_consolidated_mfgpn_lineitem)
          .HasForeignKey(e => e.consolidateID)
          .WillCascadeOnDelete(false);

         //   modelBuilder.Entity<rfq_consolidated_mfgpn_lineitem>()
         //.HasMany(e => e.rfq_lineitem_autopricingstatus)
         //.WithRequired(e => e.rfq_consolidated_mfgpn_lineitem)
         //.HasForeignKey(e => e.consolidateID)
         //.WillCascadeOnDelete(false);

            modelBuilder.Entity<rfq_assy_quantity>()
           .HasMany(e => e.rfq_assy_quantity_price_selection_setting)
           .WithRequired(e => e.rfq_assy_quantity)
           .HasForeignKey(e => e.qtyID)
           .WillCascadeOnDelete(false);
        }
    }
}
