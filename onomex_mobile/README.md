# 📱 Onomex Mobile App

> Cross-platform mobile management and fleet oversight application for restaurant owners, floor supervisors, and managers, built with Expo, React Native, and TypeScript.

---

## 📋 Table of Contents

- [Overview & Capabilities](#-overview--capabilities)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started & Development](#-getting-started--development)
- [Running on Devices & Emulators](#-running-on-devices--emulators)
- [Building Production Binaries (EAS)](#-building-production-binaries-eas)
- [Project Structure](#-project-structure)

---

## 💡 Overview & Capabilities

The **Onomex Mobile App** keeps managers and supervisors in full control of restaurant operations from anywhere on the floor:

- 📊 **Real-Time KPI Dashboard**: Live sales revenue, active dine-in table count, pending kitchen tickets, and robot fleet status.
- 🗣️ **Auditory Speech Announcements**: Hands-free voice notifications powered by `expo-speech` that announce incoming table orders aloud (e.g. *"New order for Table 4"*).
- 🛎️ **Order Management & Dispatch**: Review incoming customer orders, confirm preparation stages, and dispatch robot deliveries directly from your phone.
- 🤖 **Fleet Status & Telemetry**: View battery levels, current operating mode (Autonomous, Delivering, Returning, Charging), and cabinet lock states.
- 📦 **Inventory Alerts**: Get instant warnings when raw ingredients dip below minimum thresholds.
- 🔐 **Biometric & Secure Storage**: Credentials and JWT authentication tokens stored securely via `expo-secure-store`.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [Expo SDK 57](https://expo.dev/) | Leading framework and platform for universal React Native applications |
| **Runtime** | React Native `0.86.3` / React `19.2.3` | High-performance native mobile UI rendering |
| **Navigation** | [React Navigation 7](https://reactnavigation.org/) | Native bottom tabs and stack navigation |
| **Real-Time** | Socket.IO Client | Live bi-directional updates for orders and robot status |
| **Speech & Sound** | `expo-speech` & `expo-av` | Text-to-speech order announcements and audio chime alerts |
| **Storage** | `expo-secure-store` | Hardware-backed encrypted key-value storage for JWT tokens |
| **Charts** | `react-native-chart-kit` & `react-native-svg` | Smooth SVG graphs for hourly order volumes and revenue |
| **Build Service** | Expo Application Services (EAS) | Cloud build pipeline for APK, AAB, and IPA packages |

---

## 📦 Prerequisites

Before running the mobile application, set up your development environment:

1. **Node.js**: `v18.x` or `v20.x`+ (LTS)
2. **npm**: `v9.x` or later
3. **Expo CLI & EAS CLI** (optional global install):
   ```bash
   npm install -g expo-cli eas-cli
   ```
4. **Testing Devices / Emulators**:
   - **Physical Device**: Install **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
   - **Android Emulator**: Android Studio with Android Virtual Device (AVD) configured.
   - **iOS Simulator**: Xcode installed on macOS.
5. Running instance of **`onomex_backend`**.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `onomex_mobile/`:

```env
# Backend REST API URL (Use your computer's local network IP for physical phones!)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000

# Backend WebSocket (Socket.IO) URL
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.100:3000
```

> [!IMPORTANT]
> When testing on a **physical phone** using Expo Go:
> **Do not use `http://localhost:3000`**. The phone cannot resolve `localhost` back to your computer.
> Instead, replace `192.168.1.100` with your computer's actual local IPv4 address (found via `ipconfig` on Windows or `ifconfig` on macOS/Linux), and ensure your phone is connected to the same Wi-Fi network.

---

## 🚀 Getting Started & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Expo Metro Bundler**:
   ```bash
   npm run dev
   # or
   npm start
   # or
   npx expo start
   ```

3. **Open the App**:
   - **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go app (Android) or Camera app (iOS).
   - **Android Emulator**: Press `a` in the terminal.
   - **iOS Simulator**: Press `i` in the terminal (macOS only).
   - **Web Browser**: Press `w` in the terminal to launch web preview.

---

## 📱 Running on Devices & Emulators

| Target | Command | Notes |
|---|---|---|
| **Expo Go** | `npm start` | Scan QR code in terminal |
| **Android Emulator** | `npm run android` | Requires Android Studio & AVD running |
| **iOS Simulator** | `npm run ios` | Requires Xcode (macOS only) |
| **Web Preview** | `npm run web` | Quick browser validation |

### Login Credentials
Log in with seeded management accounts from the backend:
- **Owner**: `owner01` / `password123`
- **Staff**: `staff01` / `password123`

---

## 📦 Building Production Binaries (EAS)

The project includes an `eas.json` configuration file for cloud builds.

### 1. Configure EAS Account
```bash
eas login
eas project:init
```

### 2. Build Android APK (for direct testing)
```bash
eas build --platform android --profile preview
```

### 3. Build Production Store Releases (AAB / IPA)
```bash
# Android App Bundle for Google Play
eas build --platform android --profile production

# iOS Archive for App Store
eas build --platform ios --profile production
```

---

## 📁 Project Structure

```
onomex_mobile/
├── assets/                   # App icons, splash screens, and adaptive assets
├── src/
│   ├── api/                  # Axios HTTP endpoints (auth, orders, tables, robots, analytics)
│   ├── components/           # Reusable mobile UI components:
│   │   ├── MetricCard.tsx    # Dashboard KPI stat card
│   │   ├── OrderListItem.tsx # Order card with status action triggers
│   │   └── RobotStatusPill.tsx# Battery & delivery mode badges
│   ├── context/              # React Context (AuthContext with SecureStore)
│   ├── hooks/                # Custom hooks (useSocket, useSpeechAlerts)
│   ├── navigation/           # Tab and Stack navigators (AppNavigator, AuthNavigator)
│   ├── screens/              # Application screens:
│   │   ├── LoginScreen.tsx   # Manager / Owner authentication
│   │   ├── DashboardScreen.tsx# High-level revenue and active count overview
│   │   ├── OrdersScreen.tsx  # Live order queue and status manipulation
│   │   ├── CreateDeliveryScreen.tsx # Robot dispatch selector
│   │   ├── OrderDetailScreen.tsx # Full order breakdown and payment state
│   │   ├── RobotsScreen.tsx  # Fleet overview and battery metrics
│   │   └── AnalyticsScreen.tsx# Revenue charts and sales reports
│   └── theme.ts              # Theme constants, palette, typography
├── app.json                  # Expo application configuration & permissions
├── eas.json                  # EAS Cloud Build profile definitions
├── metro.config.js           # Metro bundler customization
└── package.json              # Dependencies and start scripts
```
