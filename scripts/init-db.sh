#!/bin/bash

echo "🗄️  QR System Database Initialization"
echo "======================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first."
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Database name
DB_NAME="qr_system_db"

# Check if database exists
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb -U postgres $DB_NAME
        echo "✅ Database dropped"
    else
        echo "ℹ️  Using existing database"
    fi
fi

# Create database if it doesn't exist
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "📦 Creating database '$DB_NAME'..."
    createdb -U postgres $DB_NAME
    echo "✅ Database created successfully"
fi

# Navigate to backend and run Prisma commands
echo "🔧 Generating Prisma client..."
cd backend
npm run prisma:generate

echo "🚀 Pushing schema to database..."
npm run prisma:push

echo ""
echo "✅ Database initialization complete!"
echo "📊 You can view your database with: cd backend && npm run prisma:studio"
echo ""
