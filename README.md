# Feedants Classical Dance Competition — Full-Stack Technical Submission

A production-ready full-stack Competition Details feature for **Feedants**, built using **React (Vite + Tailwind CSS + TanStack Query)**, **Node.js/Express.js**, and **MongoDB (Mongoose)** with concurrency control, transaction guarantees, and idempotency handling.

---

## 📁 Repository Structure

```
feedants-competition/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, env.js
│   │   ├── models/          # Competition.js, User.js, Registration.js, IdempotencyKey.js
│   │   ├── controllers/     # competition.controller.js, registration.controller.js, auth.controller.js, referral.controller.js
│   │   ├── routes/          # competition.routes.js, auth.routes.js, referral.routes.js
│   │   ├── services/        # competition.service.js, registration.service.js
│   │   ├── middlewares/     # auth.js, errorHandler.js, validate.js, rateLimit.js
│   │   ├── utils/           # ApiError.js, ApiResponse.js, asyncHandler.js, dateHelpers.js
│   │   ├── validators/      # competition.validator.js, auth.validator.js
│   │   ├── seed/            # seed.js (Seeds Feedants Classical Dance + Users + Demo states)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── api/             # axios instance + endpoints
    │   ├── components/      # AppHeader, CompetitionHeroCard, JudgeCard, CountdownBanner,
    │   │                    # ImportantDates, PreviousWinners, TabSection, RewardsTable,
    │   │                    # DisclaimerBar, TrustBadges, ReferEarnCard, HearFromUsers,
    │   │                    # AdHerePlaceholder, StickyCTA, BottomNav, DemoBar, Modals
    │   ├── screens/         # CompetitionDetailsScreen.jsx
    │   ├── hooks/           # useCompetition.js, useCountdown.js, useRegistration.js, useAuth.js
    │   ├── context/         # AuthContext.jsx
    │   ├── pages/           # Login.jsx, Register.jsx, Home.jsx
    │   ├── styles/          # index.css (Tailwind directives)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── README.md
```

---

## 🚀 Quick Setup & Execution

### Prerequisites
- **Node.js**: v18+ (tested on Node v22.x)
- **MongoDB**: v6.0+ (running locally or MongoDB Atlas connection string)
- **npm**: v9+

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Or create .env with your MongoDB URI
npm run seed            # Seeds competition data, initial registration, & demo users
npm run dev             # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env    # Contains VITE_API_URL=http://localhost:5000/api/v1
npm run dev             # Starts Vite server on http://localhost:5173
```

Visit **`http://localhost:5173/`** in your browser.

---

## 🔑 Demo Credentials & Quick Switcher

For quick and frictionless evaluation, an interactive **`Technical Demo Controls`** bar is pinned to the top of the screen:

| User Account | Email | Password | Initial State |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@feedants.com` | `password123` | **New Participant** (Ready to click "Register Now" to test atomic slot booking & Razorpay modal) |
| **Rahul Verma** | `rahul@feedants.com` | `password123` | **Enrolled Participant** (Demonstrates "Registered ✓" and "Upload Submission" flows) |
| **Admin** | `admin@feedants.com` | `password123` | Platform Admin |

---

## 🧠 Major Technical Decisions

### 1. Concurrency-Safe Atomic Slot Booking
- **Problem**: When multiple users attempt to book the last available slot simultaneously, simple read-then-write logic causes race conditions, leading to overbooking (e.g. 21/20 slots booked).
- **Solution**: We execute atomic document-level locking via MongoDB's `findOneAndUpdate` with a conditional expression filter:
  ```javascript
  const updatedComp = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      $expr: { $lt: ["$bookedSlots", "$totalSlots"] }
    },
    { $inc: { bookedSlots: 1 } },
    { new: true, ...sessionOption }
  );
  if (!updatedComp) throw ApiError.conflict("No slots available. The competition is already full.");
  ```
  This is guaranteed to execute atomically at the storage engine level (WiredTiger).

### 2. Multi-Document ACID Transactions with Fallback Guard
- In production (MongoDB Atlas or replica set clusters), booking the slot and creating the `Registration` record are bound within a `session.startTransaction()` and `session.commitTransaction()`. If the user registration fails, the slot count decrement is rolled back automatically.
- To accommodate local single-node development environments without crashing on `MongoServerError: Transaction numbers are only allowed on a replica set member`, the service detects the cluster topology: if single-node, it executes the atomic conditional increment and provides a compensating rollback (`$inc: { bookedSlots: -1 }`) on failure.

### 3. Idempotency Handling (`Idempotency-Key` Header)
- Network blips or rapid double-clicks on payment buttons often cause duplicate HTTP POST requests.
- Our registration endpoint checks for the `Idempotency-Key` header. If a key has been processed for this user within the last 24 hours, the backend returns the cached 201 response directly from the `IdempotencyKey` collection without executing a second slot booking.

### 4. Database-Level Duplicate Registration Prevention
- In addition to fast service checks, a compound unique index is enforced on `{ competitionId: 1, userId: 1 }`.
- Even if two identical requests bypass application-level checks concurrently, the second insert fails with MongoDB error `11000`, which our centralized `errorHandler` translates into a clean `409 Conflict: "You are already registered for this competition"`.

### 5. TanStack React Query for Server State & Optimistic UI
- Client state is decoupled from server state. React Query provides instant caching, background synchronization, and automatic refetching on window focus.
- The registration mutation performs an **optimistic update**, immediately updating the remaining slots and enrolled badge on the UI, rolling back seamlessly if the backend rejects the request.

---

## ⚖️ Trade-offs & Assumptions

1. **Simulated Payment Gateway**:
   - Rather than requiring real bank credentials or Razorpay API keys during technical evaluation, a simulated Razorpay checkout modal provides an authentic experience with instant validation.
2. **Date Context & Live Countdown**:
   - The design reference specifies historical dates (August 2026). Because a past date would render the countdown permanently expired, the primary seeded competition sets future dates relative to execution time so the live countdown ticks down in real time. We also provide a preset toggle in `DemoBar` to inspect the exact reference dates.
3. **React Web vs. React Native**:
   - As indicated in the prompt notes, this is delivered as a React Web application styled with mobile-first viewport constraints. The components are cleanly modularized (`screens/`, `components/`, `hooks/`) so they can be ported to React Native with minimal adaptation.

---

## 📈 Scaling to Thousands of Concurrent Users (Production Roadmap)

To scale this feature to handle thousands of concurrent users during flash registrations:

1. **Distributed Locks & Queues (Redis / BullMQ)**:
   - Offload slot reservation to Redis using `DECR` on a slot key or Lua scripts for sub-millisecond atomic checks, queueing registration writes asynchronously via BullMQ.
2. **Real Razorpay Integration & Webhook Signatures**:
   - Implement two-phase order creation: create order on backend (`razorpay.orders.create`), capture payment on client, and finalize slot reservation exclusively upon verified cryptographic HMAC SHA256 webhook confirmation (`payment.captured`).
3. **WebSockets / Server-Sent Events (SSE)**:
   - Push live slot availability counters and winner announcements to all connected clients in real time without polling.
4. **Content Delivery Network (CDN) & Object Storage (AWS S3 / Cloudflare R2)**:
   - Direct-to-S3 presigned URLs for video submissions, and CDN edge caching for competition images and banner assets.
5. **Observability & Health Probes**:
   - OpenTelemetry tracing, Prometheus metrics (`/metrics`), Sentry error tracking, and Kubernetes `/livez` & `/readyz` probes.

---

## ✅ Deliverables Verification Checklist

- [x] **Backend runs on :5000**, connects to MongoDB, seeds successfully.
- [x] **All endpoints tested** with curl/PowerShell samples.
- [x] **Frontend runs on :5173**, fetches from backend via `VITE_API_URL`.
- [x] **Competition Details screen** matches reference design hierarchy closely.
- [x] **Countdown ticks live** every second and refetches upon expiry.
- [x] **Register flow**: Concurrency-safe, prevents overbooking, prevents duplicate entries.
- [x] **Submission upload endpoint**: Validates submission window and user registration.
- [x] **Error states, loading skeletons, and empty states** implemented.
- [x] **.env.example** provided for both backend and frontend.
- [x] **Comprehensive documentation** covering architecture and production scalability.
