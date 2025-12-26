# QR System - Quick Setup Guide

This guide will help you get the QR Code Management System up and running quickly.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ npm v9+ installed (`npm --version`)
- ✅ PostgreSQL v12+ installed and running
- ✅ Git installed

## Quick Start (5 minutes)

### 1. Install Dependencies (2 min)
```bash
# Install all dependencies (root, backend, frontend)
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Setup Database (1 min)
```bash
# Create the database
createdb qr_system_db

# Or using psql
psql -U postgres -c "CREATE DATABASE qr_system_db;"
```

### 3. Configure Environment (1 min)
```bash
# The .env file is already created in backend/
# Edit it if your PostgreSQL credentials differ:
# Default: postgres/postgres@localhost:5432

# Update backend/.env if needed:
nano backend/.env
```

### 4. Initialize Database Schema (30 sec)
```bash
cd backend
npm run prisma:generate
npm run prisma:push
cd ..
```

### 5. Start the Application (30 sec)
```bash
# Start both frontend and backend:
npm run dev
```

That's it! 🎉

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## First Time Usage

1. Open http://localhost:5173
2. Click "Register" to create an account
3. Login with your credentials
4. Start creating QR codes!

## Common Issues & Solutions

### Database Connection Error
**Error**: `Can't reach database server`
**Solution**: 
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if needed
sudo service postgresql start

# Verify database exists
psql -U postgres -l
```

### Port Already in Use
**Error**: `Port 3001 already in use`
**Solution**: 
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
```

### Module Not Found Errors
**Error**: `Cannot find module...`
**Solution**: 
```bash
# Reinstall dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Prisma Client Issues
**Error**: `Prisma Client not generated`
**Solution**: 
```bash
cd backend
npm run prisma:generate
```

## Development Commands

```bash
# Start both servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build

# Run Prisma Studio (Database GUI)
cd backend && npm run prisma:studio

# Create database migration
cd backend && npm run prisma:migrate
```

## Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Project Structure
```
qr-system/
├── backend/          # Node.js/Express API
├── frontend/         # React/TypeScript UI
├── package.json      # Root package (monorepo)
├── README.md         # Full documentation
└── SETUP.md          # This file
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the API endpoints
- Customize the styling in frontend/src/index.css
- Add new features!

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review the [README.md](./README.md)
3. Check the console/terminal for error messages
4. Open an issue in the repository

---

Happy QR Code generating! 🎯
