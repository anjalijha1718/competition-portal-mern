# Feedants Competition Backend API

Production-ready REST API for the **Feedants Classical Dance Competition** feature built with Node.js, Express.js, MongoDB (Mongoose), and JWT authentication.

---

## 🚀 Key Features

- **Concurrency-Safe Slot Booking**: Employs atomic conditional operations (`findOneAndUpdate` with `$expr: { $lt: ["$bookedSlots", "$totalSlots"] }` and `$inc: { bookedSlots: 1 }`).
- **MongoDB Multi-Document Transactions**: Automatically utilizes MongoDB session transactions (`startTransaction` / `commitTransaction`) when operating on replica sets/Atlas, with an automatic atomic compensating rollback safeguard on standalone development nodes.
- **Idempotency Guarantee**: Supports `Idempotency-Key` HTTP header with automatic 24-hour TTL caching to ensure duplicate network retries do not double-book or charge participants.
- **Compound Unique Indexing**: `{ competitionId: 1, userId: 1 }` prevents double registration at the database storage layer (catches `E11000` -> `409 Conflict`).
- **Dynamic Lifecycle State Engine**: Accurately computes real-time lifecycle states (`REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `SUBMISSION_OPEN`, `SUBMISSION_CLOSED`, `COMPLETED`) based on competition milestones and slots.
- **Security & Reliability**: Rate limiting (`express-rate-limit`), secure HTTP headers (`helmet`), input validation via `zod`, and structured logging via `morgan`.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v22+
- **Framework**: Express.js 4.x (REST API)
- **Database**: MongoDB 8.0+ via Mongoose ODM
- **Authentication**: Stateless JSON Web Tokens (JWT) + bcryptjs password hashing
- **Validation**: Zod schema validation middleware
- **Architecture**: Controller-Service-Repository (layered architecture with clean separation of concerns)

---

## 📋 Environment Variables (`.env`)

Create a `.env` file in `backend/` (or copy `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/feedants_competition
JWT_SECRET=feedants_super_secret_jwt_key_2026_dev_prod_safe
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## ⚙️ Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Seed database with reference competition and users
npm run seed

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

Default server runs on `http://localhost:5000`.

---

## 🧪 Verified API Endpoints & Curl Samples

### 1. Health Check
```bash
curl -X GET http://localhost:5000/api/v1/health
```

### 2. User Authentication
**Register New User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ananya Sharma",
    "email": "ananya@feedants.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@feedants.com",
    "password": "password123"
  }'
```

**Get Current User Profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Competition Endpoints
**Get Competition By Slug (Public / Optional Auth):**
```bash
curl -X GET http://localhost:5000/api/v1/competitions/feedants-classical-dance
```

**List Competitions (Paginated):**
```bash
curl -X GET "http://localhost:5000/api/v1/competitions?page=1&limit=10"
```

### 4. Registration & Concurrency
**Book Slot (Authenticated with Idempotency Key):**
```bash
curl -X POST http://localhost:5000/api/v1/competitions/<COMPETITION_ID>/register \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Idempotency-Key: reg_key_unique_101" \
  -H "Content-Type: application/json" \
  -d '{
    "amountPaid": 99
  }'
```

**Get My Registration State:**
```bash
curl -X GET http://localhost:5000/api/v1/competitions/<COMPETITION_ID>/my-registration \
  -H "Authorization: Bearer <TOKEN>"
```

**Upload Video Submission (During Submission Window):**
```bash
curl -X POST http://localhost:5000/api/v1/competitions/<COMPETITION_ID>/submission \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://youtube.com/watch?v=kathak_performance_sample"
  }'
```

### 5. Referral System
```bash
curl -X GET http://localhost:5000/api/v1/referrals/me \
  -H "Authorization: Bearer <TOKEN>"
```
