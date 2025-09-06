#!/bin/bash

# Future Engineers Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 Setting up Future Engineers development environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or later is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) is installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Environment file not found. Creating .env.local from template..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo "✅ Created .env.local from template"
        echo ""
        echo "🔧 Please edit .env.local and add your actual configuration values:"
        echo "   - Firebase configuration"
        echo "   - Cloudinary credentials"
        echo "   - Admin email addresses"
    else
        echo "❌ .env.local.example not found"
        exit 1
    fi
else
    echo "✅ .env.local already exists"
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo ""
    echo "🔥 Firebase CLI not found. Installing globally..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI is installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Set up Firebase project: firebase login && firebase init"
echo "3. Start development server: npm run dev"
echo ""
echo "📚 For more information, see README.md"
echo "🐛 For issues, visit: https://github.com/yourusername/future_engineers/issues"
