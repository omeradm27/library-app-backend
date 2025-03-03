# Library App Backend

This is the backend for the **Library App**, a RESTful API built with **Node.js, Express, and Prisma** for managing users, books, and borrow records.

## Features

- User management (CRUD operations)
- Book catalog (CRUD operations)
- Borrowing & returning books
- Database migrations with Prisma
- Environment-based database setup (local/remote)

## Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 16.x recommended)
- **PostgreSQL** (for local development)
- **Prisma CLI**
- **Docker** (Optional, for running PostgreSQL locally)

## Getting Started

### Option 1: Using Git Clone

#### 1. Clone the Repository

```sh
git clone https://github.com/omeradm27/library-app-backend.git
cd library-app-backend
```

### Option 2: Using ZIP File

#### 1. Extract the ZIP File
- Download and extract the provided ZIP file.
- Navigate into the extracted folder.

```sh
cd library-app-backend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure the Environment Variables

Create a **.env** file at the root directory:

#### For Local Database

```sh
DATABASE_URL="postgres://your_user:your_password@localhost:5432/librarydb"
FRONTEND_URL="http://localhost:4000"
PORT=3000
```

Replace `your_user`, `your_password`, and `librarydb` with your actual PostgreSQL credentials.

#### For Remote Database (Production)

```sh
DATABASE_URL="postgres://neondb_owner:npg_Ab9pPt0jgSLx@ep-aged-credit-a2xlsr5c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
FRONTEND_URL="https://library-app-web.vercel.app/"
PORT=3000
```

## Database Setup

### 4. (Optional) Run PostgreSQL Locally using Docker

```sh
docker run --name library-postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=librarydb -p 5432:5432 -d postgres
```

### 5. Run Migrations

```sh
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```sh
npx prisma generate
```

## Seeding the Database

To populate the database with sample data:

```sh
npm run seed
```

## Running the Server

### Development Mode

```sh
npm run dev
```

### Production Mode

```sh
npm run build_first && npm start
```

## API Endpoints

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| GET    | `/users`                    | Get all users    |
| GET    | `/users/:id`                | Get user details |
| POST   | `/users`                    | Create new user  |
| GET    | `/books`                    | Get all books    |
| GET    | `/books/:id`                | Get book details |
| POST   | `/users/:id/borrow/:bookId` | Borrow a book    |
| POST   | `/users/:id/return/:bookId` | Return a book    |
| POST   | `/users/:id/rate/:bookId`   | Rate a book      |


### Common Issues:

1. **Database connection issues?**

   - Ensure PostgreSQL is running locally (`docker ps` if using Docker)
   - Check `.env` variables and database credentials
   - Run `npx prisma migrate dev` again

2. **Prisma Client not found?**

   - Run `npx prisma generate`

3. **Server crashes on start?**

   - Ensure the correct Node.js version is installed
   - Check logs for missing dependencies and install them (`npm install`)

## License

This project is licensed under the MIT License.

## Contact

For issues or suggestions, reach out via GitHub or email.

