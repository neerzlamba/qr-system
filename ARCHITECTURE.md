# QR System - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 5173)                 │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Components: Login, Register, Dashboard, etc.    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Context: AuthContext (JWT Token, User State)    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Services: API calls with fetch                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP/JSON
                             │ Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Express API Server (Port 3001)              │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Routes: /api/auth/*, /api/qrcodes/*            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Middleware: authenticate, errorHandler          │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Controllers: Handle HTTP requests/responses     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Services: Business logic, QR generation         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Utils: JWT, Validators (Zod)                    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ Prisma ORM
                             │ Type-safe queries
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATA TIER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                       │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Tables:                                          │ │ │
│  │  │    - users (id, email, password_hash, ...)       │ │ │
│  │  │    - qr_codes (id, user_id, content, ...)        │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Authentication Flow

```
User Action: Register/Login
      │
      ├──► Frontend: Submit form
      │         │
      │         ├──► Validate input
      │         │
      │         └──► POST /api/auth/register or /login
      │                    │
      │                    ▼
      ├──► Backend: Receive request
      │         │
      │         ├──► Controller: Parse & validate (Zod)
      │         │
      │         ├──► Service: 
      │         │      - Hash password (bcrypt)
      │         │      - Create/find user in DB
      │         │      - Generate JWT token
      │         │
      │         └──► Response: { user, token }
      │                    │
      │                    ▼
      └──► Frontend: 
                │
                ├──► Store token in localStorage
                │
                ├──► Update AuthContext
                │
                └──► Redirect to Dashboard
```

### QR Code Creation Flow

```
User Action: Create QR Code
      │
      ├──► Frontend: Fill form & submit
      │         │
      │         ├──► Validate input
      │         │
      │         └──► POST /api/qrcodes
      │                 Headers: { Authorization: Bearer <token> }
      │                 Body: { name, content, description, ... }
      │                    │
      │                    ▼
      ├──► Backend: Receive request
      │         │
      │         ├──► Middleware: Verify JWT → Extract userId
      │         │
      │         ├──► Controller: Parse & validate
      │         │
      │         ├──► Service:
      │         │      - Generate QR code (qrcode library)
      │         │      - Convert to base64/SVG
      │         │      - Save to database with userId
      │         │
      │         └──► Response: { id, name, imageData, ... }
      │                    │
      │                    ▼
      └──► Frontend:
                │
                ├──► Display success message
                │
                ├──► Trigger list refresh
                │
                └──► Show new QR in grid
```

### Protected Route Flow

```
User Request: GET /api/qrcodes
      │
      ├──► Frontend: Add token to headers
      │         │
      │         └──► GET /api/qrcodes
      │                 Headers: { Authorization: Bearer <token> }
      │                    │
      │                    ▼
      ├──► Backend: Receive request
      │         │
      │         ├──► Middleware: authenticate
      │         │      ├──► Extract token from header
      │         │      ├──► Verify JWT signature
      │         │      ├──► Check expiration
      │         │      └──► Attach userId to request
      │         │
      │         ├──► Controller: Process request
      │         │
      │         ├──► Service: Query DB (filtered by userId)
      │         │
      │         └──► Response: QR codes array
      │                    │
      │                    ▼
      └──► Frontend: Display QR codes in grid
```

## Data Flow Diagram

```
┌──────────────┐
│  User Input  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐         ┌──────────────────┐
│  React Component │────────▶│   API Service    │
│   (UI Layer)     │         │  (Service Layer) │
└──────────────────┘         └─────────┬────────┘
       ▲                               │
       │                               │ HTTP Request
       │                               ▼
       │                     ┌────────────────────┐
       │                     │  Express Router    │
       │                     │  (Route Layer)     │
       │                     └─────────┬──────────┘
       │                               │
       │                               ▼
       │                     ┌────────────────────┐
       │                     │   Middleware       │
       │                     │  (Auth, Validate)  │
       │                     └─────────┬──────────┘
       │                               │
       │                               ▼
       │                     ┌────────────────────┐
       │                     │   Controller       │
       │                     │ (Request Handler)  │
       │                     └─────────┬──────────┘
       │                               │
       │                               ▼
       │                     ┌────────────────────┐
       │                     │   Service          │
       │                     │ (Business Logic)   │
       │                     └─────────┬──────────┘
       │                               │
       │                               ▼
       │                     ┌────────────────────┐
       │                     │   Prisma Client    │
       │                     │   (ORM Layer)      │
       │                     └─────────┬──────────┘
       │                               │
       │                               ▼
       │                     ┌────────────────────┐
       │                     │    PostgreSQL      │
       │                     │    (Database)      │
       │                     └─────────┬──────────┘
       │                               │
       └───────────────────────────────┘
              Response Flow
```

## Component Hierarchy

```
App (Router, AuthProvider)
│
├── Login
│
├── Register
│
└── Protected Route
    │
    └── Dashboard
        │
        ├── Header
        │   ├── User Info
        │   └── Logout Button
        │
        ├── QRGenerator
        │   ├── Form Fields
        │   ├── Preview Button
        │   └── Create Button
        │
        └── QRCodeList
            │
            └── QRCodeItem (multiple)
                │
                ├── QR Preview
                ├── Metadata
                └── Action Buttons
                    │
                    └── QRCodeModal (on click)
                        │
                        ├── Full View
                        └── Edit Form
```

## Database Relationships

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ email (UNIQUE)      │
│ password_hash       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N relationship
           │ (CASCADE on delete)
           │
           ▼
┌─────────────────────┐
│     qr_codes        │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │◀── Index for performance
│ content             │
│ name                │
│ description         │
│ image_data          │
│ format              │
│ size                │
│ error_correction... │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────┐
│           Security Layers                 │
├──────────────────────────────────────────┤
│                                           │
│  1. Transport Layer                       │
│     └─ CORS (configured origins)          │
│                                           │
│  2. Authentication Layer                  │
│     ├─ JWT tokens (signed)                │
│     ├─ Token expiration (7 days)          │
│     └─ Middleware verification            │
│                                           │
│  3. Authorization Layer                   │
│     └─ User-specific data filtering       │
│                                           │
│  4. Input Validation Layer                │
│     ├─ Zod schemas                        │
│     └─ Type checking                      │
│                                           │
│  5. Data Layer                            │
│     ├─ Password hashing (bcrypt)          │
│     ├─ Parameterized queries (Prisma)     │
│     └─ SQL injection prevention           │
│                                           │
└──────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│            Presentation                  │
│   React + TypeScript + Tailwind CSS     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          Client-Side Routing             │
│            React Router v6               │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          State Management                │
│      Context API + React Hooks           │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP/JSON
                 │
┌────────────────▼────────────────────────┐
│           API Gateway                    │
│       Express.js + TypeScript            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Business Logic                   │
│     Controllers + Services Pattern       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│              ORM Layer                   │
│          Prisma Client                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│            Database                      │
│           PostgreSQL                     │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Production Setup                │
├─────────────────────────────────────────┤
│                                          │
│  Frontend (Static)                       │
│  ├─ Build: npm run build:frontend       │
│  ├─ Output: frontend/dist/               │
│  └─ Host: Netlify, Vercel, S3, etc.     │
│                                          │
│  Backend (Node.js)                       │
│  ├─ Build: npm run build:backend        │
│  ├─ Output: backend/dist/                │
│  └─ Host: Railway, Render, Heroku, etc. │
│                                          │
│  Database (PostgreSQL)                   │
│  └─ Host: Railway, Supabase, AWS RDS    │
│                                          │
└─────────────────────────────────────────┘
```

## Development Workflow

```
Developer
    │
    ├──► Edit Code
    │       │
    │       ├──► Frontend: Hot reload (Vite HMR)
    │       │
    │       └──► Backend: Auto restart (tsx watch)
    │
    ├──► Modify Schema
    │       │
    │       ├──► Edit schema.prisma
    │       │
    │       ├──► prisma:generate
    │       │
    │       └──► prisma:push
    │
    ├──► Test API
    │       │
    │       ├──► Use Postman/cURL
    │       │
    │       └──► Check Browser DevTools
    │
    └──► Commit Changes
            │
            └──► Git → Push to Repository
```

---

This architecture ensures:
- ✅ **Separation of Concerns**: Clear boundaries between layers
- ✅ **Scalability**: Each tier can scale independently
- ✅ **Security**: Multiple security layers
- ✅ **Maintainability**: Modular structure with clear responsibilities
- ✅ **Type Safety**: TypeScript throughout the stack
- ✅ **Developer Experience**: Fast feedback loops with HMR
