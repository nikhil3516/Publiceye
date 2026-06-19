# PublicEye - Technical Stack & Architecture

PublicEye is a premium civic engagement web application that allows citizens to report, track, and verify local community issues (such as dirty spots, potholes, broken streetlights, water leaks, and safety hazards) while earning rewards through a gamified experience.

---

## 🚀 Core Technology Stack

| Technology Layer | Tools & Libraries | Description |
| :--- | :--- | :--- |
| **Build & Tooling** | Vite, TypeScript, PostCSS | Fast modern bundling, typescript safety, and optimized developer server. |
| **UI Framework** | React 19.2.5 | Modern component-based view rendering. |
| **Styling & UI** | Tailwind CSS v3, Shadcn UI, Base UI | Utility-first styling with high-performance responsive styling and customized modern interface. |
| **Icons & Animation** | Lucide React, Framer Motion, Motion | Premium iconography, micro-animations, page transitions, and smooth interactive hover effects. |
| **State Management** | Zustand v5.0.13 | Lightweight, fast client-side global store management. |
| **Data Fetching** | TanStack React Query v5 | Efficient server-state query caching, fetching, and background invalidation. |
| **Database & Auth** | Firebase v12.13.0 | Backend-as-a-Service for citizen authentication, authorization, and media/data synchronization. |
| **Map Services** | Google Maps JS SDK, `@react-google-maps/api` | Location pinning, autocomplete address lookup, and Google Directions routing. |
| **Forms & Validation** | React Hook Form, Zod | Safe typing schema validation and lightweight form input handling. |

---

## 📁 Project Directory & File Structure

```text
Public_WebApp/
├── .env                       # Environment variables (API keys, Firebase configs)
├── tailwind.config.js         # Tailwind configuration for custom theme colors & animations
├── vite.config.ts             # Vite configuration with TS path aliases
├── package.json               # Project metadata, scripts, and list of dependencies
├── src/
│   ├── main.tsx               # Main React entry point
│   ├── App.tsx                # App base wrapper (react-router Provider)
│   ├── App.css / index.css    # Core stylesheets, custom scrollbars, and theme colors
│   ├── routes.tsx             # Global application routing (React Router v7 setup)
│   ├── firebase.ts            # Firebase Client initialization & credentials
│   │
│   ├── components/            # Reusable UI & Layout Components
│   │   ├── ui/                # Core interactive Shadcn/Base-UI buttons, inputs, dialogs
│   │   ├── Map/
│   │   │   └── GoogleMap.tsx  # Google Maps component (location pin, autocomplete, Directions route rendering)
│   │   ├── ErrorBoundary.tsx  # React Error Boundary catcher
│   │   ├── ProtectedRoute.tsx # Route guard checking user auth state before access
│   │   ├── RootLayout.tsx     # Shell layout containing navigation menus and headers
│   │   ├── Skeletons.tsx      # Loading state placeholders
│   │   └── SplashScreen.tsx   # Premium initial brand landing animation
│   │
│   ├── pages/                 # Full Page views mapped in routes.tsx
│   │   ├── Onboarding.tsx     # Introduction walkthrough for new citizens
│   │   ├── Portal.tsx         # Welcome gate (Select Citizen or Admin portals)
│   │   ├── Login.tsx          # Citizen Authentication sign-in
│   │   ├── Register.tsx       # Citizen Account registration
│   │   ├── ForgotPassword.tsx # Email reset helper
│   │   ├── Home.tsx           # Home Dashboard feed showing nearby issues & stats
│   │   ├── ReportIssue.tsx    # Multi-step reporting flow with Map Pinner and camera photo upload
│   │   ├── ComplaintsList.tsx # Citizen's list of reported/upvoted complaints
│   │   ├── ComplaintDetail.tsx# Detailed progress view, AI classifications, SLA countdowns, and Directions map
│   │   ├── Profile.tsx        # User level, badges, completed tasks, and edit profile options
│   │   ├── Rewards.tsx        # Claimable gift cards/perks using earned XP
│   │   ├── Leaderboard.tsx    # Citizen rankings based on community contributions
│   │   ├── Notifications.tsx  # Alerts on ticket progress updates
│   │   ├── ChangeLanguage.tsx # Language options (Localization)
│   │   ├── AdminLogin.tsx     # Administrator sign-in portal
│   │   ├── AdminDashboard.tsx # Official panel for ticket assignment, SLA actions, and status updates
│   │   └── Analytics.tsx      # Chart dashboards for city ward performance
│   │
│   ├── services/              # API and logic services
│   │   ├── authService.ts     # Firebase auth commands (register, login, logout)
│   │   ├── complaintService.ts# Fetching, submitting, and updating complaints (Mock data backing)
│   │   └── aiClassifier.ts    # AI Engine simulation that classifies category and severity based on description keywords
│   │
│   └── store/                 # Zustand global store instances
│       ├── useAuthStore.ts    # Tracks logged-in user profiles
│       ├── useGamificationStore.ts # Core game state: citizen level, total XP points, daily activities
│       └── useThemeStore.ts   # Dark Mode & Light Mode preference state
```

---

## ⚡ Main Logic & Core Workflows

### 1. Gamification System (`useGamificationStore.ts`)
*   **XP Progression**: Citizen actions earn points (Reporting = `+20 XP`, Rating resolved issues = `+5 XP`).
*   **Leveling System**: Triggers visual notifications when XP threshold is hit to level up.
*   **Rewards**: Points can be redeemed for public transportation vouchers, park entries, or utility discounts.

### 2. AI-Assisted Issue Classification (`aiClassifier.ts`)
*   Automatically processes the citizen's typed description using local keyword scoring.
*   Returns an appropriate `category`, `severity` index (Low, Medium, High, Critical), and assigns the default SLA resolution window (e.g. 2 hours for Critical, 24 hours for High).
*   Selects the correct municipal department official (Sanitation, Electrical, Roads) to assign the ticket.

### 3. Directions & Navigation API (`GoogleMap.tsx` & `ComplaintDetail.tsx`)
*   **Dynamic Center**: Loads actual latitude and longitude from the selected complaint coordinates.
*   **Directions Calculation**: Uses `google.maps.DirectionsService` to calculate driving directions from the citizen's current geolocation (`navigator.geolocation.getCurrentPosition`) to the issue coordinates.
*   **Pulsing User Indicator**: Places a custom sky-blue pulsing marker at the starting coordinate.
*   **Route summary**: Embeds a premium floating overlay detailing driving distance (e.g. `2.5 km`) and estimated duration (e.g. `12 mins`).
*   **External Nav**: Features an "Open in Maps" option that safely routes the user to `https://www.google.com/maps/dir/` in a new tab for turn-by-turn navigation.

### 4. Admin SLA Tracking (`AdminDashboard.tsx`)
*   Displays real-time countdown clocks against resolution deadlines.
*   Includes automated escalation triggers (e.g. tickets breaching SLA deadlines are elevated to Deputy Commissioners).
