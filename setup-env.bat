@echo off
REM Configuration for ONPF Project Development Environment
REM Configuration pour l'environnement de développement du projet ONPF

REM Set Java Home
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;C:\Program Files\nodejs;%PATH%

REM Display versions
echo.
echo ===== ONPF Development Environment Setup =====
echo.
echo Checking installed tools...
echo.

call java -version
echo.
call node --version
echo.
call npm --version
echo.

REM Download and install Maven if not present
if not exist "C:\Maven" (
    echo Installing Maven...
    REM Maven download and setup would go here
    echo Maven is required. Please download from https://maven.apache.org/
) else (
    call mvn --version
)

echo.
echo ===== Setup Complete =====
echo.
pause
