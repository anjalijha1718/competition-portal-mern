# Feedants Competition Frontend Web App

A pixel-faithful, responsive React web implementation of the **Feedants Classical Dance Competition Details Screen**, structured cleanly for seamless portability to React Native.

---

## 🎨 UI & Feature Highlights

1. **<AppHeader>**: Back navigation, live English/Hindi toggle pill, native clipboard share link.
2. **<CompetitionHeroCard>**: High-definition banner, category tags, certificate badge, registered count, ₹1,500 prize pool, ₹99 entry fee, slots-left progress bar.
3. **<JudgeCard>**: Guru Manju Dubey avatar, 12+ yrs experience badge, interactive Intro Video modal.
4. **<CountdownBanner>**: 1-second live ticking countdown to registration deadline with automatic state refresh upon expiration.
5. **<ImportantDates>**: 2x2 responsive date grid for Registration, Submission Start/End, and Result announcements.
6. **<PreviousWinners>**: Smooth horizontal-scroll card carousel featuring previous edition winners with medals (🥇, 🥈, 🥉) and "View all" modal.
7. **<TabSection>**: Three interactive tabs (About with collapsible "View more", Judging Parameters, Rules & Eligibility).
8. **<RewardsTable>**: Rank-by-rank prize money distribution breakdown equaling ₹1,500.
9. **<DisclaimerBar>**: Verification and compliance notice.
10. **<TrustBadges>**: Accordion FAQ covering UPI prize disbursement, 100% refund policy, and Razorpay security.
11. **<ReferEarnCard>**: Direct referral link sharing with copy-to-clipboard and ₹10/signup reward tracking.
12. **<HearFromUsers>**: Performer ratings and expandable testimonials.
13. **<AdHerePlaceholder>**: Sponsor partnership banner.
14. **<StickyCTA>**: Dynamic bottom action button reflecting exact business state:
    - *Guest*: "Login to Register"
    - *Open*: "Register Now (₹99)"
    - *Registered & Submission Open*: "Upload Submission"
    - *Registered & Pre-Submission*: "Registered ✓"
    - *Registration Closed*: "Registration Closed"
    - *Slots Full*: "Slots Full"
15. **<BottomNav>**: Fixed 5-tab mobile navigation bar (Home, Explore, Create, Competitions, Profile).
16. **<DemoBar>**: Technical evaluation bar for 1-click user switching (`Demo User`, `Rahul Verma`, `Guest`) and instant scenario testing (`Live Active`, `Sold Out`, `Fixed Reference Dates`).

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query v5 (server cache & window focus refetching) + React Context (Auth)
- **Styling**: Tailwind CSS v3 with mobile-first viewport design
- **Icons**: Lucide React
- **Client**: Axios with JWT request interceptors

---

## ⚙️ Quick Start

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Configure environment
# Ensure .env has VITE_API_URL=http://localhost:5000/api/v1

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

Application runs on `http://localhost:5173`.
