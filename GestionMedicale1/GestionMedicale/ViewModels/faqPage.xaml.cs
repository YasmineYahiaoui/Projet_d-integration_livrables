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
    /// Interaction logic for faqPage.xaml
    /// </summary>
    public partial class faqPage : UserControl
    {
        public faqPage()
        {
            InitializeComponent();
        }
        private void NewQuestionTextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (NewQuestionTextBox.Text == "Type your question here...")
            {
                NewQuestionTextBox.Text = string.Empty;
                NewQuestionTextBox.Foreground = Brushes.Black;
            }
        }
        private void NewQuestionTextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(NewQuestionTextBox.Text))
            {
                NewQuestionTextBox.Text = "Type your question here...";
                NewQuestionTextBox.Foreground = Brushes.Gray;
            }
        }
        private void SubmitQuestion_Click(object sender, RoutedEventArgs e)
        {
            string newQuestion = NewQuestionTextBox.Text;

            // Check if the TextBox contains placeholder text before submitting
            if (newQuestion == "Type your question here..." || string.IsNullOrWhiteSpace(newQuestion))
            {
                MessageBox.Show("Please enter a valid question before submitting.", "Input Error", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }
            // Proceed with submission logic
            ConfirmationPage confirmationPage = new ConfirmationPage();
            confirmationPage.Show();

            // Clear the TextBox and restore placeholder text
            NewQuestionTextBox.Text = "Type your question here...";
            NewQuestionTextBox.Foreground = Brushes.Gray;
        }
    }
}
