@echo off
REM Lanceur du Frontend ONPF
REM Frontend Launcher for ONPF Application

cd /d "C:\xampp\htdocs\onpf\frontend"

echo.
echo ================================================
echo   ONPF Frontend - Installation et Lancement
echo ================================================
echo.

echo Installation des dépendances...
call npm install

echo.
echo Démarrage du serveur de développement...
echo L'application sera accessible sur: http://localhost:4200
echo.

call npm start
