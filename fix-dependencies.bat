@echo off
echo 🔧 Fixing React Native dependencies...
echo.

echo 📦 Cleaning node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📦 Reinstalling dependencies...
npm install

echo 🔧 Running npm dedupe to remove duplicate packages...
npm dedupe

echo ✅ Dependencies fixed!
echo.
echo 🚀 You can now run: npm start
pause
