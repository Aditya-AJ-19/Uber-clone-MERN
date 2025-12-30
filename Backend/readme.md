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

## Notes

- Ensure `JWT_SECRET` is set before testing; otherwise token generation will fail.
- To return `409 Conflict` on duplicate emails, add an error handler that maps MongoDB duplicate key errors (E11000) to `409`.
