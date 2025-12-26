# QR System - Quick Reference Guide

## 🚀 Quick Start

```bash
# 1. Setup (one time)
./scripts/setup.sh
./scripts/init-db.sh

# 2. Start development
npm run dev
```

## 📁 Key Files

### Backend
```
backend/
├── src/server.ts              # Main Express server
├── src/routes/                # API routes
│   ├── authRoutes.ts          # /api/auth/*
│   └── qrCodeRoutes.ts        # /api/qrcodes/*
├── src/controllers/           # Request handlers
├── src/services/              # Business logic
├── src/middleware/auth.ts     # JWT authentication
└── prisma/schema.prisma       # Database schema
```

### Frontend
```
frontend/
├── src/App.tsx                # Main app + routing
├── src/components/            # React components
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Register page
│   ├── Dashboard.tsx          # Main dashboard
│   ├── QRGenerator.tsx        # QR creation form
│   ├── QRCodeList.tsx         # QR grid view
│   ├── QRCodeItem.tsx         # QR card
│   └── QRCodeModal.tsx        # QR detail/edit
├── src/context/AuthContext.tsx # Auth state
└── src/services/api.ts        # API calls
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user (auth required)
```

### QR Codes
```
POST   /api/qrcodes/preview    # Preview QR (no auth)
POST   /api/qrcodes            # Create QR (auth)
GET    /api/qrcodes            # List all QRs (auth)
GET    /api/qrcodes/:id        # Get specific QR (auth)
PUT    /api/qrcodes/:id        # Update QR (auth)
DELETE /api/qrcodes/:id        # Delete QR (auth)
```

## 💻 Development Commands

```bash
# Development
npm run dev                    # Start both servers
npm run dev:backend            # Backend only (port 3001)
npm run dev:frontend           # Frontend only (port 5173)

# Database
cd backend
npm run prisma:generate        # Generate Prisma client
npm run prisma:push           # Push schema to DB
npm run prisma:migrate        # Create migration
npm run prisma:studio         # Open DB GUI

# Build
npm run build                 # Build both
npm run build:backend         # Build backend
npm run build:frontend        # Build frontend

# Production
npm run start:backend         # Start backend (production)
```

## 🗄️ Database Schema

### Users
```typescript
{
  id: string (UUID)
  email: string (unique)
  passwordHash: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### QR Codes
```typescript
{
  id: string (UUID)
  userId: string (FK)
  content: string (TEXT)
  name: string
  description: string?
  imageData: string (TEXT)
  format: 'png' | 'svg'
  size: number (100-1000)
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🔐 Environment Variables

```bash
# backend/.env
DATABASE_URL="postgresql://user:pass@localhost:5432/qr_system_db"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SESSION_EXPIRY=7d
```

## 📝 Common Tasks

### Add New API Endpoint
1. Create controller method in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Update types in `backend/src/types/index.ts`
4. Add validation in `backend/src/utils/validators.ts` (if needed)

### Add New React Component
1. Create component in `frontend/src/components/`
2. Import and use in parent component
3. Add types in `frontend/src/types/index.ts` (if needed)
4. Update API service in `frontend/src/services/api.ts` (if needed)

### Modify Database Schema
1. Edit `backend/prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:push` (dev) or `npm run prisma:migrate` (prod)

### Add Authentication to New Route
```typescript
// In routes file
import { authenticate } from '../middleware/auth';

router.get('/protected-route', authenticate, (req, res) => {
  // Access req.userId
});
```

## 🐛 Debugging

### Check Server Health
```bash
curl http://localhost:3001/health
```

### View Database
```bash
cd backend && npm run prisma:studio
```

### Check Logs
- Backend: Check terminal running `npm run dev:backend`
- Frontend: Check browser console (F12)

### Common Issues

**Port in use:**
```bash
lsof -ti:3001 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

**Database connection error:**
```bash
sudo service postgresql start
psql -U postgres -l  # List databases
```

**Module not found:**
```bash
rm -rf node_modules */node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

**Prisma client error:**
```bash
cd backend && npm run prisma:generate
```

## 🧪 Testing API with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Create QR Code
```bash
TOKEN="your-jwt-token"
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"My QR",
    "content":"https://example.com",
    "description":"Test QR Code"
  }'
```

## 📦 Project Structure

```
qr-system/
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, errors
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helpers
│   │   └── server.ts          # Main server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env                   # Environment vars
│   └── package.json
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # State management
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app
│   │   └── main.tsx           # Entry point
│   └── package.json
├── scripts/                   # Setup scripts
├── package.json               # Root (monorepo)
├── README.md                  # Full documentation
├── SETUP.md                   # Quick setup guide
└── QUICK_REFERENCE.md         # This file
```

## 🎯 Key Concepts

### Authentication Flow
1. User registers/logs in
2. Server generates JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header
5. Backend verifies token via middleware
6. Protected routes check req.userId

### QR Code Generation Flow
1. User fills form
2. (Optional) Click preview → Generate QR without saving
3. Click create → Generate QR + Save to database
4. Frontend receives QR with base64/SVG data
5. Display in grid

### Data Isolation
- Each user only sees their own QR codes
- Enforced at database query level (userId filter)
- Protected by JWT authentication

## 📚 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with bcrypt
- **QR Generation**: qrcode npm package
- **Validation**: Zod

---

**Need more info?** Check [README.md](./README.md) for full documentation!
