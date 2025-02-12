using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application_bureau_yasmine_linda_hatim_sofiane
{
    public class Appointment
    {
        public int ID { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public int Duration { get; set; }
        public List<string> Notifications { get; set; }
        public Appointment()
        {

        }
    }
}
