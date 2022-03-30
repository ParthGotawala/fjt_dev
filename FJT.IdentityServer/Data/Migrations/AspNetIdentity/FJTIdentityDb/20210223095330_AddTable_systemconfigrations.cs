using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FJT.IdentityServer.Data.Migrations.AspNetIdentity.FJTIdentityDb
{
    public partial class AddTable_systemconfigrations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "systemconfigrations",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    key = table.Column<string>(maxLength: 100, nullable: true),
                    values = table.Column<string>(maxLength: 500, nullable: true),
                    clusterName = table.Column<string>(maxLength: 50, nullable: true),
                    isEncrypted = table.Column<bool>(nullable: true),
                    isActive = table.Column<bool>(nullable: true),
                    isDeleted = table.Column<bool>(nullable: true),
                    createdBy = table.Column<string>(maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    updatedBy = table.Column<string>(maxLength: 255, nullable: true),
                    updatedAt = table.Column<DateTime>(nullable: false),
                    deletedBy = table.Column<string>(maxLength: 255, nullable: true),
                    deletedAt = table.Column<DateTime>(nullable: true),
                    isEditable = table.Column<bool>(nullable: false),
                    description = table.Column<string>(maxLength: 5000, nullable: true),
                    displayName = table.Column<string>(maxLength: 500, nullable: true),
                    createByRoleId = table.Column<int>(nullable: true),
                    updateByRoleId = table.Column<int>(nullable: true),
                    deleteByRoleId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_systemconfigrations", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_systemconfigrations_key",
                table: "systemconfigrations",
                column: "key",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "systemconfigrations");
        }
    }
}
