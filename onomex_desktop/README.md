# 🖥️ Onomex Desktop POS ("T Manager")

> Enterprise-grade Point of Sale (POS), kitchen dispatch, and autonomous robot fleet control desktop application built with Electron, React 19, Vite, and Tailwind CSS.

---

## 📋 Table of Contents

- [Overview & Capabilities](#-overview--capabilities)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Development Setup](#-development-setup)
- [Hardware & Thermal Printer Configuration](#-hardware--thermal-printer-configuration)
- [Live Robot WebRTC Monitoring](#-live-robot-webrtc-monitoring)
- [Packaging & Production Releases](#-packaging--production-releases)
- [Testing & Quality](#-testing--quality)
- [Project Structure](#-project-structure)

---

## 💡 Overview & Capabilities

**T Manager** is the mission control center for restaurant staff and management:

- 🧾 **Point of Sale (POS)**: Fast counter and dine-in billing, bill splitting, item modifiers, tax management, and multi-mode payment processing.
- 🖨️ **Thermal Receipt & KOT Printing**: Native integration with 58mm and 80mm ESC/POS thermal printers over USB and Network (LAN/Ethernet) for automated Kitchen Order Tickets (KOT) and customer receipts.
- 🪑 **Interactive Table Floor Plan**: Real-time table states (Available, Seated, Ordering, Billed), customer seat counts, and quick table transfers.
- 🤖 **Autonomous Fleet Dispatch**: Assign orders to delivery robots, monitor compartment locks/PINs, observe battery states, and dispatch robots to tables.
- 📹 **Live Robot Video Feeds**: Connect directly to robot cameras via peer-to-peer WebRTC video stream for teleoperation or visual verification.
- 📦 **Inventory & Recipe Deductions**: Automated raw ingredient stock deduction upon item sale, low stock alerts, and supplier purchase management.
- 📊 **Analytics & Reporting**: Sales dashboards, peak-hour analytics, and one-click export to PDF (`jspdf`) and Excel (`xlsx`).

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Desktop Shell** | [Electron 41](https://www.electronjs.org/) | Cross-platform desktop runtime with native OS hardware access |
| **Frontend Framework** | [React 19](https://react.dev/) | React 19 component ecosystem with Hooks and Context |
| **Tooling & Bundler** | [Vite 8](https://vite.dev/) + `vite-plugin-electron` | High-speed HMR and Electron main/preload bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern styling system with custom dark mode and typography |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + Lucide Icons | Accessible headless components and iconography |
| **Thermal Printing** | `electron-pos-printer` | ESC/POS thermal receipt printing via direct native spooling |
| **Real-Time** | Socket.IO Client | Real-time event communication with the backend |
| **Streaming** | WebRTC (native browser API) | Low-latency P2P video stream from robot cameras |
| **Packaging** | `electron-builder` | Executable distribution generation (NSIS installer / Portable EXE / DMG) |

---

## 📦 Prerequisites

- **Node.js**: `v18.x` or `v20.x`+ (LTS)
- **npm**: `v9.x` or later
- **C++ Build Tools** (Optional, only required if rebuilding native binary modules like printer drivers):
  - On Windows: Visual Studio Build Tools with "Desktop development with C++"
- Running instance of **`onomex_backend`** (typically running at `http://localhost:3000`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `onomex_desktop/`:

```env
# Backend REST API URL
VITE_API_URL=http://localhost:3000

# Backend WebSocket URL
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🚀 Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Environment**:
   ```bash
   npm run dev
   ```
   This command starts the Vite dev server and automatically launches the native Electron window with Hot Module Replacement (HMR) and Chrome DevTools.

3. **Log In to the POS**:
   Use the seeded credentials from `onomex_backend`:
   - **Owner**: `owner01` / `password123`
   - **Staff**: `staff01` / `password123`

---

## 🖨️ Hardware & Thermal Printer Configuration

The desktop application includes native ESC/POS thermal receipt printing for:
- **Customer Receipts** (80mm or 58mm bill format)
- **Kitchen Order Tickets (KOT)** (grouped by food preparation station)

### Setting Up a Thermal Printer:
1. Navigate to **Settings** → **Printer Settings** in the POS application.
2. Select your printer connection type:
   - **USB / Windows Spooler**: Select the installed driver name (e.g., `POS-80`, `EPSON TM-T20`).
   - **Network (LAN / Ethernet)**: Enter the printer's static IP address (e.g., `192.168.1.200`) and port (default: `9100`).
3. Click **Print Test Ticket** to verify formatting and paper cut commands.

---

## 🤖 Live Robot WebRTC Monitoring

When viewing active deliveries or the **Robots** fleet tab:
1. Click on any active robot to open its telemetry details.
2. Click **View Live Camera Feed**.
3. The desktop app connects to the `/webrtc` namespace on the backend, performs an SDP handshake with the robot's onboard Python client (`robot_scripts`), and establishes an encrypted, low-latency P2P video stream.

---

## 📦 Packaging & Production Releases

To compile and package the desktop application for distribution:

```bash
# Compile TypeScript, build Vite production bundle, and run electron-builder
npm run build
```

The resulting installers and binaries will be generated in the **`release/`** directory:
- **Windows**: `.exe` NSIS installer and portable executable
- **macOS**: `.dmg` disk image (when built on macOS)

---

## 🧪 Testing & Quality

```bash
# Run unit tests with Vitest
npm run test

# Run ESLint validation
npm run lint

# Preview the production Vite build in browser
npm run preview
```

---

## 📁 Project Structure

```
onomex_desktop/
├── electron/
│   ├── main.ts               # Electron main process (lifecycle, IPC, window management)
│   └── preload.ts            # Secure context bridge between Electron and React
├── src/
│   ├── assets/               # Branding logos and sound effects
│   ├── components/           # Reusable UI widgets:
│   │   ├── Sidebar.tsx       # Main navigation bar
│   │   ├── TableCard.tsx     # Floor plan table card
│   │   ├── LiveFeedModal.tsx # WebRTC live robot video viewer modal
│   │   ├── ReceiptModal.tsx  # Thermal print layout preview
│   │   └── ui/               # shadcn / Radix UI primitives
│   ├── context/              # Global React contexts (Auth, Cart, Socket)
│   ├── pages/                # Primary desktop views:
│   │   ├── DashboardPage.tsx # Daily KPIs and active orders overview
│   │   ├── PosPage.tsx       # Fast point of sale and dining table orders
│   │   ├── TablesPage.tsx    # Live floor layout and table states
│   │   ├── OrdersPage.tsx    # Kitchen and delivery order queue
│   │   ├── RobotsPage.tsx    # Fleet management, battery, and controls
│   │   ├── InventoryPage.tsx # Stock tracking and supplier orders
│   │   └── SettingsPage.tsx  # Printer configuration and store profiles
│   ├── App.tsx               # Application routing and theme provider
│   ├── main.tsx              # React mounting entry point
│   └── index.css             # Tailwind CSS v4 styling rules
├── cuboic_demand_model/      # Predictive demand forecasting ML package
├── release/                  # Packaged production desktop installers (.exe, .dmg)
├── vite.config.ts            # Vite configuration with Electron plugins
└── package.json              # Electron and React dependencies
```
