# chocii 4 u — Full-Stack 3D Dessert Commerce Platform

> **“A Little Treat, Just for You.”**

A production-ready dessert ordering platform featuring a cinematic 3D customer web experience and a real-time kitchen operations dashboard connected via a unified database and API backend.

---

## 🌟 Core Highlights

- **Connected Full-Stack Architecture**: When a customer places an order on the customer website, it is saved directly into the database and appears in the kitchen admin panel in real time without requiring WhatsApp.
- **Interactive 3D Dessert Scene**: Built with React Three Fiber, Three.js, and Drei. Features a layered procedural Belgian chocolate cake with realistic studio lighting, mouse parallax, gold shimmer particles, and smooth continuous rotation.
- **Adaptive Fallback**: Gracefully detects mobile touchscreens, devices with reduced-motion preferences, or systems lacking WebGL, providing high-resolution editorial photography.
- **Mandatory Customer Phone Sign-In (OTP)**: Customers sign in with their name and Indian mobile number (+91). Supports automatic digit movement, paste support, resend cooldown, rate limiting, and an on-screen demo code helper.
- **Dynamic Database-Driven Menu**: Five signature desserts (Dream Cake, Dream Bowl, Choco Churros, Fruizy, Can Cake) with categories, base/sale prices, and paid add-ons loaded from Prisma DB.
- **Customization Engine**: Supports **CLASSIC** (standard indulgence) vs. **BALANCED** (rich cocoa depth) experience styles, paid extras, and special kitchen instructions.
- **Persistent Shopping Cart**: Saved in LocalStorage, calculates subtotal, calculates delivery fee with free delivery progress meter, and validates all prices server-side.
- **Direct Checkout & Razorpay Integration**: Collects delivery addresses and landmarks with server-side transaction order creation, returning unique order numbers (e.g. `CB-YYMMDD-XXX`) and secure tracking tokens.
- **Live Order Tracking**: 6-stage status timeline (Pending → Confirmed → In Kitchen → Packed & Ready → Out for Delivery → Delivered).
- **Private Admin Dashboard (`/admin`)**:
  - Real-time orders queue with 4-second background sync and Web Audio API chime alerts.
  - State machine workflow with administrative audit notes.
  - Menu management: 1-click availability toggles (instant Sold Out), price editing, and add-on builder.
  - Store operational settings: delivery fees, minimum order rules, and store open/closed switch.
  - Analytics: revenue from delivered/paid orders, order counts today, and best-selling desserts.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury cocoa palette (`#24130F`, `#FFF5E9`, `#C58A55`, `#E85D75`)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion, canvas-confetti
- **Database & ORM**: Prisma ORM with SQLite (`dev.db`, easily switchable to Supabase / PostgreSQL)
- **Authentication**: Secure HTTP-only JWT cookies for customer sessions and bcrypt password hashing for admin portal
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Products
```bash
npx prisma db push
node prisma/seed.js
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the customer website.

### 4. Run End-to-End Test Suite
```bash
node test-e2e.js
```

---

## 🔐 Credentials & Default Access

### Admin Portal
- **URL**: `http://localhost:3000/admin/login`
- **Phone**: `+919999999999`
- **Password**: `CravingsAdmin@2026`

### Customer Sign-In (OTP)
- **URL**: `http://localhost:3000/sign-in`
- Any valid 10-digit Indian phone number (e.g. `9876543210`).
- In demo/development mode, the 6-digit OTP is automatically generated and displayed on screen with a single-click auto-fill option.

---

## 🗺 Application Routes

### Customer Experience
- `/` — Cinematic 3D Hero, Brand Storytelling, Signature Collection
- `/sign-in` — Customer Phone Number & OTP Verification
- `/menu` — Database-driven Menu with Category & Search Filters
- `/menu/[slug]` — Product Customizer (Classic vs Balanced, Paid Add-ons)
- `/cart` — Dedicated Cart Page with Free Delivery Tracker
- `/checkout` — Address, Instructions & Direct Order Submission
- `/order-success/[orderNumber]` — Order Receipt & Confetti Celebration
- `/track-order` — Live 6-stage Kitchen Status Stepper
- `/orders` — Customer Past Orders & Invoices

### Admin Portal
- `/admin/login` — Private Administrative Sign-In
- `/admin` — Overview Metrics, Realized Revenue & Top Sellers
- `/admin/orders` — Real-Time Orders Queue & Status Workflow
- `/admin/orders/[id]` — Order Inspector, Audit Trail & KOT Printing
- `/admin/products` — Menu List & Instant Sold-Out Toggles
- `/admin/products/new` — Create New Dessert
- `/admin/products/[id]/edit` — Edit Dessert & Add-ons
- `/admin/settings` — Delivery Fees, Thresholds & Kitchen Schedule
