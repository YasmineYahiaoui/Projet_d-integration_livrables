using GestionMedicale.Models;
using System.Configuration;
using System.Data;
using System.Windows;
using GestionMedicale.Models;

namespace GestionMedicale
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            using (var context = new MyDbContext())
            {
             // Crée la base de données si elle n'existe pas
            }
        }




    }




}
