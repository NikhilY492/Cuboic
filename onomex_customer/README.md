# 📱 Onomex Customer Web App

> Mobile-first, zero-install customer dining application for the Onomex platform. Customers scan a table QR code on their smartphone to browse interactive menus, customize orders, pay, and track autonomous robot delivery in real-time.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started & Development](#-getting-started--development)
- [Simulating Table QR Scans](#-simulating-table-qr-scans)
- [Production Build & Docker](#-production-build--docker)
- [Project Structure](#-project-structure)

---

## ✨ Features

- 📱 **QR Code Table Entry**: No app download or registration required; customers scan their table's QR code to enter a customized session.
- 🍲 **Rich Visual Menu**: High-resolution imagery, category filtering, vegetarian / non-vegetarian badges, spice levels, and search.
- 🛒 **Interactive Cart Drawer**: Floating cart badge with a slide-up drawer for item customization, notes, and quantities.
- 💳 **Flexible Payment Selection**: Supports UPI, Card payment, and Cash-to-table checkout options.
- 🤖 **Live Autonomous Delivery Tracker**: Real-time Socket.IO status tracker showing preparation status, robot dispatch, table arrival, and compartment PIN unlocking.
- 🎉 **Celebratory Checkout**: Confetti animations and clear digital invoice generation.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **[React 19](https://react.dev/)** | Component-driven user interface with latest React features |
| **[Vite 6](https://vite.dev/)** | Next-generation blazing fast frontend tooling and HMR |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict type definitions for menu and order models |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern utility-first responsive styling and animations |
| **[Socket.IO Client](https://socket.io/)** | Real-time WebSocket connection for live order and delivery status |
| **[Axios](https://axios-http.com/)** | HTTP client for interacting with the NestJS backend API |
| **[Lucide React](https://lucide.dev/)** | Clean, responsive vector icons |
| **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** | Interactive checkout completion celebration effect |

---

## 📦 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or later (LTS recommended)
- **npm**: `v9.x` or later
- Running instance of **`onomex_backend`** (typically running at `http://localhost:3000`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `onomex_customer/`:

```env
# Backend REST API endpoint
VITE_API_URL=http://localhost:3000

# Backend WebSocket (Socket.IO) endpoint
VITE_SOCKET_URL=http://localhost:3000
```

> [!NOTE]
> When testing on a physical smartphone over local Wi-Fi, change `localhost` to your computer's local network IP address (e.g., `http://192.168.1.100:3000`) in both `.env` and when opening the web browser.

---

## 🚀 Getting Started & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Vite will boot the development server on **`http://localhost:5173`** (or the next available port).

3. **Code Quality & Linting**:
   ```bash
   npm run lint
   ```

---

## 🏷️ Simulating Table QR Scans

In production, each restaurant table has a physical QR code encoding a URL with table credentials. During local development, simulate this by adding query parameters to your browser URL:

```
http://localhost:5173/?r=<RESTAURANT_ID>&t=<TABLE_ID>
```

### Example Test URL:
```
http://localhost:5173/?r=67b8d9c2e4b0a1d2f3a4b5c6&t=67b8d9c2e4b0a1d2f3a4b5c7
```

> [!TIP]
> You can retrieve valid `restaurant_id` and `table_id` values by running `npm run seed` in `onomex_backend` or checking Prisma Studio (`npx prisma studio` inside `onomex_backend`).

---

## 🚢 Production Build & Docker

### Local Static Build
```bash
# Compile TypeScript and bundle assets into dist/
npm run build

# Preview the production build locally
npm run preview
```

### Docker Containerization
The folder includes a production-ready multi-stage `Dockerfile` using Nginx:

```bash
# Build Docker image
docker build -t onomex-customer .

# Run container on port 8082
docker run -d -p 8082:80 --name onomex-customer-app onomex-customer
```

The app will be accessible at `http://localhost:8082`.

---

## 📁 Project Structure

```
onomex_customer/
├── public/                 # Static assets, logos, and favicon
├── src/
│   ├── api/                # API service wrappers (menu.ts, orders.ts)
│   ├── components/         # UI components:
│   │   ├── ItemCard.tsx    # Menu item card with add-to-cart button
│   │   ├── CartDrawer.tsx  # Bottom-sheet cart & checkout summary
│   │   ├── StatusTimeline.tsx # Order tracking step progression
│   │   └── Navbar.tsx      # Header with table number and cart pill
│   ├── hooks/              # Custom React hooks (useCart, useSocket)
│   ├── types/              # TypeScript interfaces (MenuItem, Order, Table)
│   ├── pages/              # Main view screens:
│   │   ├── MenuPage.tsx    # Category & item browsing
│   │   ├── CheckoutPage.tsx# Order confirmation & payment mode
│   │   └── OrderTrackerPage.tsx # Live robot delivery tracking
│   ├── App.tsx             # Root layout and query parameter extraction
│   ├── main.tsx            # Application entry point
│   └── index.css           # Tailwind CSS directives and global theme styles
├── Dockerfile              # Multi-stage Nginx production container
├── vite.config.ts          # Vite configuration with React and Tailwind plugins
└── package.json            # Project dependencies and build scripts
```
