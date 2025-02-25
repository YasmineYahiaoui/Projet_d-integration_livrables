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
    /// Interaction logic for PatientSettingsPage.xaml
    /// </summary>
    public partial class PatientSettingsPage : UserControl
    {
        public PatientSettingsPage()
        {
            InitializeComponent();
            LoadClients();
        }

        private void LoadClients()
        {
            ClientComboBox.ItemsSource = AddClientWindow.Clients.Select(c => new
            {
                FullName = $"{c.FirstName} {c.LastName}",
                c.Email
            }).ToList();
        }

        private void ViewAllClientsButton_Click(object sender, RoutedEventArgs e)
        {
            // Navigate to a new page displaying all clients and their information
            var allClientsWindow = new AllClientsWindow();
            allClientsWindow.Show();
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            var selectedClientEmail = ClientComboBox.SelectedValue as string;
            if (selectedClientEmail != null)
            {
                var client = AddClientWindow.Clients.FirstOrDefault(c => c.Email == selectedClientEmail);
                if (client != null)
                {
                    // Save patient settings to the selected client
                    client.PatientType = (PatientTypeComboBox.SelectedItem as ComboBoxItem)?.Content.ToString();
                    client.ContactPreferences = new List<string>();
                    if (EmailCheckBox.IsChecked == true) client.ContactPreferences.Add("Email");
                    if (SMSCheckBox.IsChecked == true) client.ContactPreferences.Add("SMS");
                    if (PhoneCheckBox.IsChecked == true) client.ContactPreferences.Add("Phone");
                    client.Language = EnglishRadioButton.IsChecked == true ? "English" : "French";
                    client.DoctorNotes = DoctorNotesTextBox.Text;

                    MessageBox.Show("Patient settings saved!");
                }
            }
        }
    }
}  
