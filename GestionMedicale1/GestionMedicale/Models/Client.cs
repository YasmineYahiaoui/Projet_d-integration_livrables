using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionMedicale.Models
{
    public class Client
    {
        [Key] // Définition de la clé primaire
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PatientType { get; set; }
        public List<string> ContactPreferences { get; set; }
        public string Language { get; set; }
        public string DoctorNotes { get; set; }
        public List<Appointment> Appointments { get; set; } = new List<Appointment>();

    }
}
