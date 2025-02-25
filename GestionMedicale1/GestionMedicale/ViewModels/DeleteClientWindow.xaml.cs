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
    /// Interaction logic for DeleteClientWindow.xaml
    /// </summary>
    public partial class DeleteClientWindow : Window
    {
        public DeleteClientWindow()
        {
            InitializeComponent();
            LoadClients();
        }

        private void LoadClients()
        {
            using (var context = new MyDbContext())
            {
                ClientsListBox.ItemsSource = context.Clients
                    .Select(c => $"{c.FirstName} {c.LastName} ({c.Email})")
                    .ToList();
            }
        }


        private void DeleteClientButton_Click(object sender, RoutedEventArgs e)
        {
            var selectedClient = ClientsListBox.SelectedItem as string;
            if (selectedClient != null)
            {
                using (var context = new MyDbContext())
                {
                    // Chercher le client dans la base de données
                    var client = context.Clients
                        .FirstOrDefault(c => $"{c.FirstName} {c.LastName} ({c.Email})" == selectedClient);

                    if (client != null)
                    {
                        // Supprimer le client
                        context.Clients.Remove(client);
                        context.SaveChanges();

                        LoadClients();  // Recharger la liste des clients
                        MessageBox.Show("Client deleted!");
                    }
                }

            }
 

        }
}    }


