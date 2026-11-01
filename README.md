# DriveMate

> **Your Car. Your Driver. Your Journey.**  
> *Built by shriTech Pvt Ltd*  
> 🌐 **Live Website**: [https://drivesmate.netlify.app/](https://drivesmate.netlify.app/)

DriveMate is a premium, futuristic on-demand personal driver booking platform. Customers already own vehicles but require a vetted professional chauffeur to drive them — for business appointments, airport transfers, weddings, nightlife parties, or interstate highway road trips.

> **CRITICAL SERVICE BOUNDARY:**  
> DriveMate provides **DRIVERS ONLY, NEVER CARS**. The customer always supplies their own personal vehicle.

---

## 🌟 Key Highlights & Architectural Features

### 1. 3D Cinematic Visual Experience (Three.js & React Three Fiber)
* **Photorealistic Automotive Experience**:
  * Authentic BMW 5 Series luxury sedan with PBR metallic-roughness car paint, clearcoat reflections, carbon fiber accents, and Matrix LED headlights.
  * Real-time 3D chauffeur/driver avatar standing beside the vehicle in executive suit and realistic passenger.
  * Interactive studio lighting, HDR reflections, floating ambient dust particles, and mouse-reactive parallax.
  * Interactive vehicle paint color switcher (Obsidian Black, Monaco Blue, Imperial Crimson, Glacier Silver).
* **Interactive 3D Exploded-View Section**:
  * BMW vehicle partitioned into independent floating component layers:
    1. Bonnet / Engine Hood (elevates and pushes forward to expose engine block and fluid caps)
    2. Panoramic Glass Roof Canopy (rises vertically above the chassis)
    3. Front Chauffeur & Passenger Doors (swings outward at 35 degrees)
    4. Rear Left & Right Doors (expands laterally)
    5. Diamond-cut Wheels, Tires & Orange Brake Calipers (telescopes outward along X-axis)
    6. Matrix LED Headlights & Front Bumper Fascia (shifts forward along Z-axis)
    7. Chassis, Floorpan & Leather Cockpit Core (anchored at center)
  * Smooth breathing & turntable animation.
  * 3D Hotspot Pins detailing driver pre-trip safety inspection checkmarks (Engine oil & fluids, tire tread depth, mirrors & cockpit sanitization, lighting diagnostics).

### 2. Full-Stack Technology Stack
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Framer Motion, Lucide React, Canvas Confetti.
* **Backend**: Node.js, Express, TypeScript, REST API, Socket.IO for realtime dispatch events.
* **Database**: Dual-driver architecture supporting **MySQL 8.0** and **WebAssembly SQLite** (`sql.js`) with identical SQL schema and migrations.
* **Security & Auth**: Argon2/bcrypt password hashing, JWT session verification, role-based access control (RBAC).

---

## 👥 Role Capabilities & Screen Inventory

### 🚗 Public Landing Page
* **Hero Section**: Headline, tagline, authentic BMW showcase, color picker, CTAs.
* **Interactive 3D Exploded View**: Disassemble vehicle layers with slider and component pins.
* **How It Works (3 Steps)**: 1. Book Your Driver → 2. Choose Your Driver → 3. Travel in Your Own Car.
* **Automotive Driving Verticals**: Hourly, Full-Day, Airport, Wedding, Corporate, Long-Distance, Family.
* **Interactive Price Calculator**: Live server quote estimator with duration slider and transmission choice.
* **Safety Protocols**: Background checks, DL verification, joint walkaround pre-checks.
* **Customer Reviews**: Testimonials from luxury vehicle owners (BMW, Mercedes, Audi).
* **Driver Recruitment**: Earn ₹45,000–₹75,000/mo, 85% payout share, flexible schedule.
* **FAQ Accordion & Legal Footer**.

### 👤 Customer Portal (`/customer`)
* **Personal Garage**: Add/manage owned vehicles (Make, Model, Year, Registration, Transmission [Manual/Automatic], Fuel Type).
* **Multi-Step Booking Wizard (`/book`)**:
  * Step 1: Vehicle selection (reinforces "we drive this car")
  * Step 2: Trip purpose, pickup location, date/time, and duration
  * Step 3: Browse nearby approved drivers with ratings, experience, and hourly rates
  * Step 4: Fare review and instant confirmation generating unique `DOD-2026-XXXX` reference code.
* **Active Trip Tracker**: Live progress timeline (`Requested` → `Accepted` → `En Route` → `Arrived` → `In Progress` → `Completed`).
* **Post-Trip Driver Rating**: Star ratings (1-5) and feedback comments.
* **Support Ticket Desk**: File inquiries with administrative escalation.

### 👔 Driver Dashboard (`/driver`)
* **Availability Control**: Online / Offline toggle (enforces rule: only admin-approved drivers can go online).
* **Verification Status HUD**: Current application status (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `SUSPENDED`).
* **Document Upload**: Submit Commercial / Private Driving License and photo ID for compliance review.
* **Live Trip Dispatch**: Incoming trip cards with customer car specs, pickup address, billable hours, and net payout. Accept or decline trips.
* **Active Mission Controller**: Server-enforced sequential progression:
  1. `En Route to Pickup`
  2. `Arrived at Customer Car`
  3. `Vehicle Inspection & Handover Complete (Start Trip)`
  4. `Complete Journey`
* **Earnings Ledger**: Gross revenue, 15% platform commission breakdown, 85% net payouts.

### 🛡️ Operations Admin Console (`/admin`)
* **Live Operations Metrics**: Gross booking value, total commission earned, active trips, registered users.
* **Driver Verification Desk**: Review submitted licenses, approve or reject applications with mandatory reason.
* **Dispatch & Booking Manager**: Search bookings by reference or customer, inspect complete immutable event audit trail (`booking_events`).
* **Account Controls**: Suspend or reactivate customer or driver accounts.
* **Pricing Rules Engine**: Configure base fees, hourly rates, minimum duration, and commission percentages.
* **Support Case Resolution**: Review tickets and record resolutions.
* **System Audit Log Viewer**: Audit history of administrative actions.

---

## 🔑 Pre-Seeded Demo Evaluation Credentials

Use these pre-loaded accounts to test any role instantly (or use the **"1-Click Instant Evaluation"** buttons in the sign-in modal):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@driverondemand.com` | `Admin@2026!` | Operations Console (`/admin`) |
| **Customer** | `alex.patel@example.com` | `Customer@123!` | Customer Portal (`/customer`), 3 Cars |
| **Approved Driver** | `vikram.singh@example.com` | `Driver@123!` | Chauffeur HUD (`/driver`), ★ 4.96 |
| **Approved Driver 2** | `rajesh.sharma@example.com` | `Driver@123!` | Chauffeur HUD (`/driver`), ★ 4.89 |
| **Approved Driver 3** | `anita.deshmukh@example.com` | `Driver@123!` | Chauffeur HUD (`/driver`), ★ 4.98 |
| **Pending Driver** | `suresh.verma@example.com` | `Driver@123!` | Under Review Applicant |

---

## 🚀 Running the Application

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Automated Integration Tests
```bash
pnpm --filter driverondemand-server test
```
*Validates 18 business rules: database migrations, bcrypt password security, customer car ownership, driver approval enforcement, server-side integer paise calculation, booking lifecycle transitions, and review constraints.*

### 3. Start Development Server
```bash
# Starts backend server (port 5000) and frontend client (port 3000) concurrently:
npm run dev
```

* **Live Production Website**: [https://drivesmate.netlify.app/](https://drivesmate.netlify.app/)
* **Frontend Application**: `http://localhost:3000`
* **Backend API & WebSockets**: `http://localhost:5000`
* **Health Check**: `http://localhost:5000/api/health`

---

## 📐 Database Schema (MySQL / SQLite)

The platform enforces strict relational integrity across 12 normalized tables:
- `users`: Core authentication, password hashes, and system role.
- `customer_profiles`: Customer address and emergency contact info.
- `driver_profiles`: Experience years, service area, approval status, availability, and rating averages.
- `driver_documents`: Private driver license and ID proof records with admin review states.
- `vehicles`: Customer-owned cars (make, model, year, registration, transmission, fuel).
- `pricing_rules`: Configurable rates per service vertical and region.
- `bookings`: Central booking registry with server-calculated fares and payouts.
- `booking_events`: Timestamped audit trail recording every status change and actor.
- `payments`: Razorpay payment orders, webhook records, and verification status.
- `reviews`: Post-trip 1-5 star ratings and reviews by verified customers.
- `support_cases`: Dispute and customer service ticketing desk.
- `audit_logs`: Administrative action logs.
