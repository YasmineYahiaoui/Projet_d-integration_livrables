using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionMedicale.Migrations
{
    /// <inheritdoc />
    public partial class CreateClientsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
           name: "Clients",
           columns: table => new
           {
               Id = table.Column<int>(nullable: false)
                   .Annotation("Sqlite:Autoincrement", true),
               FirstName = table.Column<string>(nullable: true),
               LastName = table.Column<string>(nullable: true),
               Email = table.Column<string>(nullable: true),
               Phone = table.Column<string>(nullable: true),
               PatientType = table.Column<string>(nullable: true),
               Language = table.Column<string>(nullable: true),
               DoctorNotes = table.Column<string>(nullable: true)
           },
           constraints: table =>
           {
               table.PrimaryKey("PK_Clients", x => x.Id);
           });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
           name: "Clients");
        }
    }
}
