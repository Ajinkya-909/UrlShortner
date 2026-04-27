# UrlShortner - Fast & Secure URL Shortening Service

A lightweight, high-performance URL shortening service built with Node.js, Express, and PostgreSQL. UrlShortner enables users to create short, shareable links from long URLs with optional custom codes and comprehensive link management.

## Overview

UrlShortner is a backend-focused URL shortening platform that provides:

- Fast URL shortening with auto-generated or custom short codes
- User authentication and authorization
- Persistent URL storage in PostgreSQL
- RESTful API for integration
- Efficient code generation using nanoid
- User-specific URL management

Perfect for building shorter, more shareable links for social media, marketing campaigns, QR codes, and general link sharing.

## Key Features

### URL Management

- **Create Short URLs**: Convert long URLs to short, shareable links
- **Custom Codes**: Optional custom short code selection
- **Auto-generation**: Default 6-character nanoid generation for short codes
- **List User URLs**: Retrieve all shortened URLs for authenticated users
- **URL Tracking**: Each URL stores target URL, short code, creation timestamp, and user association

### Authentication

- User registration with email and password
- JWT-based authentication for API endpoints
- Password hashing with salt for security
- Middleware-protected routes
- User-specific URL ownership

### API Endpoints

- `POST /user/signup` - Register new user
- `POST /user/login` - Authenticate user
- `POST /shorten` - Create new shortened URL
- `GET /codes` - Retrieve user's shortened URLs

## Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework and routing
- **TypeScript** - Type safety (for development, transpiles to JS)
- **Drizzle ORM** - Database access and migrations

### Database

- **PostgreSQL** - Relational database
- **Docker Compose** - Database containerization
- **Drizzle Kit** - Schema management and migrations

### Security

- **JSON Web Tokens (JWT)** - Stateless authentication
- **bcrypt/password hashing** - Secure password storage
- **Zod** - Request validation schema

### Utilities

- **nanoid** - Secure, short unique ID generation
- **dotenv** - Environment variable management

## Project Structure

```
.
├── index.js                    # Application entry point
├── package.json               # Dependencies and scripts
├── docker-compose.yml         # PostgreSQL container config
├── drizzle.config.js          # ORM configuration
├── .env                       # Environment variables
│
├── db/
│   └── index.js              # Database connection & initialization
│
├── models/
│   ├── index.js              # Model exports
│   ├── user.model.js         # User table schema
│   └── url.model.js          # URL shortening table schema
│
├── routes/
│   ├── user.routes.js        # User auth endpoints
│   └── urls.route.js         # URL shortening endpoints
│
├── middlewares/
│   └── auth.middleware.js    # JWT authentication middleware
│
├── services/
│   └── user.service.js       # User business logic
│
├── utils/
│   ├── hash.js               # Password hashing utilities
│   └── token.js              # JWT token generation
│
└── validation/
    ├── requests.validation.js # Zod schema validation
    └── token.validation.js    # Token validation schemas
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20),
  email VARCHAR(200) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP
);
```

### URLs Table

```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose (for PostgreSQL)
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd UrlShortner

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env with your database credentials and JWT secret
```

### Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortner
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=urlshortner

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Other Configuration
SALT_ROUNDS=10
```

### Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npm run db-push

# Open Drizzle Studio (visual database explorer)
npm run db-studio
```

### Development

```bash
# Start development server with auto-reload
npm run dev
```

The server will run on `http://localhost:3000`

## API Documentation

### User Registration

```bash
POST /user/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
```

### User Login

```bash
POST /user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
```

### Shorten URL

```bash
POST /shorten
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "url": "https://www.example.com/very/long/url/that/needs/shortening",
  "code": "optional_custom_code"  // Optional, auto-generated if omitted
}

Response:
{
  "id": "uuid",
  "shortCode": "abc123",
  "targetURL": "https://www.example.com/very/long/url/that/needs/shortening"
}
```

### Get User's URLs

```bash
GET /codes
Authorization: Bearer <jwt_token>

Response:
{
  "codes": [
    {
      "id": "uuid",
      "shortCode": "abc123",
      "targetURL": "https://example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

## Key Components

### Authentication Middleware

- Validates JWT tokens from Authorization header
- Attaches user information to request object
- Returns 401 Unauthorized for invalid/missing tokens

### Password Hashing

- Uses bcrypt with salt rounds for secure password storage
- Salt generated and stored with each user
- Passwords never stored in plain text

### Short Code Generation

- Uses nanoid library for collision-free short codes
- Default 6 characters (2^36 possible combinations)
- Supports custom codes with uniqueness validation

### Request Validation

- Zod schemas for type-safe request validation
- Validates URL format, email format, password requirements
- Provides detailed error messages on validation failure

## Deployment

### Build for Production

```bash
npm run build  # If TypeScript is compiled to JS
```

### Deploy to Hosting

- Package as Node.js application
- Set environment variables in hosting platform
- Use managed PostgreSQL or containerized database
- Ensure PORT environment variable is respected

### Recommended Platforms

- Heroku (with PostgreSQL add-on)
- Railway.app
- Render.com
- AWS EC2 + RDS
- DigitalOcean App Platform

## Performance Considerations

### Database Optimization

- Index on `user_id` for efficient URL lookup
- Unique constraint on `short_code` for collision prevention
- Connection pooling with Drizzle ORM

### Scalability

- Stateless design allows horizontal scaling
- JWT tokens enable load balancing
- Short code generation has minimal collision risk

## Security Best Practices

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- Input validation on all endpoints
- SQL injection prevention via ORM
- CORS configuration for API access
- Rate limiting recommended for production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Make your changes
4. Commit (`git commit -m 'Add NewFeature'`)
5. Push (`git push origin feature/NewFeature`)
6. Open a Pull Request

## Future Enhancements

- Link expiration dates
- Click analytics and tracking
- QR code generation
- Batch URL shortening
- Custom domain support
- Link preview functionality
- Rate limiting per user
- Admin dashboard

## License

This project is open source under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
