@echo off
REM Lanceur du Backend ONPF avec Maven
REM Backend Launcher for ONPF Application

cd /d "C:\xampp\htdocs\onpf\backend"

echo.
echo ================================================
echo   ONPF Backend - Compilation et Lancement
echo ================================================
echo.

REM Configurer les variables d'environnement
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

REM Vérifier si Java est disponible
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Java n'est pas trouvé
    echo JAVA_HOME=%JAVA_HOME%
    pause
    exit /b
)

echo ✓ Java trouvé
java -version

echo.
echo Vérification de Maven...
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ✗ Maven n'est pas installé
    echo.
    echo Pour installer Maven:
    echo   1. Télécharger depuis: https://maven.apache.org/
    echo   2. Extraire dans C:\Maven
    echo   3. Ajouter C:\Maven\bin au PATH système
    echo.
    pause
    exit /b
)

echo ✓ Maven trouvé
mvn --version

echo.
echo Compilation du projet...
call mvn clean install

echo.
echo Lancement du serveur Spring Boot...
echo Le backend sera accessible sur: http://localhost:8080/api
echo.

call mvn spring-boot:run
