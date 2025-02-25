using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionMedicale.Models
{
    public class Client
    {
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
