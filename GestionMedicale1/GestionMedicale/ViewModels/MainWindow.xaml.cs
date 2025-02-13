using System.Text;
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

    public class User
    {
        public string userName { get; set; }
        public string password { get; set; }
        public string role { get; set; }

        public User(string userName, string password, string role)
        {
            this.userName = userName;
            this.password = password;
            this.role = role;
        }
    }


    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private List<User> users = new List<User>()
        {
            new User("admin", "mdp123", "admin"),
            new User("medecin", "mdc123", "med")
        };

        private User findUser()
        {
            return users.Find(user => user.userName == txtUser.Text && user.password == txtPassword.Password);
        }

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Connecter_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(txtUser.Text) || string.IsNullOrEmpty(txtPassword.Password))
            {
                infos.Content = "Please fill in all fields";
            }
            else
            {
                // Chercher l'utilisateur dans la liste
                User user = findUser();

                if (user != null)
                {
                    // Si l'utilisateur existe, ouvrir la page d'accueil
                    HomePage homePage = new HomePage(user);
                    this.Close();
                    homePage.Show();
                }
                else
                {
                    // Sinon, afficher un message d'erreur
                    infos.Content = "Incorrect username or password";
                }
            }
        }

        private void login_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}