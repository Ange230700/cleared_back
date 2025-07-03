<!-- README.md -->

# cleared_back

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A robust, modular backend API for managing environmental cleanup events, volunteer participation, and waste collection data. Designed for scalability, extensibility, and security, **cleared_back** provides RESTful endpoints for user authentication, collection events, garbage tracking, and volunteer coordination. The project uses modern patterns (domain-driven, layered architecture), rigorous testing, and developer-friendly tooling.

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
<!-- * [Deployment](#deployment) -->
- [Environment Variables](#environment-variables)
<!-- * [Contributing](#contributing) -->
- [License](#license)
  <!-- * [Acknowledgements](#acknowledgements) -->
  <!-- * [Contact](#contact) -->

## Demo

API documentation and interactive demo available at:
[https://cleared-back.onrender.com/api/docs](https://cleared-back.onrender.com/api/docs)

## Tech Stack

**Backend:**

- Node.js
- Express
- TypeScript

**Database:**

- MySQL (via Prisma ORM)
- Compatible with other SQL databases if configured

**Documentation & Tools:**

- Swagger / OpenAPI (auto-generated docs)
  <!-- - Docker (optional, for containerized development) -->
  <!-- - GitHub Actions (CI/CD) -->
- Commitizen (conventional commits)

## Getting Started

### Prerequisites

- Node.js (>=20.x)
- MySQL database (or compatible, configured in `.env`)
- Docker (optional, for local DB/testing)

### Installation

```bash
git clone https://github.com/username/cleared_back.git
cd cleared_back
npm install
```

## Running the Project

Start backend:

```bash
npm run dev
```

**Optional:**
Seed the database for local development:

```bash
npm run prisma:db:seed
```

## Project Structure

```
├── src
│   ├── api         # Express app, routes, controllers, middlewares
│   ├── application # Use cases, repositories (interfaces)
│   ├── core        # Entities (domain models)
│   └── infrastructure # Repositories (Prisma implementations)
├── prisma
│   ├── schema.prisma    # DB schema
│   ├── collection/      # Seed scripts
│   └── ...
└── docs
    └── API Documentation (Swagger)
```

## API Documentation

The API exposes endpoints for:

- **Authentication:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`
- **Collection Events:** CRUD on `/api/collections`
- **Garbage Tracking:** CRUD on `/api/garbage`
- **Volunteer Management:** CRUD on `/api/volunteers`
- **Volunteer-Collection Assignment:** CRUD on `/api/volunteer_collection`

Interactive docs available at:
`/api/docs` (Swagger UI)

## Testing

To run tests:

```bash
npm test
```

<!-- ## Deployment

Deploy using Docker or your preferred Node.js hosting.
Example for Docker Compose (not included by default):

1. Copy `.env.example` to `.env` and fill in secrets.
2. Build and run containers:

   ```bash
   docker compose up --build
   ``` -->

## Environment Variables

Create a `.env` file at project root with:

```env
DATABASE_URL=mysql://user:password@localhost:3306/cleared
JWT_SECRET=your-secret-key
PORT=3001
FRONT_API_BASE_URL=http://localhost:3000
```

<!-- ## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Create a Pull Request -->

## License

MIT License

<!-- ## Acknowledgements

* [Express](https://expressjs.com/)
* [Prisma](https://prisma.io/)
* [Swagger](https://swagger.io/)
* [Commitizen](https://commitizen.github.io/cz-cli/)
* [Faker](https://fakerjs.dev/) (for seeding data) -->

<!-- ## Contact

Ange KOUAKOU - [your.email@example.com](mailto:your.email@example.com) -->

[Project Link](https://github.com/Ange230700/cleared_back)
