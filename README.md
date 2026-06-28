# FreshMart Pro

FreshMart Pro is a premium, production-ready e-commerce platform built with Next.js 15, React 19, Tailwind CSS v4, and Prisma. It features a modern, animated user interface with fully functional cart state management, secure authentication, and robust database models.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Database ORM:** Prisma (PostgreSQL)
- **Authentication:** Auth.js v5 (NextAuth)
- **State Management:** Zustand (Cart), TanStack Query (Data Fetching)
- **Animations:** Framer Motion

## Local Development Setup

### 1. Environment Variables

Create a `.env` file in the root directory and add the following configurations:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freshmart?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# OAuth Providers (Optional for local dev, required for Google Login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Initialization

You can run the PostgreSQL database locally using Docker Compose, or connect to your own cloud instance.

Start the local database:
```bash
docker-compose up db -d
```

Push the Prisma schema to the database and generate the client:
```bash
npx prisma generate
npx prisma db push
```

Seed the database with default categories, products, and the Admin user:
```bash
npx tsx prisma/seed.ts
```
*(Default Admin Login: `admin@freshmart.com` / `admin123`)*

### 3. Run the Development Server

Install dependencies and start the app:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Production Deployment

To run the entire stack (Database + Next.js App) in a production-like Docker environment:

1. Update the `next.config.ts` to output a standalone build:
   ```typescript
   // next.config.ts
   export default {
     output: "standalone",
     // ... other config
   };
   ```

2. Build and run via Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

3. The application will be available at `http://localhost:3000`.

## Key Features

- **Responsive Design:** Mobile-first fluid typography and layout grids.
- **Role-Based Access Control:** Distinct dashboards for Customers and Administrators.
- **Real-Time Cart:** Zustand-powered cart persisting to localStorage.
- **Advanced Filtering:** API routes supporting cursor pagination, keyword search, and complex multi-faceted filtering.
- **Transactional Integrity:** Secure server-side order processing and inventory decrementing within Prisma transactions.
