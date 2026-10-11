# ⚙️ Onomex Backend

> High-performance RESTful API, WebSocket event bus, and WebRTC signaling server for the Onomex autonomous restaurant platform, built with NestJS, Prisma ORM, PostgreSQL, and Redis.

---

## 📋 Table of Contents

- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Database Setup & Seeding](#-database-setup--seeding)
- [Running the Application](#-running-the-application)
- [Testing & Quality](#-testing--quality)
- [Docker Deployment](#-docker-deployment)
- [API & WebSocket Overview](#-api--websocket-overview)
- [Project Structure](#-project-structure)

---

## 🏗️ Architecture & Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [NestJS 11](https://nestjs.com/) | Progressive Node.js framework with modular TypeScript architecture |
| **Language** | TypeScript 5.7 | Strict type safety and decorators |
| **Database** | PostgreSQL (e.g. Neon DB) | Relational store for restaurants, orders, inventory, tables, and users |
| **ORM** | [Prisma 6](https://www.prisma.io/) | Schema definition, type-safe client generation, migrations |
| **Cache & Store** | Redis | In-memory cache for fast querying, session tracking, and rate limiting |
| **Real-Time** | Socket.IO 4.8 | Low-latency bi-directional event bus for live order updates & telemetry |
| **Signaling** | WebRTC Gateway (`/webrtc`) | Peer-to-peer SDP exchange & ICE routing for live robot camera feeds |
| **Auth** | Passport JWT & bcryptjs | Token-based authentication with role-based access control (Owner, Staff) |
| **File Storage** | Multer | Local multi-part file storage for menu images and attachments in `uploads/` |

---

## 📦 Prerequisites

Before starting the backend, make sure you have the following installed:

- **Node.js**: `v18.x` or later (LTS recommended)
- **npm**: `v9.x` or later
- **PostgreSQL**: PostgreSQL 14+ instance or cloud database (such as [Neon.tech](https://neon.tech))
- **Redis**: Redis 6+ (local service or via Docker)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `onomex_backend/` (you can duplicate `.env.example` if present):

```env
# Database connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/onomex?sslmode=prefer"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000

# Redis Cache
REDIS_HOST="localhost"
REDIS_PORT=6379
```

> [!TIP]
> If you are using a cloud PostgreSQL provider like Neon, ensure your `DATABASE_URL` includes SSL query parameters:
> `postgresql://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

---

## 🗄️ Database Setup & Seeding

1. **Install Dependencies & Generate Prisma Client**:
   ```bash
   npm install
   ```
   *(The `postinstall` script will automatically trigger `npx prisma generate`)*

2. **Synchronize Database Schema**:
   To apply the schema directly to your development database:
   ```bash
   npx prisma db push
   ```
   Or if you want to run formal migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Inspect Database (Prisma Studio)**:
   Launch the visual database browser:
   ```bash
   npx prisma studio
   ```

4. **Seed Sample Data**:
   Populate initial records (restaurant, tables, menu categories, menu items, robots, and user credentials):
   ```bash
   npm run seed
   ```

   **Default Seed Credentials:**
   | Role | Username / ID | Password |
   |---|---|---|
   | **Owner** | `owner01` | `password123` |
   | **Staff** | `staff01` | `password123` |

---

## 🚀 Running the Application

### Development Mode (with Hot Reload)
```bash
npm run start:dev
```
The NestJS server will start on **`http://localhost:3000`** with file watching enabled.

### Production Build & Launch
```bash
# 1. Compile TypeScript to JavaScript in dist/
npm run build

# 2. Start production server
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 🧪 Testing & Quality

```bash
# Run unit tests with Jest
npm run test

# Run unit tests in watch mode
npm run test:watch

# Test coverage report
npm run test:cov

# Run End-to-End (E2E) tests
npm run test:e2e

# Run Artillery performance & load testing
npm run test:load

# Generate Artillery load test HTML report
npm run test:load:report

# Run ESLint and auto-fix code issues
npm run lint

# Format code with Prettier
npm run format
```

---

## 🐳 Docker Deployment

The backend can be containerized and run alongside Redis and the customer portal:

```bash
# Build and start services in the background
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

The bundled `docker-compose.yml` configures:
- `backend`: NestJS application on port `3000`
- `redis`: Redis server on port `6379`
- `customer`: Customer frontend static web server on port `8082`

---

## 🔌 API & WebSocket Overview

### REST Endpoints Summary

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/auth/me` | JWT | Returns authenticated user profile and permissions |
| `GET` | `/restaurants/:id` | Public | Returns restaurant configuration and brand settings |
| `GET` | `/categories` | Public | Lists menu categories for a restaurant |
| `GET` | `/menu` | Public | Returns menu items filtered by category / restaurant |
| `POST` | `/orders` | Public / QR | Creates a customer order from a table session |
| `GET` | `/orders/:id` | Public / JWT | Retrieves order details and fulfillment stage |
| `PATCH` | `/orders/:id/status` | JWT (Staff) | Updates order workflow state (CONFIRMED, PREPARING, DELIVERED) |
| `GET` | `/tables` | JWT / Public | Table floor plan and occupancy states |
| `GET` | `/inventory` | JWT | Inventory stock levels and ingredient tracking |
| `GET` | `/robots` | JWT | Registered delivery robot fleet listing |
| `POST` | `/deliveries` | JWT | Dispatches robot delivery to a designated table |
| `POST` | `/upload/image` | JWT | Uploads restaurant/menu media files |

### Real-Time Socket.IO Channels

- **Order Updates**: `order:new:<restaurantId>`, `order:updated:<restaurantId>`
- **Delivery Updates**: `delivery:updated:<restaurantId>`
- **Robot Telemetry**: Coordinates, battery level, mission progress, cabinet sensor status
- **WebRTC Signaling Namespace**: `/webrtc` handles `register-robot`, `viewer-join`, `offer`, `answer`, and `ice-candidate` events for camera streaming.

---

## 📁 Project Structure

```
onomex_backend/
├── prisma/
│   ├── schema.prisma         # Prisma data model & database schema
│   ├── migrations/           # Versioned SQL migration files
│   └── seed-mock-orders.ts   # Mock order generator
├── src/
│   ├── auth/                 # JWT strategy, login DTO, guards & decorators
│   ├── orders/               # Order management & order status transitions
│   ├── menu/                 # Categories, menu items, allergens & pricing
│   ├── tables/               # Table layouts and QR identifier mapping
│   ├── robots/               # Fleet registry and state machine
│   ├── deliveries/           # Automated delivery missions & dispatching
│   ├── inventory/            # Ingredient stocks and consumption forecasting
│   ├── events/               # Global Socket.IO gateway
│   ├── robot-runtime/        # WebRTC signaling gateway & live telemetry
│   ├── upload/               # Static image and asset uploads
│   ├── prisma/               # PrismaClient provider service
│   ├── app.module.ts         # Root dependency injection module
│   ├── main.ts               # Application entry point & bootstrapping
│   └── seed.ts               # Database seeder script
├── scripts/                  # Maintenance, migration, and inspection scripts
├── uploads/                  # Uploaded menu photos and media assets
├── Dockerfile                # Production multi-stage Docker build
├── docker-compose.yml        # Multi-container orchestration (Backend + Redis)
└── package.json              # Dependencies and lifecycle scripts
```
