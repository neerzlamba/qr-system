#!/bin/bash

echo "🚀 QR Code Management System - Setup Script"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) is installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo ""

echo "1️⃣  Installing root dependencies..."
npm install

echo ""
echo "2️⃣  Installing backend dependencies..."
cd backend
npm install

echo ""
echo "3️⃣  Installing frontend dependencies..."
cd ../frontend
npm install
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found, copying from .env.example..."
    cp .env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please update backend/.env with your database credentials if needed"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Ensure PostgreSQL is running"
echo "2. Run: ./scripts/init-db.sh (or manually setup database)"
echo "3. Run: npm run dev"
echo ""
echo "🎉 Setup complete! Read SETUP.md for more details."
echo ""
