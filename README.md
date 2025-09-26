# Extraescolar Core API

A NestJS API built with hexagonal architecture for managing extracurricular educational activities. Provides functionality for managing cohorts, students, and attendance events.

## Architecture

This project implements **Hexagonal Architecture (Ports & Adapters)** with the following layers:

- **Domain Layer** (`src/domain/`): Business entities and ports (interfaces)
- **Application Layer** (`src/application/`): Use cases and application services
- **Infrastructure Layer** (`src/infrastructure/`): Repository implementations and database configuration
- **Presentation Layer** (`src/presentation/`): REST controllers and DTOs

## Tech Stack

- **NestJS** - Node.js framework
- **TypeScript** - Programming language
- **TypeORM** - Database ORM
- **MySQL** - Relational database
- **Class Validator** - Data validation
- **Jest** - Testing framework

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=extraescolar_db
```

## Database Setup

1. **Run migrations:**
```bash
npm run migration:run
```

2. **Test database connection:**
```bash
npm run db:test
```

## Running the app

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Cohorts
- `GET /cohorte/:cohorteId` - Get cohort information

### Students
- `GET /alumno/:alumnoId/cohorte/:cohorteId` - Get student information in a specific cohort

### Health Check
- `GET /health` - Complete health check with database connectivity
- `GET /health/ready` - Readiness probe (for containers/load balancers)
- `GET /health/live` - Liveness probe (for containers/load balancers)

### Example Requests

**Get Cohort Information:**
```bash
GET /cohorte/123e4567-e89b-12d3-a456-426614174000
```

**Get Student Information:**
```bash
GET /alumno/456e7890-e89b-12d3-a456-426614174001/cohorte/123e4567-e89b-12d3-a456-426614174000
```

**Health Check:**
```bash
GET /health
```

## Database

The application uses MySQL with TypeORM. The database schema will be automatically synchronized in development mode.

### Main Entities

#### Cohorte
- `id` (UUID) - Unique identifier
- `presencialidad_total` (INT) - Total required attendance
- `cantidad_clases_total` (INT) - Total scheduled classes
- `profesores` (JSON) - Array of teacher IDs
- `alumnos` (JSON) - Array of student IDs

#### Alumno
- `id` (UUID) - Unique identifier
- `fk_cohorte_id` (UUID) - Reference to cohort
- `porcentaje_presencialidad` (DECIMAL) - Attendance percentage

#### Evento
- `id` (UUID) - Unique identifier
- `fk_cohorte_id` (UUID) - Reference to cohort
- `fecha` (DATE) - Event date
- `alumnos_presentes` (JSON) - Array of present student IDs

## Available Scripts

```bash
npm run build              # Build the project
npm run start              # Start in production mode
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode
npm run lint               # Run linter
npm run format             # Format code with Prettier
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run migration:generate # Generate new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run db:test            # Test database connection
```

## Project Structure

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
│       └── injection-tokens.ts
├── application/                 # Application layer
│   ├── services/                # Application services
│   └── use-cases/               # Use cases
├── infrastructure/              # Infrastructure layer
│   ├── database/                # Database configuration
│   └── repositories/            # Repository implementations
└── presentation/                # Presentation layer
    ├── controllers/              # REST controllers
    └── dtos/                    # Data Transfer Objects
```
