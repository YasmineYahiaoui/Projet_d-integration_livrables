using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionMedicale.Models
{
    public class Utilisateur
    {
        public int Id { get; set; } // Clé primaire
        public string Username { get; set; } // Nom d'utilisateur
        public string Password { get; set; } 
        public string Email { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public Utilisateur() { }
    }
}
