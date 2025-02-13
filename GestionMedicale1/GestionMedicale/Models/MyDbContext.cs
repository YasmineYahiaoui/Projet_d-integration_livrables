using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace GestionMedicale.Models
{
    public class MyDbContext : DbContext
    {
        public DbSet<Client> Clients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = "Data Source=medical_management.db;";
            optionsBuilder.UseSqlite(connectionString);
        }
        

    }
}
