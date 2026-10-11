# 🤖 Onomex / Cuboic — Autonomous Robot Food Delivery Platform

> A comprehensive full-stack restaurant automation ecosystem where autonomous mobile robots deliver food directly to dining tables. Patrons scan a table QR code on their smartphone to order and pay, while staff manage kitchen tickets, table turns, inventory, and robot fleets via native desktop and mobile applications.

---

## 📐 Platform Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Onomex Monorepo                                      │
│                                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │   onomex_customer    │  │    onomex_desktop    │  │        onomex_mobile         │  │
│  │  Vite + React (Web)  │  │ Electron + React POS │  │    Expo / React Native App   │  │
│  │      Port: 5173      │  │    Desktop Terminal  │  │       iOS & Android          │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └──────────────┬───────────────┘  │
│             │                         │                             │                  │
│             │                         │ REST & Socket.IO            │                  │
│             └─────────────────────────┼─────────────────────────────┘                  │
│                                       ▼                                                │
│                          ┌──────────────────────────┐                                  │
│                          │      onomex_backend      │◄───────────┐                     │
│                          │  NestJS 11 · Prisma ORM  │            │                     │
│                          │    PostgreSQL · Redis    │            │ WebRTC Signaling    │
│                          │        Port: 3000        │            │ & Telemetry         │
│                          └────────────┬─────────────┘            │                     │
│                                       │                          │                     │
│                                       ▼                          │                     │
│                          ┌──────────────────────────┐  ┌─────────┴──────────────────┐  │
│                          │  PostgreSQL (Neon Cloud) │  │       robot_scripts        │  │
│                          │    & Redis Cache Layer   │  │  Python WebRTC Robot Client│  │
│                          └──────────────────────────┘  └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Services & Sub-Projects Overview

Each folder contains a self-contained application with its own configuration, dev scripts, and documentation:

| Sub-Project | Stack | Port / Platform | Role & Documentation |
|---|---|---|---|
| [**onomex_backend**](./onomex_backend/README.md) | NestJS 11 · Prisma 6 · PostgreSQL · Redis · Socket.IO | `3000` | REST API, real-time WebSocket bus, and WebRTC signaling. [Read Setup Guide →](./onomex_backend/README.md) |
| [**onomex_customer**](./onomex_customer/README.md) | Vite 6 · React 19 · TypeScript · Tailwind CSS v4 | `5173` | Mobile-first customer QR code menu, cart, checkout, and live delivery tracker. [Read Setup Guide →](./onomex_customer/README.md) |
| [**onomex_desktop**](./onomex_desktop/README.md) | Electron 41 · React 19 · Vite 8 · Tailwind CSS v4 | Desktop (Win / Mac) | "T Manager" POS, table floor layout, thermal KOT printing, and live robot WebRTC video feeds. [Read Setup Guide →](./onomex_desktop/README.md) |
| [**onomex_mobile**](./onomex_mobile/README.md) | Expo SDK 57 · React Native 0.86 · React Navigation | Android / iOS / Web | Manager mobile app with voice speech alerts, fleet monitor, and live dispatch. [Read Setup Guide →](./onomex_mobile/README.md) |
| [**onomex_public**](./onomex_public/README.md) | Vite 8 · React 19 · Tailwind CSS v4 · Motion | `5173+` | Public marketing, landing page, and interactive product showcase. [Read Setup Guide →](./onomex_public/README.md) |
| [**robot_scripts**](./robot_scripts/README.md) | Python 3 · aiortc · OpenCV · asyncio | Hardware / Linux | Autonomous robot onboard WebRTC signaling and camera streamer. [Read Setup Guide →](./robot_scripts/README.md) |
| [**cuboic_demand_model**](./onomex_desktop/cuboic_demand_model/README.md) | Python 3 · Scikit-Learn · Pandas · NumPy | ML / Analytics | Revenue forecasting, hourly peak rush classification, and ingredient restock predictions. [Read Setup Guide →](./onomex_desktop/cuboic_demand_model/README.md) |

---

## ⚡ Quick Start: Running the Full Stack Locally

### 1. Prerequisites
- **Node.js**: `v18.x` or `v20.x`+ (LTS)
- **npm**: `v9.x` or later
- **Python**: `3.9+` (for `robot_scripts` and `cuboic_demand_model`)
- **PostgreSQL**: PostgreSQL instance or cloud database (e.g. Neon.tech)
- **Redis**: Local Redis server or Docker (`redis:alpine`)

---

### 2. Start the Backend API & Database

```bash
cd onomex_backend

# 1. Install dependencies & generate Prisma client
npm install

# 2. Configure .env
# (Set your DATABASE_URL, JWT_SECRET, and REDIS connection parameters)

# 3. Synchronize database schema & seed initial accounts
npx prisma db push
npm run seed

# 4. Start NestJS in watch mode (Port 3000)
npm run start:dev
```

> **Default Seed Credentials:**
> - **Owner**: `owner01` / `password123`
> - **Staff**: `staff01` / `password123`

---

### 3. Launch the Desktop POS Terminal

In a new terminal window:

```bash
cd onomex_desktop
npm install
npm run dev
```
*This launches the native Electron application window with live hot reloading.*

---

### 4. Launch the Customer Web Menu

In a new terminal window:

```bash
cd onomex_customer
npm install
npm run dev
```
*Open `http://localhost:5173/?r=<RESTAURANT_ID>&t=<TABLE_ID>` using the restaurant and table IDs printed by the backend seed script.*

---

### 5. Launch the Mobile Management App (Optional)

In a new terminal window:

```bash
cd onomex_mobile
npm install
npm start
```
*Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code using the Expo Go mobile app.*

---

### 6. Run the Autonomous Robot WebRTC Streamer (Optional)

In a new terminal window:

```bash
cd robot_scripts
python -m venv venv
# On Windows: .\venv\Scripts\Activate.ps1 | On Linux: source venv/bin/activate
pip install -r requirements.txt
python robot-webrtc-client.py
```

---

## 📜 License

MIT License. See individual sub-project directories for additional licensing or dependency terms.
