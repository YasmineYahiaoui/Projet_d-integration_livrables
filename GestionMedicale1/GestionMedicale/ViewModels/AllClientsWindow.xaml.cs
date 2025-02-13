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

    public partial class AllClientsWindow : Window
    {
        public AllClientsWindow()
        {
            InitializeComponent();
            LoadClients();
        }

        private void LoadClients()
        {
            ClientsListBox.ItemsSource = AddClientWindow.Clients.Select(c => new
            {
                FullInfo = $"{c.FirstName} {c.LastName} - {c.PatientType}"
            }).ToList();
        }
    }
}
