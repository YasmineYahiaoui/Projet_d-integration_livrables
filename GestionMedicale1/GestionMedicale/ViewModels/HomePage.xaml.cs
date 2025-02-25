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
    /// Interaction logic for HomePage.xaml
    /// </summary>
    public partial class HomePage : Window
    {
        private User user1;
        public HomePage(User user)
        {
            InitializeComponent();
            user1 = user;
            PatientSettingsButton.Visibility = Visibility.Collapsed;
            AppointmentSettingsButton.Visibility = Visibility.Collapsed;
        }

        private void PatientManagementButton_Click(object sender, RoutedEventArgs e)
        {

            if (user1.role == "admin")
            {
                PatientSettingsButton.Visibility = Visibility.Collapsed;
                AppointmentSettingsButton.Visibility = Visibility.Visible;
            }
            else
            {
                PatientSettingsButton.Visibility = Visibility.Visible;
                AppointmentSettingsButton.Visibility = Visibility.Collapsed;
            }
        }

        private void PatientSettingsButton_Click(object sender, RoutedEventArgs e)
        {

            if (user1.role != "admin")
            {
                MainContentControl.Content = new PatientSettingsPage();
            }
        }

        private void AppointmentSettingsButton_Click(object sender, RoutedEventArgs e)
        {
            if (user1.role == "admin")
            {
                MainContentControl.Content = new AppointmentSettingsPage();
            }

        }

        private void DashboardButton_Click(object sender, RoutedEventArgs e)
        {
            MainContentControl.Content = new Dashboard();
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void FAQ_Click(object sender, RoutedEventArgs e)
        {

            MainContentControl.Content = new faqPage();
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            MainWindow signUpWindow = new MainWindow();
            signUpWindow.Show();
            this.Close();
        }
    }
}
