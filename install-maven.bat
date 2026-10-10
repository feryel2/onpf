@echo off
setlocal enabledelayedexpansion

echo 📥 Téléchargement Maven 3.9.4...

if not exist "C:\Maven" (
    cd /d C:\
    
    REM Télécharger Maven
    powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.zip' -OutFile 'maven.zip' } catch { Write-Host 'Error downloading'; exit 1 }"
    
    if errorlevel 1 (
        echo ❌ Erreur : Impossible de télécharger Maven
        exit /b 1
    )
    
    echo 📦 Extraction...
    powershell -Command "Expand-Archive 'C:\maven.zip' -DestinationPath 'C:\' -Force"
    
    echo 🔄 Renommage...
    if exist "C:\apache-maven-3.9.4" (
        ren "C:\apache-maven-3.9.4" Maven
    )
    
    echo ✅ Maven installé dans C:\Maven
    del maven.zip
) else (
    echo ✅ Maven déjà présent
)

echo.
echo 🔧 Vérification Maven...
set PATH=C:\Maven\bin;%PATH%
mvn --version

if errorlevel 1 (
    echo ❌ Maven non trouvé. Ajoutez C:\Maven\bin au PATH système
) else (
    echo ✅ Maven fonctionne
)
