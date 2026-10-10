#!/usr/bin/env powershell

# ONPF Frontend Launcher
# Lanceur du Frontend ONPF

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ONPF Frontend - Lancement du serveur" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "C:\xampp\htdocs\onpf\frontend"

if (!(Test-Path $frontendPath)) {
    Write-Host "ERREUR: Le dossier du frontend n'existe pas!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "$frontendPath\node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    Set-Location $frontendPath
    & "C:\Program Files\nodejs\node.exe" "$env:APPDATA\npm\npm.cmd" install --legacy-peer-deps
}

Write-Host ""
Write-Host "Démarrage du serveur de développement Angular..." -ForegroundColor Green
Write-Host "L'application sera accessible sur: http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

Set-Location $frontendPath
& "C:\Program Files\nodejs\node.exe" "$frontendPath\node_modules\.bin\ng.cmd" serve --open
