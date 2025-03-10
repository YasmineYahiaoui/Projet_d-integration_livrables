# MRMS - Medical Record Management System

## Introduction
L'application **MRMS** (Medical Record Management System) est conçue pour faciliter la gestion des patients et des rendez-vous médicaux.

### Types d'utilisateurs
- **Administrateur** : Accès à toutes les fonctionnalités sauf la gestion des paramètres des patients.
- **Médecin** : Accès à toutes les fonctionnalités y compris la gestion des paramètres des patients.

---

## Connexion

### Étapes pour se connecter
1. Accéder à la page de connexion.
2. Saisir les informations d'identification :
   - **Administrateur** : Nom d'utilisateur `admin` et mot de passe `mdp123`.
   - **Médecin** : Nom d'utilisateur `medecin` et mot de passe `mdc123`.
3. Si les identifiants sont corrects, l'utilisateur est redirigé vers le tableau de bord.
4. En cas d'erreur, un message "Incorrect username or password" s'affiche.

---

## Interface et Navigation
L'interface principale contient un menu latéral avec les options suivantes :
- **Tableau de bord** : Affiche les statistiques générales, ajout/suppression de clients.
- **Gestion des patients** : Accessible selon le rôle utilisateur.
- **Paramètres des rendez-vous** : Gestion des notifications et de la planification.
- **FAQ** : Informations générales sur l'application.
- **Déconnexion** : Quitter la session.

---

## Fonctionnalités selon le rôle

### Accès Administrateur
- Accès au **Tableau de bord**.
- Accès à **Gestion des patients** (uniquement pour la gestion des rendez-vous).
- Accès aux **Paramètres des rendez-vous**.
- Accès à la **FAQ**.
- Possibilité d'ajouter des clients.

### Accès Médecin
- Accès au **Tableau de bord**.
- Accès complet à la **Gestion des patients** (ajout/modification des informations médicales, contacts, type de patient, etc.).
- Accès aux **Paramètres des rendez-vous**.
- Accès à la **FAQ**.
- Possibilité d'ajouter des clients.

---

## Gestion des Patients

### Pour le Médecin
1. Accéder à **Gestion des patients**.
2. Modifier les informations des patients (type, contacts, notes médicales, etc.).
3. Enregistrer les modifications.

### Pour l'Administrateur
1. Accéder à **Gestion des patients**.
2. Gérer uniquement les rendez-vous.
3. Planifier, modifier ou annuler un rendez-vous.

---

## Gestion des Rendez-vous
1. Accéder aux **Paramètres des rendez-vous**.
2. Sélectionner les notifications (Email, SMS).
3. Choisir une date et une heure.
4. Définir la durée du rendez-vous.
5. Enregistrer les informations.
6. Accéder à la liste des rendez-vous.

---

## FAQ et Assistance
1. Accéder à la **FAQ** via le menu.
2. Consulter les questions fréquentes.
3. Soumettre une nouvelle question si nécessaire.

---

## Déconnexion
1. Cliquer sur **Déconnexion** dans le menu latéral.
2. L'utilisateur est redirigé vers la page de connexion.

---

## Base de Données et Backend

### Technologie utilisée
L'application **MRMS** utilise **SQLite** pour stocker les informations des patients, rendez-vous et utilisateurs.

### Structure de la base de données
La base de données est composée des tables suivantes :
- **Clients** : Stocke les informations des patients (nom, prénom, email, téléphone, type, langue, etc.).
- **Appointments** : Gère les rendez-vous programmés.
- **Roles** : Définit les rôles (Administrateur, Médecin).
- **Utilisateurs** : Stocke les identifiants et mots de passe des utilisateurs.

### Consultation et Gestion des Données
- Ajouter/modifier un patient.
- Planifier et gérer les rendez-vous.
- Gérer les rôles et utilisateurs.
- Supprimer un client.

---

## Conclusion
L'application **MRMS** permet une gestion efficace des patients et des rendez-vous. 
- **Médecins** : Accès complet aux dossiers patients.
- **Administrateurs** : Gestion des rendez-vous uniquement.

Pour toute question ou assistance, consultez la **FAQ** ou contactez le support technique.

## Technologies utilisées
- **Langage** : C#
- **Framework** : WPF (Windows Presentation Foundation)
- **Base de données** : SQLite / SQL Server
- **ORM** : Entity Framework Core

---

## Installation et exécution

### 1️⃣ Prérequis

- **Visual Studio**
- **Base de données SQLite ou SQL Server**

### 2️⃣ Cloner le projet

