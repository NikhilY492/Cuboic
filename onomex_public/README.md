# 🌐 Onomex Public Marketing & Landing Site

> The public-facing marketing and product presentation website for Onomex — showcasing the future of autonomous robot food delivery, table QR menus, and restaurant POS software.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started & Development](#-getting-started--development)
- [Building for Production](#-building-for-production)
- [Docker Deployment](#-docker-deployment)
- [Project Structure](#-project-structure)

---

## 💡 Overview

The **Onomex Public Site** serves as the primary digital storefront for restaurant partners, franchisees, and enterprise operators:

- 🤖 **Interactive Hero Presentation**: Dynamic showcase of the autonomous robot delivery workflow with smooth scroll animations powered by Motion.
- 📐 **Product Ecosystem Walkthrough**: Highlights the integration between the Customer QR App, Kitchen KOT, Desktop POS, and Robot Fleet.
- 💡 **Feature Comparisons & Benefits**: Explains cost reductions, delivery speed increases, and revenue improvements for restaurant operators.
- 📝 **Demo Request & Contact Form**: Interactive inquiry forms with client-side validation using React Hook Form and Zod.
- 🎨 **Modern Aesthetics**: Built with Tailwind CSS v4, dark glassmorphism, responsive navigation, and Radix UI components.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Latest React with high-performance concurrent rendering |
| **Tooling** | [Vite 8](https://vite.dev/) | Lightning fast developer experience and optimized production bundling |
| **Language** | TypeScript | Type safety across component props and animation states |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation Tailwind CSS with native `@theme` integration |
| **Animations** | [Motion](https://motion.dev/) | Fluid micro-interactions, scroll-linked animations, and staggered entrances |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible accordions, dialogs, dropdowns, and navigation menus |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing and layout management |
| **Validation** | [Zod](https://zod.dev/) + React Hook Form | Type-safe form parsing and validation |

---

## 📦 Prerequisites

- **Node.js**: `v18.x` or later (LTS recommended)
- **npm**: `v9.x` or later

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
   Open your browser at **`http://localhost:5173`** (or the port shown in your terminal).

3. **Code Quality & Linting**:
   ```bash
   npm run lint
   ```

---

## 📦 Building for Production

```bash
# Type-check and build production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` that builds static assets and serves them via an optimized Nginx web server:

```bash
# Build the Docker image
docker build -t onomex-public .

# Run the container on port 80
docker run -d -p 80:80 --name onomex-public-site onomex-public
```

Access the site at `http://localhost`.

---

## 📁 Project Structure

```
onomex_public/
├── public/                   # Static icons, favicons, illustrations
├── src/
│   ├── app/
│   │   ├── App.tsx           # Router provider root
│   │   ├── routes.tsx        # Route definitions
│   │   └── components/       # Marketing site components (Hero, Navbar, Footer, Features, Pricing)
│   ├── assets/               # Brand logos and vector graphics
│   ├── styles/               # CSS theme definitions:
│   │   ├── tailwind.css      # Tailwind v4 import
│   │   ├── theme.css         # Color tokens & dark mode variables
│   │   ├── fonts.css         # Typography styling
│   │   └── index.css         # Global root resets
│   ├── main.tsx              # Application entry point
│   └── App.tsx               # Primary landing page layout
├── Dockerfile                # Multi-stage production Nginx container
├── vite.config.ts            # Vite configuration
└── package.json              # Project scripts and dependencies
```
