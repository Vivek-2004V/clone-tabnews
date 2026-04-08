#!/bin/bash

# Clone TabNews - Setup Script
# This script helps you set up the database and dependencies

echo "🚀 Clone TabNews Setup Script"
echo "=============================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "📥 Install it from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "📥 Install it from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found ($(node --version))"

# Install npm packages
echo ""
echo "📦 Installing npm packages..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm packages"
    exit 1
fi
echo "✅ Npm packages installed"

# Check if .env.local exists
echo ""
echo "🔧 Configuration..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo "📝 Please update .env.local with your database credentials"
else
    echo "✅ .env.local already exists"
fi

# Show next steps
echo ""
echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1️⃣  Update .env.local with your PostgreSQL credentials"
echo "2️⃣  Run: npm run dev"
echo "3️⃣  Open: http://localhost:3000"
echo ""
echo "🗄️  To setup database:"
echo "   psql -U postgres -c \"CREATE DATABASE tabnews;\""
echo "   psql -U tabnews_user -d tabnews < schema.sql"
echo ""
echo "📚 API Documentation: http://localhost:3000/api/health"
echo ""
