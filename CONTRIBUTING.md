# Contributing to QR Code Management System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd qr-system
   ```
3. **Setup the project**
   ```bash
   ./scripts/setup.sh
   ./scripts/init-db.sh
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. **Start the development servers**
   ```bash
   npm run dev
   ```

2. **Make your changes**
   - Backend: Edit files in `backend/src/`
   - Frontend: Edit files in `frontend/src/`
   - Database: Edit `backend/prisma/schema.prisma`

3. **Test your changes**
   - Manual testing in browser
   - Test API endpoints with cURL or Postman
   - Verify TypeScript compilation

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code style
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Comments**: Add comments only for complex logic
- **Types**: Always type your variables and functions

### Commit Messages

Follow this format:
```
type(scope): short description

Longer description if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(qr): add QR code color customization
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** - ensure everything works
3. **Create pull request** with clear description
4. **Link related issues** if applicable
5. **Wait for review** - address any feedback

## Code Review Guidelines

We review PRs based on:
- **Functionality**: Does it work as intended?
- **Code Quality**: Is it clean and maintainable?
- **TypeScript**: Proper typing and no `any`?
- **Security**: No security vulnerabilities?
- **Performance**: No performance regressions?
- **Documentation**: Updated if needed?

## Project Structure

### Backend
```
backend/src/
├── controllers/    # HTTP request handlers
├── routes/         # API route definitions
├── middleware/     # Express middleware
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Helper functions
```

### Frontend
```
frontend/src/
├── components/     # React components
├── context/        # React context providers
├── services/       # API service layer
└── types/          # TypeScript types
```

## Adding New Features

### Backend API Endpoint

1. **Add route** in `backend/src/routes/`
2. **Create controller method** in `backend/src/controllers/`
3. **Implement service logic** in `backend/src/services/`
4. **Add validation schema** in `backend/src/utils/validators.ts`
5. **Update types** in `backend/src/types/index.ts`

### Frontend Component

1. **Create component** in `frontend/src/components/`
2. **Add to routing** if it's a page
3. **Update API service** in `frontend/src/services/api.ts` if needed
4. **Add types** in `frontend/src/types/index.ts` if needed

### Database Changes

1. **Edit schema** in `backend/prisma/schema.prisma`
2. **Generate client**: `cd backend && npm run prisma:generate`
3. **Push to DB**: `npm run prisma:push` (dev) or `npm run prisma:migrate` (prod)
4. **Update TypeScript types** to match new schema

## Common Tasks

### Running Tests
```bash
# Backend
cd backend
npm run build  # Check TypeScript compilation

# Frontend
cd frontend
npm run build  # Check TypeScript compilation
```

### Database Management
```bash
cd backend
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Create migration
npm run prisma:push      # Push schema (dev only)
```

### Debugging

**Backend:**
- Check terminal output for errors
- Add `console.log()` statements
- Use Prisma Studio to inspect database

**Frontend:**
- Use browser DevTools (F12)
- Check Network tab for API calls
- Use React DevTools extension

## Bug Reports

When reporting bugs, include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: How to trigger the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, etc.
- **Screenshots**: If applicable

## Feature Requests

When requesting features:
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered?
- **Additional Context**: Any other information

## Questions?

- Check existing documentation (README.md, SETUP.md, etc.)
- Search existing issues
- Create a new issue with your question

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
