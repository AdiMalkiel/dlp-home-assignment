# DLP Backend – Simplified DLP Platform

A backend service for managing Data Types (DTs), grouping them into Data Sets (DSs), and scanning text for sensitive content using keyword-based inspection.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Kysely
- Zod
- Vitest
- Docker / Docker Compose

## Architecture

The application is implemented as a single backend service with three logical API modules:

```text
src/
├── config/
├── db/
├── middleware/
└── modules/
    ├── data-types/
    ├── data-sets/
    └── scan/
```

Each module separates:

- **Routes** – HTTP/API layer
- **Schemas** – request validation and TypeScript types
- **Services** – business logic and database operations

The database uses three tables:

```text
data_types
data_sets
data_set_data_types
```

`data_set_data_types` is a junction table representing the many-to-many relationship between Data Sets and Data Types.

## Getting Started

### Option 1 – Docker (Recommended)

Make sure Docker Desktop is running, then run:

```bash
docker compose up --build
```

This will:

1. Start PostgreSQL.
2. Wait until PostgreSQL is healthy.
3. Build the backend image.
4. Run all database migrations automatically.
5. Start the backend on port `3000`.

The seed data is **not** executed automatically, so the application starts with an empty database.

API:

```text
http://localhost:3000
```

To stop the application:

```bash
docker compose down
```

The PostgreSQL data is persisted in a Docker volume.

### Option 2 – Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/dlp
```

Run the database migrations:

```bash
npm run migrate:latest
```

Start the development server:

```bash
npm run dev
```

## Seed Data

Seed data is provided for convenient manual testing, but is intentionally not executed automatically.

To populate the database:

```bash
npm run db:seed
```

This allows the application to be tested both with an empty database and with predefined sample data.

## API

### Data Types

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/datatypes`     | Create a Data Type    |
| GET    | `/api/datatypes`     | Get all Data Types    |
| GET    | `/api/datatypes/:id` | Get a Data Type by ID |
| PATCH  | `/api/datatypes/:id` | Update a Data Type    |
| DELETE | `/api/datatypes/:id` | Delete a Data Type    |

Example:

```json
{
  "name": "Credit Card",
  "description": "Detects credit card related keywords",
  "type": "keywords",
  "content": ["visa", "mastercard", "amex"],
  "threshold": 2
}
```

### Data Sets

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/datasets`     | Create a Data Set    |
| GET    | `/api/datasets`     | Get all Data Sets    |
| GET    | `/api/datasets/:id` | Get a Data Set by ID |
| PATCH  | `/api/datasets/:id` | Update a Data Set    |
| DELETE | `/api/datasets/:id` | Delete a Data Set    |

Example:

```json
{
  "name": "Payment Information",
  "dataTypeIds": ["data-type-uuid-1", "data-type-uuid-2"]
}
```

### Scan

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| POST   | `/api/scan` | Scan text using a Data Set |

Example request:

```json
{
  "dataSetId": "data-set-uuid",
  "text": "Visa and Mastercard were detected"
}
```

Example response when matched:

```json
{
  "status": "match",
  "detected_objects": [
    {
      "id": "data-type-uuid",
      "name": "Credit Card",
      "match_count": 2
    }
  ]
}
```

Example response when there are no matches:

```json
{
  "status": "not matched"
}
```

## Scan Logic

The scan flow is:

```text
Scan Request
     ↓
Load Data Set
     ↓
Load referenced Data Types
     ↓
Evaluate each Data Type independently
     ↓
Count keyword matches
     ↓
Compare match count against threshold
     ↓
Return detected objects
```

Each Data Type is evaluated independently.

A Data Type matches when:

```text
match_count >= threshold
```

The Data Types use **OR logic**: if at least one Data Type matches, the overall scan result is `match`.

## Validation and Error Handling

Request bodies and route parameters are validated using Zod.

Invalid requests return `400 Bad Request` with validation details.

For example:

```json
{
  "message": "Invalid request",
  "errors": [...]
}
```

Missing resources return `404 Not Found`.

Unexpected errors are handled by a centralized Express error handler and return:

```json
{
  "message": "Internal server error"
}
```

## Tests

The project includes unit tests for the core scan utilities.

Run the tests with:

```bash
npx vitest run
```

The tests cover:

- Regex escaping
- Case-insensitive matching
- Whole-word matching
- Multiple keywords
- Empty keyword lists
- Threshold matching
- Match counts
- No-match scenarios

## Design Decisions & Trade-offs

### Junction table instead of a PostgreSQL array

The API represents a Data Set as containing an array of `dataTypeIds`, as described in the assignment.

In the database, however, this relationship is represented using a junction table:

```text
data_set_data_types
├── data_set_id
└── data_type_id
```

This was a deliberate design choice rather than storing the UUIDs directly in a PostgreSQL array.

A junction table provides a normalized relational model, allows foreign key constraints, prevents references to non-existing Data Types, and makes the relationship easier to query and extend in the future.

The API therefore exposes the simpler `dataTypeIds` representation while the database maintains the normalized structure.

### Keyword matching with regex

Keyword matching is case-insensitive and uses regex word boundaries to implement whole-word matching.

Keywords are escaped before being inserted into the regex so that characters such as `+`, `.`, `*`, etc. are treated as literal characters rather than regex operators.

There is a known limitation with JavaScript's `\b` word boundary: it is defined around `\w` characters (`A-Z`, `a-z`, `0-9`, and `_`). Therefore, keywords containing leading or trailing non-word characters, such as `#tag`, `$100`, or some special-character-based terms, are not handled as a fully general natural-language word boundary.

This is a conscious simplification for the scope of the assignment. A more advanced implementation could use explicit lookarounds or tokenization depending on the desired definition of a "whole word".

### Seed is manual

Migrations run automatically when the application starts through Docker, but seed data does not.

This was intentional so that the application can be evaluated starting from a clean database. Sample data can still be added with:

```bash
npm run db:seed
```

### Separation of validation, routing and business logic

Validation is implemented as middleware, HTTP handling is kept in the route layer, and database/business logic is implemented in services.

This keeps the individual components small and makes the core logic easier to test independently from Express and the database.

### API naming conventions

Request bodies use `camelCase`, following common JavaScript/TypeScript conventions (for example, `dataTypeIds`).

Scan response fields use the `snake_case` naming specified in the assignment (for example, `detected_objects`), to match the required response format exactly.

## Future Improvements

If this were extended beyond the scope of the assignment, possible improvements would include:

- More sophisticated tokenization for keyword matching
- Support for additional Data Type inspection methods
- Pagination for collection endpoints
- More comprehensive integration tests
- Authentication and authorization
- Structured logging
- API documentation using OpenAPI/Swagger
- Asynchronous scanning for expensive inspection operations
