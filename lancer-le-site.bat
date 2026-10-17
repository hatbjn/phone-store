@echo off
title EXPRESSOR Store - Serveur & Frontend
echo ========================================================
echo   DEMARRAGE DU SITE EXPRESSOR (FRONTEND + BACKEND)
echo ========================================================
cd /d "%~dp0"
echo Verification et demarrage des services sur le port 5173 et 5000...
npm run dev
pause
