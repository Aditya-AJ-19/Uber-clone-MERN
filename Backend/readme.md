# User Registration API — `/api/users/register`

## Overview

- Purpose: Create a new user account and return a JWT for subsequent authentication.
- Method and Path: `POST /api/users/register`
- Mounting: The users router is mounted at `/api/users` in `Backend/app.js`, so the full path is `/api/users/register`.
- Default Base URL: `http://localhost:3000` (configurable via `PORT` in environment). See `Backend/server.js`.

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

## User Login API — `/api/users/login`

- Method and Path: `POST /api/users/login` (mounted under `/api/users`, full path: `/api/users/login`)
- Purpose: Authenticate an existing user by verifying credentials and return a JWT.

### Request Format

- Content Type: `application/json`
- Body fields:
  - `email` — string, required, valid email format
  - `password` — string, required, minimum length 6
- Validation:
  - `email` must be a valid email
  - `password` must be at least 6 characters
- Example JSON request:

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Response Format

- `200 OK` — Successful login
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
- `401 Unauthorized` — Invalid credentials
  - Body:
    ```json
    { "message": "Invalid email or password" }
    ```
- `500 Internal Server Error` — Server failure
  - Body (shape depends on global error handler):
    ```json
    { "error": "Internal Server Error" }
    ```

## User Profile API — `/api/users/profile`

- Method and Path: `GET /api/users/profile` (mounted under `/api/users`, full path: `/api/users/profile`)
- Purpose: Retrieve the authenticated user's profile.
- Authentication: Required. Provide JWT via `Cookie: token=...` or `Authorization: Bearer <token>`.

### Request Format

- Headers:
  - `Authorization: Bearer <JWT>` or `Cookie: token=<JWT>`
- Body: None
- Example request (Bearer):

```http
GET /api/users/profile HTTP/1.1
Host: localhost:3000
Authorization: Bearer JWT_TOKEN_STRING
```

- Example request (Cookie):

```http
GET /api/users/profile HTTP/1.1
Host: localhost:3000
Cookie: token=JWT_TOKEN_STRING
```

### Response Format

- `200 OK` — Successful retrieval
  - Body:
    ```json
    {
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
- `401 Unauthorized` — Missing/invalid/blacklisted token or user not found
  - Body:
    ```json
    { "message": "Unauthorized." }
    ```
- `500 Internal Server Error` — Unexpected server error
  - Body (shape depends on global error handler):
    ```json
    { "error": "Internal Server Error" }
    ```

## User Logout API — `/api/users/logout`

- Method and Path: `POST /api/users/logout` (mounted under `/api/users`, full path: `/api/users/logout`)
- Purpose: Invalidate the current session token by blacklisting it and clear the cookie.
- Authentication: Required. Provide JWT via `Cookie: token=...` or `Authorization: Bearer <token>`.
- Security considerations:
  - Login sets an HTTP-only cookie (`token`) with `secure` in production and `maxAge` 3600000 (1 hour).
  - JWTs are signed with `process.env.JWT_SECRET` and have `expiresIn: '24h'`.
  - Blacklisted tokens are stored with a TTL of 24 hours to prevent reuse.

### Request Format

- Headers:
  - `Authorization: Bearer <JWT>` or `Cookie: token=<JWT>`
- Body: None
- Example request:

```http
POST /api/users/logout HTTP/1.1
Host: localhost:3000
Authorization: Bearer JWT_TOKEN_STRING
```

### Response Format

- `200 OK` — Successful logout
  - Body:
    ```json
    { "message": "Logged out successfully." }
    ```
- `401 Unauthorized` — Missing token
  - Body:
    ```json
    { "message": "Unauthorized." }
    ```
- `500 Internal Server Error` — Unexpected server error
  - Body (shape depends on global error handler):
    ```json
    { "error": "Internal Server Error" }
    ```

## Captain Registration API — `/api/captains/register`

- Method and Path: `POST /api/captains/register` (mounted under `/api/captains`, full path: `/api/captains/register`)
- Purpose: Register a new captain account.

### Request Format

- Headers:
  - `Content-Type: application/json`
- Body fields:
  - `fullname.firstname` — string, required, minimum length 3
  - `fullname.lastname` — string, optional, minimum length 3 if provided
  - `email` — string, required, valid email format, must be unique
  - `password` — string, required, minimum length 6
  - `vehicle.color` — string, required, minimum length 3
  - `vehicle.plate` — string, required, minimum length 3
  - `vehicle.capacity` — number, required, minimum 1
  - `vehicle.vehicleType` — string, required, one of: "car", "motorcycle", "auto"
- Example JSON request:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Response Format

- `201 Created` — Successful registration
  - Body:
    ```json
    {
      "captain": {
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC-1234",
          "capacity": 4,
          "vehicleType": "car"
        },
        "_id": "665f0b1c2a3c4d5e6f7a8b9d"
      },
      "token": "JWT_TOKEN_STRING"
    }
    ```
- `400 Bad Request` — Validation failure or captain already exists
  - Body (Validation Errors):
    ```json
    {
      "errors": [
        {
          "msg": "Invalid email",
          "path": "email",
          "location": "body"
        }
      ]
    }
    ```
  - Body (Already Registered):
    ```json
    { "error": "Captain already registered" }
    ```
- `500 Internal Server Error` — Unexpected server error
  - Body:
    ```json
    { "error": "Internal Server Error" }
    ```

## Notes

- Ensure `JWT_SECRET` is set before testing; otherwise token generation will fail.
- To return `409 Conflict` on duplicate emails, add an error handler that maps MongoDB duplicate key errors (E11000) to `409`.
