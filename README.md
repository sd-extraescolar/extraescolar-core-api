# Extraescolar Core API

A NestJS API built with hexagonal architecture for managing extracurricular educational activities. Provides functionality for managing cohorts, students, and attendance events with Google Classroom integration.

## 🏗️ Architecture

This project implements **Hexagonal Architecture (Ports & Adapters)** with the following layers:

- **Domain Layer** (`src/domain/`): Business entities and ports (interfaces)
- **Application Layer** (`src/application/`): Use cases and application services
- **Infrastructure Layer** (`src/infrastructure/`): Repository implementations, database configuration, and external services
- **Presentation Layer** (`src/presentation/`): REST controllers and DTOs

## 🛠️ Tech Stack

- **NestJS** - Node.js framework
- **TypeScript** - Programming language
- **TypeORM** - Database ORM
- **MySQL** - Relational database
- **Google Classroom API** - External service integration
- **Google OAuth 2.0** - Authentication
- **Class Validator** - Data validation
- **Jest** - Testing framework

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Google Cloud Console project with Classroom API enabled
- Google OAuth 2.0 credentials

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd extraescolar-core-api

# Install dependencies
npm install
```

### Environment Setup

Copy the `.env.example` file to `.env` in the root directory and fill in the required values.

### Database Setup

```bash
# Run migrations
npm run migration:run

# Test database connection
npm run db:test
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication

All endpoints (except `/health`) require Google OAuth authentication:

```http
Authorization: Bearer [GOOGLE_OAUTH_ACCESS_TOKEN]
```

### Core Endpoints

#### Health Check
```http
GET /health
```
Returns application health status including database connectivity.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-26T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "connected": true
  }
}
```

#### Get Cohort Information
```http
GET /cohorte/{cohorteId}
Authorization: Bearer [TOKEN]
```

**Parameters:**
- `cohorteId`: Google Classroom course ID (e.g., "809342422437")

**Response:**
```json
{
  "id": "809342422437",
  "presencialidad_total": 0,
  "cantidad_clases_total": 0,
  "profesores": ["107170250630047767277"],
  "alumnos": ["117578979296249328751"],
  "createdAt": "2025-09-26T09:10:34.362Z",
  "updatedAt": "2025-09-26T09:10:34.362Z"
}
```

#### Create Event
```http
POST /eventos
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "cohorteId": "809342422437",
  "fecha": "2024-01-15T10:00:00.000Z",
  "alumnosPresentes": []
}
```

**Response:**
```json
{
  "id": "bd3fc94a-f137-4a6c-a296-5bc3aab97699",
  "fk_cohorte_id": "809342422437",
  "fecha": "2024-01-15T10:00:00.000Z",
  "alumnos_presentes": [],
  "createdAt": "2025-09-26T09:24:28.001Z",
  "updatedAt": "2025-09-26T09:24:28.001Z"
}
```

#### Get Events by Cohort
```http
GET /eventos/cohorte/{cohorteId}
Authorization: Bearer [TOKEN]
```

**Response:**
```json
[
  {
    "id": "bd3fc94a-f137-4a6c-a296-5bc3aab97699",
    "fk_cohorte_id": "809342422437",
    "fecha": "2024-01-15T10:00:00.000Z",
    "alumnos_presentes": ["117578979296249328751"],
    "createdAt": "2025-09-26T09:24:28.001Z",
    "updatedAt": "2025-09-26T09:24:28.001Z"
  }
]
```

#### Mark Attendance
```http
POST /eventos/{eventoId}/attendance
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "alumnoIds": ["117578979296249328751"]
}
```

**Parameters:**
- `eventoId`: Event UUID (e.g., "bd3fc94a-f137-4a6c-a296-5bc3aab97699")
- `alumnoIds`: Array of Google Classroom student IDs

**Response:**
```json
{
  "id": "bd3fc94a-f137-4a6c-a296-5bc3aab97699",
  "fk_cohorte_id": "809342422437",
  "fecha": "2024-01-15T10:00:00.000Z",
  "alumnos_presentes": ["117578979296249328751"],
  "createdAt": "2025-09-26T09:24:28.001Z",
  "updatedAt": "2025-09-26T10:14:08.000Z"
}
```

#### Remove Attendance
```http
DELETE /eventos/{eventoId}/attendance
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "alumnoIds": ["117578979296249328751"]
}
```

### Additional Endpoints

#### Get All Cohorts from Google Classroom
```http
GET /cohortes
Authorization: Bearer [TOKEN]
```

#### Get Students from a Cohort
```http
GET /cohorte/{cohorteId}/students
Authorization: Bearer [TOKEN]
```

#### Sync Cohort from Google Classroom
```http
POST /cohorte/{cohorteId}/sync
Authorization: Bearer [TOKEN]
```

## 🗄️ Database Schema

### Main Entities

#### Cohorte
- `id` (VARCHAR) - Google Classroom course ID
- `presencialidad_total` (INT) - Total required attendance
- `cantidad_clases_total` (INT) - Total scheduled classes
- `profesores` (JSON) - Array of teacher IDs
- `alumnos` (JSON) - Array of student IDs

#### Evento
- `id` (UUID) - Unique identifier
- `fk_cohorte_id` (VARCHAR) - Reference to cohort (Google Classroom ID)
- `fecha` (DATETIME) - Event date
- `alumnos_presentes` (JSON) - Array of present student IDs

#### Alumno
- `id` (UUID) - Unique identifier
- `fk_cohorte_id` (VARCHAR) - Reference to cohort
- `porcentaje_presencialidad` (DECIMAL) - Attendance percentage

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the project
npm run start:prod         # Start in production mode

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run db:test            # Test database connection

# TypeORM CLI
npm run typeorm            # Run TypeORM CLI commands
```

## 📁 Project Structure

```
src/
├── app.module.ts                 # Main application module
├── main.ts                      # Application entry point
├── domain/                      # Domain layer
│   ├── entities/                # Business entities
│   │   ├── alumno.entity.ts
│   │   ├── cohorte.entity.ts
│   │   └── evento.entity.ts
│   └── ports/                   # Ports (interfaces)
│       ├── alumno-repository.port.ts
│       ├── cohorte-repository.port.ts
│       ├── evento-repository.port.ts
│       └── injection-tokens.ts
├── application/                 # Application layer
│   ├── services/                # Application services
│   │   ├── cohorte.service.ts
│   │   └── evento.service.ts
│   └── use-cases/               # Use cases
│       ├── create-evento.use-case.ts
│       ├── get-evento.use-case.ts
│       ├── get-eventos-by-cohorte.use-case.ts
│       ├── update-attendance.use-case.ts
│       └── update-evento.use-case.ts
├── infrastructure/              # Infrastructure layer
│   ├── auth/                    # Authentication services
│   │   └── google-oauth.service.ts
│   ├── config/                  # Configuration
│   ├── database/                # Database configuration
│   │   ├── data-source.ts
│   │   └── migrations/
│   ├── repositories/            # Repository implementations
│   │   ├── alumno.repository.ts
│   │   ├── cohorte.repository.ts
│   │   └── evento.repository.ts
│   └── services/                # External services
│       └── google-classroom.service.ts
└── presentation/                # Presentation layer
    ├── controllers/              # REST controllers
    │   ├── auth.controller.ts
    │   ├── cohorte.controller.ts
    │   ├── evento.controller.ts
    │   └── health.controller.ts
    ├── decorators/               # Custom decorators
    │   └── user-tokens.decorator.ts
    └── dtos/                    # Data Transfer Objects
        ├── attendance-stats.dto.ts
        ├── attendance-update.dto.ts
        ├── create-evento.dto.ts
        ├── evento-response.dto.ts
        └── update-evento.dto.ts
```

## 🔐 Google Classroom Integration

### Setup Requirements

1. **Google Cloud Console Project**
   - Enable Google Classroom API
   - Create OAuth 2.0 credentials
   - Configure authorized redirect URIs

2. **Required Scopes**
   - `https://www.googleapis.com/auth/classroom.courses.readonly`
   - `https://www.googleapis.com/auth/classroom.rosters.readonly`
   - `https://www.googleapis.com/auth/classroom.profile.emails`

3. **Authentication Flow**
   - Frontend handles OAuth flow
   - Backend receives access tokens
   - Tokens are validated and used for API calls

### Token Management

- Access tokens expire in ~1 hour
- Refresh tokens are used for automatic renewal
- Frontend should handle token refresh

## 🚨 Error Handling

### Common HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or expired token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Structure

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

## 📝 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow NestJS conventions
- Implement proper error handling
- Write comprehensive tests
- Use meaningful variable and function names

### Git Workflow

1. Create feature branches from `main`
2. Write tests for new features
3. Ensure all tests pass
4. Create pull requests for code review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test cases for usage examples