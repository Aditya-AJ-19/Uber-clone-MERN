# User Registration API — `/api/users/register`

## Overview
- Purpose: Create a new user account and return a JWT for subsequent authentication.
- Method and Path: `POST /api/users/register`
- Mounting: The users router is mounted at `/api/users` in `Backend/app.js`, so the full path is `/api/users/register`.
- Default Base URL: `http://localhost:4000` (configurable via `PORT` in environment). See `Backend/server.js`.

## Request Format
- Content Type: `application/json`
- Body fields:
  - `fullname.firstname` — string, required, minimum length 3
  - `fullname.lastname` — string, optional, minimum length 3 if provided
  - `email` — string, required, valid email format, minimum length 5, must be unique
  - `password` — string, required, minimum length 6
- Validation
  - Implemented via `express-validator` in the route:
    - `email` must be a valid email
    - `fullname.firstname` must be at least 3 characters
    - `password` must be at least 6 characters
  - Additional schema constraints (Mongoose):
    - `email` has uniqueness and min length 5
    - `fullname.firstName` is required and min length 3
    - `fullname.lastName` min length 3 (optional)
- Example JSON request:
```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice@example.com",
  "password": "password123"
}
```

## Response Format
- `201 Created` — Successful registration
  - Body:
    ```json
    {
      "token": "JWT_TOKEN_STRING",
      "user": {
        "_id": "665f0b1c2a3c4d5e6f7a8b9c",
        "fullname": {
          "firstName": "Alice",
          "lastName": "Smith"
        },
        "email": "alice@example.com"
      }
    }
    ```
    Notes:
    - The JWT is generated using `process.env.JWT_SECRET`.
    - The password is stored hashed; the schema uses `select: false` for `password` to avoid returning it in queries.
- `400 Bad Request` — Validation failure (missing/invalid parameters)
  - Body (shape produced by `express-validator`):
    ```json
    {
      "errors": [
        {
          "msg": "Invalid Email",
          "path": "email",
          "location": "body"
        },
        {
          "msg": "First name must be at least 3 characters long",
          "path": "fullname.firstname",
          "location": "body"
        },
        {
          "msg": "Password must be at least 6 characters long",
          "path": "password",
          "location": "body"
        }
      ]
    }
    ```
- `409 Conflict` — User already exists (duplicate email)
  - Intended body:
    ```json
    { "error": "User already exists" }
    ```
  - Current behavior:
    - The code relies on Mongoose's unique index; a duplicate key error is thrown but is not explicitly mapped to `409`. Without a custom error handler, this will surface as a server error (typically `500`). See “Implementation Details” for context.
- `500 Internal Server Error` — Unexpected server-side failure
  - Examples:
    - Missing `JWT_SECRET` during token generation
    - Unhandled database errors (including duplicate key errors, unless explicitly handled)
  - Example body (actual shape depends on global error handler configuration):
    ```json
    { "error": "Internal Server Error" }
    ```

## Implementation Details
- Routes: `/d:/Projects/MERN/Uber-clone-MERN/Backend/routes/user.routes.js`
  - Defines `POST /register` with validations and delegates to the controller.
- Controller: `/D:/Projects/MERN/Uber-clone-MERN/Backend/controllers/user.controller.js`
  - Validates request using `validationResult`.
  - Hashes the password via `userModel.hashPassword`.
  - Calls the service to create the user.
  - Generates a JWT via `user.generateAuthToken` and returns `201` with `{ token, user }`.
- Service: `/D:/Projects/MERN/Uber-clone-MERN/Backend/services/user.service.js`
  - Performs the `userModel.create` call.
  - Enforces that `firstname`, `email`, and `password` are present (throws if missing).
- Model: `/D:/Projects/MERN/Uber-clone-MERN/Backend/models/user.model.js`
  - Mongoose schema with `fullname`, `email` (unique), `password` (`select: false`), `socketId`.
  - Methods:
    - `hashPassword(password)` — bcrypt hashing with salt rounds 10.
    - `generateAuthToken()` — signs `{ _id }` using `process.env.JWT_SECRET`.
- App mounting:
  - `Backend/app.js` mounts the router at `/api/users`:
    ```js
    app.use("/api/users", userRouter);
    ```
  - Server entry: `Backend/server.js` listens on `process.env.PORT || 3000`.

## Authentication Requirements
- No authentication is required to access this endpoint.
- Required headers:
  - `Content-Type: application/json`

## Testing Instructions
- Prerequisites:
  - Node.js and npm installed.
  - MongoDB available. Connection string defaults to `mongodb://localhost:27017/uber-clone`, override via `MONGODB_URI`.
  - Environment variables:
    - `JWT_SECRET` — required for token generation.
    - `MONGODB_URI` — optional, for non-default DB.
    - `PORT` — optional (defaults to `3000`).
- Setup and run:
  ```bash
  cd Backend
  npm install
  npm run dev
  ```
- cURL — Successful registration:
  ```bash
  curl -X POST "http://localhost:3000/api/users/register" \
       -H "Content-Type: application/json" \
       -d '{"fullname":{"firstname":"Alice","lastname":"Smith"},"email":"alice@example.com","password":"password123"}'
  ```
- cURL — Validation error (invalid email):
  ```bash
  curl -X POST "http://localhost:3000/api/users/register" \
       -H "Content-Type: application/json" \
       -d '{"fullname":{"firstname":"Al"},"email":"not-an-email","password":"123"}'
  ```
- cURL — Duplicate email (current code may return 500 unless error handling maps to 409):
  ```bash
  curl -X POST "http://localhost:3000/api/users/register" \
       -H "Content-Type: application/json" \
       -d '{"fullname":{"firstname":"Alice","lastname":"Smith"},"email":"alice@example.com","password":"password123"}'
  ```

## Notes
- Ensure `JWT_SECRET` is set before testing; otherwise token generation will fail.
- To return `409 Conflict` on duplicate emails, add an error handler that maps MongoDB duplicate key errors (E11000) to `409`.

