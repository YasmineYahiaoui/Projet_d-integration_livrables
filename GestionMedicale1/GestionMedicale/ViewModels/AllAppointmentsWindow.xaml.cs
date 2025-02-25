using GestionMedicale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace GestionMedicale
{
    /// <summary>
    /// Interaction logic for AllAppointmentsWindow.xaml
    /// </summary>
    public partial class AllAppointmentsWindow : Window
    {

        private MyDbContext _context;

        public AllAppointmentsWindow()
        {
            InitializeComponent();
            LoadAppointments();
        }

        private void LoadAppointments()
        {
            AppointmentsListBox.ItemsSource = AddClientWindow.Clients
                .SelectMany(c => c.Appointments.Select(a => new
                {
                    FullInfo = $"{c.FirstName} {c.LastName} - {a.Date.ToShortDateString()} {a.Time} - {a.Duration} mins"
                }))
                .OrderBy(a => a.FullInfo)
                .ToList();
        }
    }
}
