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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace GestionMedicale
{
    /// <summary>
    /// Interaction logic for Dashboard.xaml
    /// </summary>
    public partial class Dashboard : UserControl
    {
        public Dashboard()
        {
            InitializeComponent();
            UpdateTotalPatients();
        }

        private void AddClientButton_Click(object sender, RoutedEventArgs e)
        {
            AddClientWindow addClientWindow = new AddClientWindow();
            addClientWindow.ShowDialog();
            UpdateTotalPatients(); // MODIFIER LE NOMBRE DES PATIENTS APRES L AJOUT
        }

        private void DeleteClientButton_Click(object sender, RoutedEventArgs e)
        {
            DeleteClientWindow deleteClientWindow = new DeleteClientWindow();
            deleteClientWindow.ShowDialog();
            UpdateTotalPatients(); // MODIFIER LE NOBRE APRES LA SUPRESSION

        }
        private void UpdateTotalPatients()
        {
            int totalPatients = AddClientWindow.Clients.Count;
            TotalPatientsTextBlock.Text = totalPatients.ToString();
        }
    }
}
