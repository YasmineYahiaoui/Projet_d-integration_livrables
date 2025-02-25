using System;
using System.Collections.Generic;
using System.Globalization;
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
using GestionMedicale.Models;

namespace GestionMedicale
{
    /// <summary>
    /// Interaction logic for AddClientWindow.xaml
    /// </summary>
    public partial class AddClientWindow : Window
    {

        public static List<Client> Clients = new List<Client>();
        public AddClientWindow()
        {
            InitializeComponent();
        }

        private void AddClientButton_Click(object sender, RoutedEventArgs e)
        {
            var client = new Client
            {
                FirstName = FirstNameTextBox.Text,
                LastName = LastNameTextBox.Text,
                Email = EmailTextBox.Text,
                Phone = PhoneTextBox.Text
            };

            // Utilisation de DbContext pour ajouter le client à la base de données

            using (var context = new MyDbContext())
            {
                context.Clients.Add(client); // Ajoute le client à la table Clients  
                context.SaveChanges(); // Sauvegarde les modifications dans la base de données
            }

            MessageBox.Show("Client added!");
            this.Close();
        }
            
        public class StringToVisibilityConverter : IValueConverter
        {
            public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
            {
                if (value is string str && !string.IsNullOrEmpty(str))
                {
                    return Visibility.Visible;
                }
                return Visibility.Collapsed; 
            }

            public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            {
                throw new NotImplementedException();
            }
        }
    }
}
