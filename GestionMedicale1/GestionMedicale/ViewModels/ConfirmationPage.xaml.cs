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
    /// Interaction logic for ConfirmationPage.xaml
    /// </summary>
    public partial class ConfirmationPage : Window
    {
        public ConfirmationPage()
        {
            InitializeComponent();
        }
        private void ReturnToFAQ_Click(object sender, RoutedEventArgs e)
        {
            this.Close(); // FERME LA FENETRE
        }
    }
}

