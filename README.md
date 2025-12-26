# QR Code Management System

A full-stack web application for generating, managing, and organizing QR codes with user authentication.

## Features

### Core Functionality
- **QR Code Generation**: Generate QR codes from text or URLs with customizable options
- **Customization Options**:
  - Size (100px - 1000px)
  - Error correction level (L, M, Q, H)
  - Format (PNG, SVG)
- **QR Code Management**: 
  - Create, read, update, and delete QR codes
  - Store metadata (name, description, timestamps)
  - Organize in a visual grid view
- **Export & Retrieval**:
  - Download QR codes as PNG or SVG
  - View full-size QR codes
  - Copy QR code content to clipboard
- **User Authentication**:
  - Secure registration and login
  - JWT-based session management
  - User-specific QR codes (privacy-focused)

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: Context API with React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **QR Generation**: qrcode npm package

## Project Structure

```
qr-system/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & error handling
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities (JWT, validators)
│   │   └── server.ts          # Express server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Auth context
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── tsconfig.json
├── package.json               # Root package (monorepo)
├── .env.example               # Environment variables template
└── README.md
```

## Database Schema

### Users Table
```
- id (UUID, Primary Key)
- email (String, Unique)
- passwordHash (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### QR Codes Table
```
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- content (String)
- name (String)
- description (String, Optional)
- imageData (String)
- format (String)
- size (Integer)
- errorCorrectionLevel (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v12 or higher)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd qr-system
```

### 2. Install Dependencies
```bash
npm install
```

This will install dependencies for root, backend, and frontend.

### 3. Database Setup

**Create PostgreSQL Database:**
```bash
createdb qr_system_db
```

**Configure Environment Variables:**
```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/qr_system_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SESSION_EXPIRY=7d
```

**Run Prisma Migrations:**
```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

### 4. Start Development Servers

**Option 1: Start both servers concurrently (from root):**
```bash
npm run dev
```

**Option 2: Start servers separately:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### QR Codes
- `POST /api/qrcodes/preview` - Preview QR code without saving
- `POST /api/qrcodes` - Create new QR code (requires auth)
- `GET /api/qrcodes` - Get all user's QR codes (requires auth)
- `GET /api/qrcodes/:id` - Get specific QR code (requires auth)
- `PUT /api/qrcodes/:id` - Update QR code (requires auth)
- `DELETE /api/qrcodes/:id` - Delete QR code (requires auth)

## Usage Guide

### 1. Register/Login
- Navigate to http://localhost:5173
- Create a new account or login with existing credentials

### 2. Generate QR Code
- Fill in the QR code details:
  - **Name**: A descriptive name for your QR code
  - **Content**: URL or text to encode
  - **Description** (optional): Additional notes
  - **Size**: QR code dimensions (100-1000px)
  - **Error Correction**: L (Low), M (Medium), Q (Quartile), H (High)
  - **Format**: PNG or SVG
- Click **Preview** to see the QR code before saving
- Click **Create QR Code** to save

### 3. Manage QR Codes
- View all your QR codes in the dashboard
- **View**: Click to see full details and edit
- **Download**: Save QR code to your device
- **Copy Data**: Copy the encoded content
- **Delete**: Remove QR code permanently

### 4. Edit QR Code
- Click **View** on any QR code
- Click **Edit** to modify details
- Update name, content, description, size, or error correction
- Click **Update** to save changes

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Full Build
```bash
npm run build
```

## Development Tools

### Prisma Studio (Database GUI)
```bash
cd backend
npm run prisma:studio
```

### Database Migrations
```bash
cd backend
npm run prisma:migrate
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET           # Secret key for JWT tokens
PORT                 # Backend server port (default: 3001)
NODE_ENV             # development | production
FRONTEND_URL         # Frontend URL for CORS
SESSION_EXPIRY       # JWT token expiry (e.g., 7d, 24h)
```

### Frontend (optional)
```env
VITE_API_URL         # Backend API URL (default: http://localhost:3001)
```

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- User-specific data isolation
- CORS configuration
- Input validation with Zod

## Error Handling

The application includes comprehensive error handling:
- Form validation errors
- API request failures
- Authentication errors
- Database errors
- User-friendly error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

---

**Developed with ❤️ using React, TypeScript, Node.js, Express, PostgreSQL, and Prisma**
