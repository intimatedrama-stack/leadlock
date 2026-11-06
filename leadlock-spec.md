# LeadLock — MVP Specification

## 1. Product Overview

**Product Name:** LeadLock (working title)

**One-liner:** A privacy-first CRM, booking, and posting-cadence tool for independent service providers who advertise on classified-style directories.

**Core value proposition:** Providers lose 30–50% of inbound leads to slow responses and disorganized scheduling. LeadLock acts as a virtual receptionist — instantly acknowledging leads via SMS, funneling them into a booking flow, and keeping the provider's posting cadence consistent — without ever touching third-party ad platforms directly.

**Business model:** SaaS subscription. Three tiers:
- **Starter** ($29/mo): 1 phone number, inbox, booking link, 500 SMS/mo
- **Pro** ($59/mo): CRM, earnings tracking, posting scheduler, 1,500 SMS/mo, verified reviews
- **Business** ($99/mo): multiple aliases, advanced analytics, 5,000 SMS/mo, priority support

**Key differentiators:**
- Zero integration with ad sites (compliance-safe)
- SMS-first instant lead acknowledgment ("Lead Lock" system)
- Posting consistency tools (copy/paste kits, rotation, streaks) without automation
- Neutral, privacy-preserving public booking page
- Verified reviews tied to completed bookings only

---

## 2. MVP Scope (In / Out)

### In Scope (MVP)

| Module | Features |
|---|---|
| **Auth & Identity** | Email/password signup, alias support (client-facing name vs. internal name), MFA |
| **Unified Inbox** | SMS inbound/outbound via Twilio, email optional (Phase 2), message templates, unread/priority indicators |
| **Lead Lock System** | Auto-acknowledge inbound SMS within 30s, booking link injection, provider escalation timers (2min / 10min / 30min), confirmation cutoffs |
| **Booking** | Public booking link (neutral design), availability calendar, slot selection, confirmation + reminder flow, reschedule/cancel |
| **CRM** | Client list, tags, notes, session history, total spend, alias display |
| **Earnings** | Per-session logging, daily/weekly/monthly totals, export CSV |
| **Verified Reviews** | Post-session review request (SMS), tied to booking ID, moderation queue |
| **Posting Scheduler** | Schedule grid (platform × city × time), ad kit library (title + body variants), copy buttons, posting log, streak tracker |
| **Settings** | Profile, alias config, availability defaults, SMS number, notification prefs, data export |

### Out of Scope (MVP)

- Email inbox integration (Phase 2)
- Browser extension for paste-assist (Phase 2 concept)
- Multi-provider agency accounts
- Payment processing / client-facing payments
- Direct ad-site integration, scraping, or credential capture (permanently out)
- AI-generated ad copy (Phase 2; can add LLM variant generation later)
- Native mobile app (responsive web first)

---

## 3. User Flows

### 3A. Provider Onboarding Flow

```
Sign Up (email + password)
  → Set internal name + client-facing alias
  → Provision Twilio SMS number (auto or provider chooses area code)
  → Set availability (weekly recurring + overrides)
  → Customize booking page (neutral branding, display name, intro text)
  → Create first ad kit (title + body + platform/city tag)
  → Dashboard live
```

### 3B. Inbound Lead Flow (SMS)

```
Client texts provider's LeadLock number
  → System creates Lead record (status: NEW)
  → Auto-reply within 30s:
      "Hey! Thanks for reaching out. [Alias] is available — book a time here: [booking_link]
       Reply STOP to opt out."
  → Lead status → ACKNOWLEDGED
  → Timer starts: Provider has 2 min to personally respond
      → 2 min: push notification "New lead waiting"
      → 10 min: push + SMS to provider "Lead [X] hasn't been answered"
      → 30 min: auto-send to client: "Hey, [Alias] will get back to you shortly.
        You can also book directly: [link]"
  → Provider replies in inbox → status: ENGAGED
  → Client books → status: BOOKED
  → Session completed → status: COMPLETED
  → No response after 24h → status: EXPIRED (provider can reactivate)
```

### 3C. Client Booking Flow

```
Client opens booking link (neutral page: "[Alias] — Schedule a Consultation")
  → Sees available date/time slots (provider's availability minus booked slots)
  → Selects slot
  → Enters: first name (or alias), phone number
  → Confirmation screen + SMS confirmation sent
  → 2h before: reminder SMS to client
  → 30 min before: reminder SMS to client
  → If client doesn't confirm 1h before (optional setting): provider notified, slot flagged
  → Post-session: review request SMS (24h after session end)
```

### 3D. Posting Workflow

```
Provider opens Posting Scheduler
  → Sees weekly grid: rows = platforms/cities, columns = days
  → Green = posted, Yellow = due today, Red = missed
  → Clicks a cell → "Post Kit" drawer opens:
      → Shows rotated ad variant (title/body, auto-selected from library)
      → "Copy Title" / "Copy Body" buttons
      → Checklist: ☐ Opened site  ☐ Pasted title  ☐ Pasted body  ☐ Submitted
      → "Mark as Posted" button → logs timestamp
  → Streak counter updates
  → Missed posts get recovery suggestions
```

---

## 4. Communication + No-Miss System ("Lead Lock")

### Auto-Acknowledge

| Trigger | Action | Timing |
|---|---|---|
| Inbound SMS from unknown number | Create Lead (NEW), send auto-reply with booking link | ≤ 30 seconds |
| Inbound SMS from known client | Surface in inbox as priority, no auto-reply | Instant |
| Inbound SMS with keyword "BOOK" | Send booking link directly | ≤ 30 seconds |
| Inbound SMS with "STOP" | Opt-out, flag in CRM, no further messages | Immediate |

### Escalation Timers

| Elapsed | Action |
|---|---|
| 0s | Auto-acknowledge sent to client |
| 2 min | Push notification to provider: "New lead from [phone_last4]" |
| 10 min | Push + SMS to provider: "Lead waiting 10 min — respond now" |
| 30 min | Second auto-message to client: "Thanks for your patience. Book directly: [link]" |
| 2 hours | Provider inbox flags lead as "cooling" (yellow) |
| 24 hours | Lead status → EXPIRED. Provider can manually re-engage. |

### Confirmation Cutoffs

- **Booking made:** Instant SMS confirmation to client + provider notification
- **T-minus 24h:** Reminder SMS to client with confirm/reschedule option
- **T-minus 2h:** Final reminder to client
- **T-minus 1h (optional):** Provider notified if client hasn't confirmed
- **No-show:** client record gets `no_show_count += 1`, tag auto-applied

### Templates (Pre-loaded, Editable)

| Template Key | Default Text |
|---|---|
| `auto_ack` | "Hey! Thanks for reaching out 💛 [Alias] here. Book a time: [booking_link] — or just reply and I'll get back to you shortly!" |
| `auto_ack_followup` | "Hey, sorry for the wait! [Alias] will be with you soon. You can also book directly: [booking_link]" |
| `booking_confirm` | "You're booked with [Alias] on [date] at [time]. Reply RESCHEDULE to change. See you soon!" |
| `reminder_24h` | "Reminder: [Alias] tomorrow at [time]. Reply YES to confirm." |
| `reminder_2h` | "See you in 2 hours! Address/details: [provider_custom_field]" |
| `review_request` | "Thanks for visiting [Alias]! Leave a quick review: [review_link]" |
| `re_engage` | "Hey! [Alias] has new availability this week. Book here: [booking_link]" |

---

## 5. Posting Consistency System (No Integration)

### 5A. Schedule Generator

Provider configures:
- **Platforms** (free-text labels): e.g., "Platform A – Seattle", "Platform B – Portland"
- **Posting frequency** per platform: daily, every 2 days, 3x/week, weekly
- **Preferred time window**: e.g., "6–8 AM"
- **City rotation**: for providers who rotate across cities

Generated calendar grid:

```
              Mon     Tue     Wed     Thu     Fri     Sat     Sun
PlatA-SEA     6AM     -       6AM     -       6AM     6AM     -
PlatA-PDX     -       7AM     -       7AM     -       -       7AM
PlatB-SEA     8AM     8AM     8AM     8AM     8AM     -       -
```

### 5B. Ad Kit Library (Content Rotation)

Each Ad Kit contains:
- **Title variants** (3–5): rotated round-robin
- **Body variants** (3–5): same rotation logic
- **Tags/metadata**: platform, city, category
- **Media references**: text descriptions of which photos to use

```json
{
  "kit_id": "kit_001",
  "platform": "Platform A",
  "city": "Seattle",
  "titles": [
    "✨ New in town — limited availability this week",
    "Visiting SEA — upscale & discreet 💎",
    "Back in Seattle! Don't miss out ✨"
  ],
  "bodies": [
    "Hey love! I'm visiting Seattle this week...[body1]",
    "Available for a limited time in the SEA area...[body2]",
    "Just arrived in Seattle...[body3]"
  ],
  "current_title_index": 0,
  "current_body_index": 0,
  "photo_notes": "Use set B (black dress, hotel)"
}
```

### 5C. Post Kit Drawer (Copy/Paste UX)

```
┌─────────────────────────────────────┐
│  POST KIT — Platform A, Seattle     │
│  Due: Tue 6 AM                      │
│                                     │
│  Title (variant 2 of 3):           │
│  ┌─────────────────────────────┐   │
│  │ Visiting SEA — upscale &... │ 📋│
│  └─────────────────────────────┘   │
│                                     │
│  Body (variant 2 of 3):           │
│  ┌─────────────────────────────┐   │
│  │ Available for a limited...  │ 📋│
│  └─────────────────────────────┘   │
│                                     │
│  Photos: Use set B (black dress)   │
│                                     │
│  Checklist:                         │
│  ☐ Opened site                     │
│  ☐ Pasted title                    │
│  ☐ Pasted body                     │
│  ☐ Added photos                    │
│  ☐ Submitted ad                    │
│                                     │
│  [ Mark as Posted ✓ ]              │
└─────────────────────────────────────┘
```

### 5D. Posting Log + Streaks

- Every "Mark as Posted" creates a `posting_log` entry
- Dashboard widget: "Posting Streak: 🔥 12 days"
- Weekly summary SMS: "This week: 14/16 posts completed (87.5%)"

### 5E. Browser Extension Concept (Phase 2)

- Chrome extension detects supported ad-posting pages
- Sidebar with current post kit
- "Paste Title" / "Paste Body" buttons fill form fields
- Provider manually reviews and clicks Submit
- No credential capture, no auto-submission, no scraping

---

## 6. Data Model (PostgreSQL)

```sql
-- Multi-tenant isolation: all queries filter by provider_id

CREATE TABLE providers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    internal_name   TEXT NOT NULL,
    client_alias    TEXT NOT NULL,
    phone_number    TEXT,
    timezone        TEXT DEFAULT 'America/New_York',
    settings        JSONB DEFAULT '{}',
    encrypted_pii   BYTEA,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    phone_number    TEXT NOT NULL,
    display_name    TEXT,
    internal_notes  TEXT,
    tags            TEXT[] DEFAULT '{}',
    total_spend     NUMERIC(10,2) DEFAULT 0,
    session_count   INT DEFAULT 0,
    no_show_count   INT DEFAULT 0,
    last_seen_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(provider_id, phone_number)
);

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    client_id       UUID REFERENCES clients(id),
    phone_number    TEXT NOT NULL,
    status          TEXT DEFAULT 'new',
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_provider_status ON conversations(provider_id, status);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    direction       TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    body            TEXT NOT NULL,
    sent_at         TIMESTAMPTZ DEFAULT now(),
    is_auto         BOOLEAN DEFAULT false,
    twilio_sid      TEXT
);

CREATE INDEX idx_messages_convo_time ON messages(conversation_id, sent_at DESC);

CREATE TABLE availability (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    day_of_week     INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_override     BOOLEAN DEFAULT false,
    override_date   DATE,
    is_blocked      BOOLEAN DEFAULT false
);

CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    client_id       UUID REFERENCES clients(id),
    conversation_id UUID REFERENCES conversations(id),
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    status          TEXT DEFAULT 'pending',
    client_confirmed BOOLEAN DEFAULT false,
    earnings        NUMERIC(10,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_provider_time ON bookings(provider_id, start_at);

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    client_id       UUID NOT NULL REFERENCES clients(id),
    rating          INT CHECK (rating BETWEEN 1 AND 5),
    body            TEXT,
    status          TEXT DEFAULT 'pending',
    token           TEXT UNIQUE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE earnings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    booking_id      UUID REFERENCES bookings(id),
    amount          NUMERIC(10,2) NOT NULL,
    label           TEXT,
    earned_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ad_kits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    platform_label  TEXT NOT NULL,
    city            TEXT NOT NULL,
    titles          JSONB NOT NULL,
    bodies          JSONB NOT NULL,
    photo_notes     TEXT,
    current_title_idx INT DEFAULT 0,
    current_body_idx  INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posting_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    ad_kit_id       UUID NOT NULL REFERENCES ad_kits(id),
    day_of_week     INT CHECK (day_of_week BETWEEN 0 AND 6),
    preferred_time  TIME,
    is_active       BOOLEAN DEFAULT true
);

CREATE TABLE posting_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id),
    ad_kit_id       UUID NOT NULL REFERENCES ad_kits(id),
    schedule_id     UUID REFERENCES posting_schedule(id),
    title_used      TEXT,
    body_used       TEXT,
    posted_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE access_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID,
    action          TEXT NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. API Design

### Authentication

All endpoints require `Authorization: Bearer <jwt>` except public booking endpoints.

### Inbox / Messages

```
GET    /api/conversations?status=new,acknowledged&page=1&limit=20
POST   /api/conversations/:id/messages    { "body": "Hey! Thanks for..." }
PATCH  /api/conversations/:id             { "status": "engaged" }
```

**Inbound SMS Webhook (Twilio → LeadLock):**

```
POST /webhooks/twilio/inbound
Content-Type: application/x-www-form-urlencoded

From=+12065551234&To=+12065559999&Body=Hey+are+you+available+tonight
```

### Booking (Public)

```
GET    /book/:provider_slug/slots?date=2026-02-15
POST   /book/:provider_slug/reserve       { "start_at": "...", "name": "Alex", "phone": "..." }
POST   /book/:provider_slug/reschedule    { "booking_id": "uuid", "token": "abc", "new_start_at": "..." }
```

### CRM

```
GET    /api/clients?tag=vip&sort=last_seen_at&page=1
GET    /api/clients/:id
PATCH  /api/clients/:id          { "tags": ["vip"], "internal_notes": "..." }
```

### Earnings

```
POST   /api/earnings             { "booking_id": "uuid", "amount": 300, "label": "1hr session" }
GET    /api/earnings/summary?period=weekly&start=2026-02-01
```

### Reviews

```
GET    /api/reviews?status=pending
PATCH  /api/reviews/:id          { "status": "approved" }
POST   /review/:token            { "rating": 5, "body": "Professional and on time." }
```

### Posting System

```
GET    /api/ad-kits
POST   /api/ad-kits              { "platform_label": "...", "city": "...", "titles": [...], "bodies": [...] }
GET    /api/posting-schedule?week=2026-W07
POST   /api/posting-logs         { "ad_kit_id": "uuid", "schedule_id": "uuid" }
GET    /api/posting-stats
```

---

## 8. UI Screens

### 8.1 Dashboard
- Action items: new leads, due posts, unconfirmed bookings
- Today's schedule
- Weekly snapshot: sessions, earnings, new clients
- Posting streak widget

### 8.2 Inbox
- Two-pane: conversation list + message thread
- Status badges (🔴 New, 🟡 Waiting, 🟢 Engaged, 📅 Booked)
- Quick-reply template pills
- Client profile sidebar

### 8.3 Client Profile
- Display name, tags, session count, total spend, no-show count
- Internal notes (private)
- Session history with earnings and reviews
- Link to inbox conversation

### 8.4 Calendar / Availability
- Weekly calendar with drag-to-set availability
- Booked (blue), Available (green), Blocked (gray)
- Recurring vs. override toggle

### 8.5 Public Booking Page
- Neutral design: "[Alias] — Schedule a Consultation"
- Date picker → time slots → name + phone → confirm
- Verified reviews displayed

### 8.6 Earnings
- Daily/Weekly/Monthly toggle with bar chart
- Session list with amounts
- Manual entry + CSV export

### 8.7 Reviews
- Provider: moderation queue (approve/reject)
- Public: star rating + date + anonymized client ID

### 8.8 Posting Scheduler
- Grid: platforms/cities × days of week
- Color-coded: Green/Yellow/Red
- Post kit drawer on cell tap
- Streak counter

### 8.9 Settings
- Profile & Alias
- Availability Defaults
- SMS Templates
- Notifications
- Security (password, MFA)
- Data Export

---

## 9. Tech Stack + Architecture

| Layer | Choice |
|---|---|
| **Frontend** | Next.js 14 + Tailwind + shadcn/ui |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL 16 (Supabase) |
| **Job Queue** | BullMQ + Redis (or n8n for Phase 0) |
| **SMS** | Twilio Programmable Messaging |
| **Auth** | NextAuth.js + bcrypt + JWT |
| **Realtime** | Supabase Realtime |
| **Hosting** | Vercel + Railway/Fly.io |
| **Encryption** | AES-256-GCM for PII, TLS in transit |

### Architecture

```
Client SMS → Twilio → Webhook → API Server → PostgreSQL
                                    ↕
                              Job Queue (BullMQ / n8n)
                                    ↕
                              Twilio (outbound SMS)
```

---

## 10. Implementation Plan

### Sprint 1 (Days 1–7): Core Infrastructure + Lead Lock
- Project setup, DB schema, Twilio, auth
- Inbound SMS webhook + message storage
- Auto-acknowledge + escalation timers
- Inbox UI

### Sprint 2 (Days 8–14): Booking + CRM + Earnings
- Availability model + calendar UI
- Public booking page + confirmation/reminder flows
- CRM: client list, profiles, tags, notes
- Earnings logging + summary

### Sprint 3 (Days 15–21): Posting System + Reviews + Launch
- Ad kit CRUD + rotation logic
- Posting schedule grid + reminders
- Post kit drawer with copy/paste + checklist
- Verified reviews flow
- Dashboard + security audit + deploy
