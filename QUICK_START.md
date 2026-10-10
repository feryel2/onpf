# 🚀 ONPF - Guide de Démarrage Rapide
# ONPF - Quick Start Guide

## ✅ Status Actuel | Current Status

```
Frontend (Angular):
✅ Installation complétée
✅ Serveur de développement en cours de démarrage
   👉 Accessible à: http://localhost:4200
   ⏳ Compilation en cours (1-2 minutes)

Backend (Spring Boot):
❌ Nécessite Maven (À INSTALLER)
📦 Toute l'infrastructure est prête

Base de Données:
⏳ À INITIALISER
   Commande: mysql -u root -p < database/schema.sql
```

---

## 📋 Étapes Suivantes

### 1️⃣ ATTENDRE LA COMPILATION ANGULAR (En cours)
- La fenêtre du navigateur s'ouvrira automatiquement
- L'application sera visible sur http://localhost:4200
- Vous pourrez vous connecter avec:
  ```
  Username: editor_user
  Password: password
  ```

### 2️⃣ INITIALISER LA BASE DE DONNÉES (Après Angular)
Ouvrez une **NOUVELLE fenêtre PowerShell** et exécutez:
```powershell
cd c:\xampp\htdocs\onpf

# S'assurer que MySQL est démarré dans XAMPP Control Panel

# Puis exécuter:
cmd /c "set PATH=C:\xampp\mysql\bin;%PATH% && mysql -u root < database/schema.sql"
```

Vous devriez voir:
```
Query OK, 0 rows affected
Query OK, 1 row affected
...
```

Si la base `onpf_db` a déjà été créée avant l'ajout des champs cadastraux, exécutez une seule fois la migration :
```powershell
cmd /c "set PATH=C:\xampp\mysql\bin;%PATH% && mysql -u root < database/migration_add_cadastral_data.sql"
```

### 3️⃣ INSTALLER MAVEN (Pour le Backend)

**Option A: Téléchargement Manuel**
1. Aller sur: https://maven.apache.org/download.cgi
2. Télécharger Apache Maven (binaire ZIP)
3. Extraire dans `C:\Maven`
4. Ajouter `C:\Maven\bin` aux variables d'environnement système PATH
5. Redémarrer PowerShell

**Option B: Vérifier si Maven existe**
```powershell
cmd /c "where mvn"
```
S'il est installé, vous le verrez.

### 4️⃣ LANCER LE BACKEND (Après Maven)
Ouvrez une **NOUVELLE fenêtre PowerShell** et exécutez:
```powershell
cd c:\xampp\htdocs\onpf\backend

cmd /c "set JAVA_HOME=C:\Program Files\Java\jdk-17 && set PATH=%JAVA_HOME%\bin;C:\Maven\bin;%PATH% && mvn clean install && mvn spring-boot:run"
```

Vous verrez:
```
2026-08-30 ... Started OnpfApplication in 15.234 seconds
```

---

## 🎯 Identifiants de Test

**Utilisateur 1: Éditeur**
```
Username: editor_user
Password: password
Rôle: محرر (Editor)
```

**Utilisateur 2: Vérificateur**
```
Username: verifier_user
Password: password
Rôle: متثبت (Verifier)
```

**Utilisateur 3: Vérificateur Senior**
```
Username: senior_verifier
Password: password
Rôle: متثبت_أعلى (Senior Verifier)
```

---

## 🌐 Accès aux Services

```
Frontend:   http://localhost:4200
Backend:    http://localhost:8080/api
Database:   localhost:3306 (user: root)
```

---

## 🔧 Commandes Utiles

### Frontend
```powershell
# Redémarrer le serveur
cmd /c "cd c:\xampp\htdocs\onpf\frontend && set PATH=C:\Program Files\nodejs;%PATH% && npm start"

# Arrêter: Appuyez sur Ctrl+C dans le terminal
```

### Backend
```powershell
# Arrêter: Appuyez sur Ctrl+C dans le terminal
```

### Base de Données
```powershell
# Se connecter à MySQL
cmd /c "set PATH=C:\xampp\mysql\bin;%PATH% && mysql -u root"

# Voir les bases:
SHOW DATABASES;

# Utiliser la base ONPF:
USE onpf_db;

# Voir les tables:
SHOW TABLES;
```

---

## 🐛 Dépannage

### Frontend ne se lance pas
```
Erreur: npm command not found
Solution: 
  cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && npm start"
```

### MySQL ne répond pas
```
Solution:
  1. Ouvrir XAMPP Control Panel
  2. Cliquer sur "Start" pour MySQL
  3. Vérifier qu'il est vert (running)
```

### Cannot find Maven
```
Solution:
  1. Installer Maven depuis https://maven.apache.org/
  2. Extraire dans C:\Maven
  3. Ajouter C:\Maven\bin au PATH système
  4. Relancer PowerShell
```

### Erreur de connexion Backend
```
Solution:
  1. Vérifier que MySQL est en cours d'exécution
  2. Vérifier que Java 17 est installé: C:\Program Files\Java\jdk-17
  3. Vérifier le fichier: backend/src/main/resources/application.yml
```

---

## 📂 Structure des Dossiers

```
c:\xampp\htdocs\onpf\
├── frontend/             ← Application Angular (Port 4200)
├── backend/              ← API Spring Boot (Port 8080)
├── database/
│   └── schema.sql        ← Schéma MySQL
├── launcher.bat          ← Lanceur GUI
├── init-database.bat     ← Initialiser DB
├── start-frontend.bat    ← Lancer Frontend
└── start-backend.bat     ← Lancer Backend
```

---

## ✨ Fonctionnalités Disponibles

- ✅ Interface RTL (Arabic Right-to-Left)
- ✅ Authentification JWT
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des rôles (3 rôles)
- ✅ Pages de gestion des fichiers
- ✅ Navigation avec sidebar
- ✅ Responsive design
- ⏳ API Rest Backend
- ⏳ Workflows d'étude et vérification
- ⏳ Recherche avancée

---

## 📞 Support

Pour plus d'informations, consultez:
- `README.md` - Documentation complète
- `SETUP.md` - Guide d'installation
- `DEVELOPER_GUIDE.md` - Guide pour développeurs
- `backend/README.md` - Documentation Backend

---

**Dernière mise à jour**: 30/08/2026  
**Version**: 1.0.0  
**Statut**: En Cours de Lancement 🚀
