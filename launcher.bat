@echo off
REM ONPF Project Launcher
REM Lanceur du Projet ONPF

:menu
cls
echo.
echo ================================================
echo   ONPF - Gestionnaire de Lancement
echo   Real Estate Files Management System
echo ================================================
echo.
echo Sélectionnez une option:
echo.
echo   1. Initialiser la base de données MySQL
echo   2. Lancer le Frontend (Angular)
echo   3. Lancer le Backend (Spring Boot)
echo   4. Voir les instructions
echo   5. Ouvrir le dossier du projet
echo   6. Quitter
echo.
set /p choice="Entrez votre choix (1-6): "

if "%choice%"=="1" goto init_db
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto backend
if "%choice%"=="4" goto instructions
if "%choice%"=="5" goto open_folder
if "%choice%"=="6" goto end
goto menu

:init_db
call init-database.bat
goto menu

:frontend
start cmd /k "call start-frontend.bat"
echo.
echo Frontend lancé dans une nouvelle fenêtre
timeout /t 3 /nobreak
goto menu

:backend
start cmd /k "call start-backend.bat"
echo.
echo Backend lancé dans une nouvelle fenêtre
timeout /t 3 /nobreak
goto menu

:instructions
cls
echo.
echo ================================================
echo   INSTRUCTIONS D'INSTALLATION
echo ================================================
echo.
echo PRÉREQUIS:
echo ✓ Node.js (v24.19.0) - INSTALLÉ
echo ✓ npm (v11.17.0) - INSTALLÉ
echo ✓ Java JDK-17 - INSTALLÉ
echo ✗ Maven - À INSTALLER
echo ✓ MySQL (XAMPP) - À CONFIGURER
echo.
echo ÉTAPES:
echo.
echo 1. INITIALISER LA BASE DE DONNÉES
echo    - S'assurer que MySQL est démarré dans XAMPP Control Panel
echo    - Cliquer sur option 1 pour initialiser la DB
echo.
echo 2. LANCER LE FRONTEND (Frontend d'abord!)
echo    - Cliquer sur option 2
echo    - Patienter l'installation des dépendances (peut prendre 2-3 min)
echo    - L'application s'ouvrira sur http://localhost:4200
echo.
echo 3. INSTALLER MAVEN (pour le backend)
echo    - Télécharger depuis: https://maven.apache.org/download.cgi
echo    - Extraire dans C:\Maven
echo    - Ajouter C:\Maven\bin au PATH système
echo    - Relancer l'invite de commande
echo.
echo 4. LANCER LE BACKEND
echo    - Cliquer sur option 3
echo    - La première compilation peut prendre 5-10 minutes
echo    - Le backend sera disponible sur http://localhost:8080/api
echo.
echo IDENTIFIANTS PAR DÉFAUT:
echo    Username: editor_user
echo    Password: password
echo.
echo (Appuyer sur une touche pour continuer...)
pause >nul
goto menu

:open_folder
start explorer.exe "C:\xampp\htdocs\onpf"
goto menu

:end
echo.
echo Au revoir!
echo.
