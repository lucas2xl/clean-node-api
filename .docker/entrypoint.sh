#!/bin/sh

clear
echo "🚀 Installing dependencies"
npm install
npm rebuild bcrypt

clear
echo "🚀 Generating the build"
npm run build

clear
echo "🚀 Start the application"
npm run dev