@echo off
REM Script pour initialiser la base de données MySQL ONPF
REM Database initialization script for ONPF MySQL

echo.
echo ================================================
echo   ONPF - Initialisation de la Base de Données
echo ================================================
echo.

REM Vérifier si MySQL est en cours d'exécution
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MySQL est en cours d'exécution
) else (
    echo ✗ MySQL n'est pas détecté
    echo Assurez-vous que MySQL est démarré via XAMPP Control Panel
    pause
    exit /b
)

echo.
echo Importation du schéma de base de données...
echo.

REM Ajouter le chemin vers MySQL bin
set PATH=C:\xampp\mysql\bin;%PATH%

REM Exécuter le script SQL
mysql -u root < "C:\xampp\htdocs\onpf\database\schema.sql"

if %errorlevel% == 0 (
    echo.
    echo ✓ Base de données initialisée avec succès!
    echo.
    echo Utilisateurs par défaut créés:
    echo   - editor_user (Mot de passe: password)
    echo   - verifier_user (Mot de passe: password)
    echo   - senior_verifier (Mot de passe: password)
) else (
    echo.
    echo ✗ Erreur lors de l'initialisation de la base de données
    echo Assurez-vous que:
    echo   1. MySQL est en cours d'exécution
    echo   2. L'utilisateur root est configuré
)

echo.
pause
