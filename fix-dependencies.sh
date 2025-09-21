#!/bin/bash
echo "🔧 Fixing React Native dependencies..."
echo

echo "📦 Cleaning node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "🔧 Running npm dedupe to remove duplicate packages..."
npm dedupe

echo "✅ Dependencies fixed!"
echo
echo "🚀 You can now run: npm start"
