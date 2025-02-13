using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using GestionMedicale.Models;
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
    /// Interaction logic for AppointmentSettingsPage.xaml
    /// </summary>
    public partial class AppointmentSettingsPage : UserControl
    {

        public AppointmentSettingsPage()
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

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            var selectedClientEmail = ClientComboBox.SelectedValue as string;
            if (selectedClientEmail != null)
            {
                var client = AddClientWindow.Clients.FirstOrDefault(c => c.Email == selectedClientEmail);
                if (client != null)
                {
                    // SAUVEGUARDAGE
                    var appointment = new Appointment
                    {
                        Date = AppointmentDatePicker.SelectedDate.Value,
                        Time = TimeSpan.Parse(AppointmentTimeTextBox.Text),
                        Duration = int.Parse(DurationTextBox.Text),
                        Notifications = new System.Collections.Generic.List<string>()
                    };
                    if (EmailNotificationCheckBox.IsChecked == true) appointment.Notifications.Add("Email");
                    if (SMSNotificationCheckBox.IsChecked == true) appointment.Notifications.Add("SMS");

                    client.Appointments.Add(appointment);

                    MessageBox.Show("Appointment settings saved!");
                }
            }


        }

        private void ViewAllAppointmentsButton_Click(object sender, RoutedEventArgs e)
        {
            // AFFICHAGE DE TOUT LES CIENTS
            var allAppointmentsWindow = new AllAppointmentsWindow();
            allAppointmentsWindow.Show();
        }
    }
}
