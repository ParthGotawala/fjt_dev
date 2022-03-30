using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FJT.IdentityServer.Data.Migrations.AspNetIdentity.FJTIdentityDb
{
    public partial class AddTableMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "agreement_type",
                columns: table => new
                {
                    agreementTypeID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    agreementType = table.Column<string>(maxLength: 255, nullable: true),
                    isDeleted = table.Column<bool>(nullable: false),
                    createdBy = table.Column<string>(maxLength: 255, nullable: true),
                    updatedBy = table.Column<string>(maxLength: 255, nullable: true),
                    deletedBy = table.Column<string>(maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    updatedAt = table.Column<DateTime>(nullable: true),
                    deletedAt = table.Column<DateTime>(nullable: true),
                    templateType = table.Column<string>(maxLength: 100, nullable: true),
                    createByRole = table.Column<string>(maxLength: 255, nullable: true),
                    updateByRole = table.Column<string>(maxLength: 255, nullable: true),
                    deleteByRole = table.Column<string>(maxLength: 255, nullable: true),
                    purpose = table.Column<string>(maxLength: 1000, nullable: true),
                    where_used = table.Column<string>(maxLength: 1000, nullable: true),
                    displayName = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agreement_type", x => x.agreementTypeID);
                });

            migrationBuilder.CreateTable(
                name: "agreement",
                columns: table => new
                {
                    agreementID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    agreementTypeID = table.Column<int>(nullable: false),
                    agreementContent = table.Column<string>(nullable: true),
                    version = table.Column<int>(nullable: true),
                    system_variables = table.Column<string>(nullable: true),
                    isPublished = table.Column<bool>(nullable: true),
                    publishedDate = table.Column<DateTime>(nullable: true),
                    isDeleted = table.Column<bool>(nullable: false),
                    createdBy = table.Column<string>(maxLength: 255, nullable: true),
                    updatedBy = table.Column<string>(maxLength: 255, nullable: true),
                    deletedBy = table.Column<string>(maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    updatedAt = table.Column<DateTime>(nullable: true),
                    deletedAt = table.Column<DateTime>(nullable: true),
                    agreementSubject = table.Column<string>(maxLength: 250, nullable: true),
                    createByRole = table.Column<string>(maxLength: 250, nullable: true),
                    updateByRole = table.Column<string>(maxLength: 250, nullable: true),
                    deleteByRole = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agreement", x => x.agreementID);
                    table.ForeignKey(
                        name: "FK_agreement_agreement_type_agreementTypeID",
                        column: x => x.agreementTypeID,
                        principalTable: "agreement_type",
                        principalColumn: "agreementTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_agreement",
                columns: table => new
                {
                    userAgreementID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userID = table.Column<string>(maxLength: 255, nullable: true),
                    agreementID = table.Column<int>(nullable: false),
                    agreedDate = table.Column<DateTime>(nullable: true),
                    isDeleted = table.Column<bool>(nullable: false),
                    createdBy = table.Column<string>(maxLength: 255, nullable: true),
                    updatedBy = table.Column<string>(maxLength: 255, nullable: true),
                    deletedBy = table.Column<string>(maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    updatedAt = table.Column<DateTime>(nullable: true),
                    deletedAt = table.Column<DateTime>(nullable: true),
                    createByRole = table.Column<string>(maxLength: 255, nullable: true),
                    updateByRole = table.Column<string>(maxLength: 255, nullable: true),
                    deleteByRole = table.Column<string>(maxLength: 255, nullable: true),
                    signaturevalue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_agreement", x => x.userAgreementID);
                    table.ForeignKey(
                        name: "FK_user_agreement_agreement_agreementID",
                        column: x => x.agreementID,
                        principalTable: "agreement",
                        principalColumn: "agreementID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_agreement_AspNetUsers_userID",
                        column: x => x.userID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_agreement_agreementTypeID",
                table: "agreement",
                column: "agreementTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_user_agreement_agreementID",
                table: "user_agreement",
                column: "agreementID");

            migrationBuilder.CreateIndex(
                name: "IX_user_agreement_userID",
                table: "user_agreement",
                column: "userID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_agreement");

            migrationBuilder.DropTable(
                name: "agreement");

            migrationBuilder.DropTable(
                name: "agreement_type");
        }
    }
}
