# JSONPlaceholder API Clone

A modern FastAPI backend application that replicates the behavior and structure of [JSONPlaceholder](https://jsonplaceholder.typicode.com) with extended support for full REST operations, JWT-based authentication, structured user data storage, and containerized deployment.

## Features

### Core Functionality
- ✅ **Full CRUD Operations**: Complete Create, Read, Update, Delete operations for users
- ✅ **JSONPlaceholder Compatible**: Mimics the original API structure and behavior
- ✅ **RESTful Design**: Follows REST principles with proper HTTP methods and status codes
- ✅ **Data Validation**: Comprehensive input validation using Pydantic

### Authentication & Security
- ✅ **JWT Authentication**: Secure token-based authentication system
- ✅ **Password Hashing**: Secure password storage using bcrypt
- ✅ **Protected Endpoints**: Authentication required for write operations
- ✅ **Input Validation**: All endpoints validate input data

### Database & Storage
- ✅ **PostgreSQL Database**: Robust relational database storage
- ✅ **SQLAlchemy ORM**: Modern Python ORM with relationship mapping
- ✅ **Database Migrations**: Version control for database schema
- ✅ **Seed Data**: Automatic initialization with JSONPlaceholder data

### Development & Deployment
- ✅ **Docker Support**: Complete containerization with Docker Compose
- ✅ **Hot Reload**: Development server with automatic reload
- ✅ **Environment Config**: Flexible configuration via environment variables
- ✅ **Health Checks**: Built-in health monitoring endpoints

### Testing & Quality
- ✅ **Comprehensive Tests**: Unit and integration test coverage
- ✅ **Test Fixtures**: Automated test setup and teardown
- ✅ **Code Quality**: Linting and formatting rules
- ✅ **API Documentation**: Auto-generated OpenAPI/Swagger docs

## Technology Stack

- **Framework**: FastAPI 0.104.x
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT with passlib/bcrypt
- **Testing**: pytest with httpx
- **Containerization**: Docker & Docker Compose
- **Documentation**: OpenAPI/Swagger (built-in)

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)
- PostgreSQL (for local development without Docker)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-homework-2
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

### Local Development

1. **Install dependencies**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Set up environment**
   ```bash
   cp env_example.txt .env
   # Edit .env with your database configuration
   ```

3. **Initialize database**
   ```bash
   python scripts/init_db.py
   ```

4. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Users (JSONPlaceholder Compatible)
- `GET /api/v1/users/` - Get all users (with pagination)
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users/` - Create new user (requires auth)
- `PUT /api/v1/users/{id}` - Update user (requires auth)
- `PATCH /api/v1/users/{id}` - Partially update user (requires auth)
- `DELETE /api/v1/users/{id}` - Delete user (requires auth)

### System
- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint

## Data Schema

The API uses the same data structure as JSONPlaceholder:

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
```

## Authentication

### Registration
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Using the token
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{...user_data...}'
```

## Testing

### Run all tests
```bash
pytest
```

### Run with coverage
```bash
pytest --cov=app --cov-report=html
```

### Run specific test types
```bash
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
pytest tests/test_auth.py  # Specific test file
```

## Development

### Project Structure
```
├── app/
│   ├── api/
│   │   ├── deps.py              # Shared dependencies
│   │   └── v1/
│   │       ├── api.py           # Main API router
│   │       ├── auth.py          # Authentication endpoints
│   │       └── users.py         # User CRUD endpoints
│   ├── core/
│   │   ├── config.py            # Application configuration
│   │   └── security.py          # Security utilities
│   ├── crud/
│   │   └── user.py              # Database operations
│   ├── models/
│   │   └── user.py              # SQLAlchemy models
│   ├── schemas/
│   │   └── user.py              # Pydantic schemas
│   ├── database.py              # Database configuration
│   └── main.py                  # FastAPI application
├── scripts/
│   └── init_db.py               # Database initialization
├── tests/
│   ├── conftest.py              # Test configuration
│   ├── test_auth.py             # Authentication tests
│   └── test_users.py            # User CRUD tests
├── docker-compose.yml           # Docker composition
├── Dockerfile                   # Application container
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

### Code Quality

The project follows strict code quality standards:

- **Type Hints**: All functions use type annotations
- **Documentation**: Comprehensive docstrings and comments
- **Testing**: >80% test coverage requirement
- **Linting**: PEP 8 compliance with automated formatting
- **Security**: Best practices for authentication and data validation

### Adding New Features

1. Write tests first (TDD approach)
2. Implement the feature following existing patterns
3. Update documentation
4. Ensure all tests pass
5. Update API documentation if needed

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/jsonplaceholder_db` |
| `SECRET_KEY` | JWT signing secret | `your-secret-key-here` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration | `30` |
| `ENVIRONMENT` | Application environment | `development` |
| `DEBUG` | Enable debug mode | `true` |

### Security Considerations

- Change the default `SECRET_KEY` in production
- Use strong passwords for database connections
- Enable HTTPS in production environments
- Regularly update dependencies for security patches
- Monitor access logs and implement rate limiting

## Production Deployment

### Docker Production Build
```bash
# Build optimized image
docker build -t jsonplaceholder-api .

# Run with production settings
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL="your-production-db-url" \
  -e SECRET_KEY="your-production-secret" \
  -e ENVIRONMENT="production" \
  -e DEBUG="false" \
  jsonplaceholder-api
```

### Database Setup
```sql
-- Create production database
CREATE DATABASE jsonplaceholder_db;
CREATE USER api_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE jsonplaceholder_db TO api_user;
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the coding standards
4. Add/update tests as needed
5. Ensure all tests pass: `pytest`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: Available at `/docs` when running the application
- **Issues**: Report bugs and feature requests via GitHub issues
- **API Reference**: Complete OpenAPI specification at `/docs`

---

**Built with ❤️ using FastAPI, PostgreSQL, and Docker**