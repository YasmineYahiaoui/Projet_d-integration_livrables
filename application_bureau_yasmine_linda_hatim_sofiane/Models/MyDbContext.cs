using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace application_bureau_yasmine_linda_hatim_sofiane
{
    public class MyDbContext
    {
        public DbSet<Client> Clients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Role> Roles { get; set; }

      
    }
}
