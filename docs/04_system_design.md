# Phase 4: System Design

This document outlines the high-level engineering architecture for ProdOS, detailing how data flows from the user interface down to the database and out to external services.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    Client[Next.js Client Components (React)] -->|Server Actions / API Routes| Server[Next.js App Router (Server Node)]
    
    Server -->|Supabase Client| Database[(Supabase Postgres Database)]
    Server -->|Supabase Auth| Auth[Supabase Authentication]
    
    Client -->|Local State / Context| LocalCache[(Zustand / LocalStorage MVP)]
    
    Server -->|Fetch| ExtAPI1[Google Calendar API]
    Server -->|Fetch| ExtAPI2[GitHub GraphQL API]
    Server -->|Fetch| ExtAPI3[OpenAI API (Finance Parsing)]
```

---

## 2. Component Stack Breakdown

### Frontend (Client Tier)
- **Framework:** Next.js (App Router paradigm).
- **Styling:** Tailwind CSS + custom glassmorphism tokens.
- **State Management:**
  - *Local/UI State:* React `useState` & `Context API` (e.g., `DataProvider` MVP).
  - *Server State:* React Server Components (RSC) & Server Actions to minimize client-side fetching overhead.

### Backend (Server Tier)
- **Runtime:** Node.js (via Next.js serverless functions).
- **API Strategy:** Next.js Server Actions for direct database mutations (bypassing traditional REST endpoints for speed and type safety).
- **Validation:** Zod schemas to strictly validate inputs before hitting the database.

### Database & Auth (Data Tier)
- **Provider:** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (Email/Password & OAuth). Row Level Security (RLS) enabled on all tables to ensure data isolation.
- **ORM / Query Builder:** Supabase JS Client for seamless Postgres interactions.

---

## 3. External API Integrations

To achieve the "Unified Dashboard" vision, ProdOS will hook into the following external services over time:

1. **OpenAI API:** 
   - *Use Case:* NLP parsing for finance logs (e.g., "Invested $500 in Tesla" -> JSON object).
2. **Google Calendar API:** 
   - *Use Case:* Syncing today's agenda into the Right Panel.
3. **GitHub API (GraphQL):** 
   - *Use Case:* Pulling commit activity for the "Skill Check" workspace widget.
4. **Health APIs (Apple HealthKit / Google Fit):** 
   - *Use Case:* Displaying sleep, steps, and screen time rings in the Personal Life widget.

---

## 4. Scalability & Performance Strategy
- **Edge Rendering:** Key static shell components can be edge-rendered, while user-specific data is fetched dynamically.
- **Optimistic UI:** When a user checks off a task, the UI immediately reflects the change while the Server Action runs in the background.
- **Caching:** (Future) Redis could be introduced for heavily read, rarely mutated data (like GitHub commit stats), but direct Supabase queries will suffice for the MVP.
