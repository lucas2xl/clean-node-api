#!/bin/sh

clear
echo "🚀 Installing dependencies"
npm install

clear
echo "🚀 Generating the build"
npm run build

clear
echo "🚀 Start the application"
npm run dev