using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionMedicale.Models
{
    public class Role
    {
        public int Id { get; set; } // Clé primaire
        public string Name { get; set; } // Exemple : "Médecin", "Administrateur"

        public ICollection<Utilisateur> Users { get; set; } = new List<Utilisateur>();

        public Role() { }
    }
}
