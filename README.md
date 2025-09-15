# Blog API

A RESTful API for a blogging platform built with Express.js, PostgreSQL, and Prisma ORM.

## Features

- 👤 User authentication and authorization
- 📝 Blog post creation and management
- 💬 Commenting system
- ❤️ Post likes functionality
- 🔐 Role-based access control (authors vs regular users)
- ✨ Input validation and sanitization
- 🚀 Rate limiting for API protection
- 📝 Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Input Validation**: express-validator
- **API Security**: express-rate-limit, cors
- **Password Hashing**: bcryptjs
- **Development**: Babel, Nodemon
- **Logging**: Morgan

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd blog-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
JWT_SECRET="your-secret-key"
```

4. Set up the database:

```bash
npx prisma migrate dev
```

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - User login

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post (authors only)
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments

- `POST /posts/:id/comments` - Add comment to post
- `get /posts/:id/comments` - Get all post comments

### Likes

- `POST /posts/:id/likes` - Like post
- `DELETE /posts/:id/likes` - unlike post

## Database Schema

### User

- id (UUID)
- username (String, unique)
- password (String, hashed)
- isAuthor (Boolean)
- createdAt (DateTime)

### Post

- id (UUID)
- title (String)
- text (String)
- authorId (UUID)
- isPublished (Boolean)
- createdAt (DateTime)

### Comment

- id (UUID)
- text (String)
- postId (UUID)
- userId (UUID)
- createdAt (DateTime)

### Like

- id (UUID)
- postId (UUID)
- userId (UUID)
- Unique constraint on [postId, userId]

## Running the Application

Development mode:

```bash
npm start
```

The API will be available at `http://localhost:3000` (or the port specified in your .env file)

## Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Rate limiting to prevent abuse
- CORS protection
- Input validation and sanitization
- Request logging

## Error Handling

The API implements a global error handling middleware that provides consistent error responses:

- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Not found errors (404)
- Internal server errors (500)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License

## Author

[Your Name]

---

For detailed documentation about the API endpoints and their usage, please refer to the API documentation.
