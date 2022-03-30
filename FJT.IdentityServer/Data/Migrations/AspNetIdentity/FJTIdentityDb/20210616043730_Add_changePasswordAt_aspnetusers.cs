using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FJT.IdentityServer.Data.Migrations.AspNetIdentity.FJTIdentityDb
{
    public partial class Add_changePasswordAt_aspnetusers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "changePasswordAt",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "changePasswordAt",
                table: "AspNetUsers");
        }
    }
}
