using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application_bureau_yasmine_linda_hatim_sofiane
{
    public class Role
    {
        public int Id { get; set; } // Clé primaire
        public string Name { get; set; } // Exemple : "Médecin", "Administrateur"

        public ICollection<Utilisateur> Users { get; set; } = new List<Utilisateur>();

        public Role() { }
    }
}
