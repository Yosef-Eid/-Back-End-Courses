# Authentication & Course Management API

A full-stack application built with Node.js and Express.js, providing authentication and course management functionalities.

## Project Overview

This project is a RESTful API that provides authentication and course management capabilities. It uses MongoDB as the database and includes features like user authentication, course management, file uploads, and email notifications.

## Features

- User Authentication (JWT-based)
- Course Management System
- File Uploads (Cloudinary integration)
- Email Notifications
- GitHub OAuth Integration
- Rate Limiting
- API Documentation (Swagger)
- Real-time Communication (Socket.IO)

## Project Structure

```
auth/
├── config/          # Configuration files
├── controls/        # Controller logic
├── index.js         # Main application file
├── middlewares/     # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── upload/          # File upload directory
├── utils/           # Utility functions
└── validations/     # Input validation
```

## API Endpoints

### Authentication
- POST /auth/login
- POST /auth/register
- POST /auth/verify-email
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/github

### Courses
- GET /courses/getAllCourses
- GET /courses/{courseId}
- POST /courses
- PUT /courses/{courseId}
- DELETE /courses/{courseId}

### Users
- GET /users/me
- PUT /users/profile
- POST /users/upload-avatar

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## Dependencies

- Express.js - Web framework
- MongoDB/Mongoose - Database
- JWT - Authentication
- Passport.js - Authentication middleware
- Multer - File uploads
- Cloudinary - Cloud storage
- Socket.IO - Real-time communication
- Joi - Input validation
- Swagger - API documentation
- Nodemailer - Email service

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration

3. Start the server:
```bash
npm start
```

4. Access Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License
