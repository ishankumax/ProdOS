# Phases 6, 7 & 8: API Design, Tech Stack, and Folder Structure

This document outlines the final architectural scaffolding required before entering the Backend/Frontend implementation phases.

---

## Phase 6: API Design (Server Actions Paradigm)

Because we are using Next.js App Router, we will bypass traditional REST endpoints (`/api/...`) in favor of **React Server Actions**. This provides end-to-end type safety and reduces network waterfall.

### `actions/workspace.ts`
- `getWorkspaces()`: Retrieves all active workspaces for the auth'd user.
- `createWorkspace(data: CreateWorkspaceSchema)`: Provisions a new context.

### `actions/tasks.ts`
- `getTasksForWorkspace(workspaceId)`: Fetches pending tasks.
- `getCompletedTasks(workspaceId, dateRange)`: Populates the Completed Drawer.
- `createTask(data: CreateTaskSchema)`: Inserts a task.
- `toggleTaskComplete(taskId)`: Updates status and triggers revalidation (`revalidatePath('/')`).

### `actions/finance.ts`
- `logFinanceRecord(data: FinanceSchema)`: Inserts a transaction.
- `parseAIFinanceLog(naturalLanguage: string)`: Sends text to OpenAI, receives JSON, then calls `logFinanceRecord`.
- `getNetWorth()`: Calculates and aggregates total value.

---

## Phase 7: Tech Stack (The Final Selection)

We have chosen a highly modern, Server-First stack optimized for speed and developer experience.

- **Frontend:** Next.js 14+ (App Router), React Server Components.
- **Styling:** Tailwind CSS, Lucide React (Icons).
- **Backend/API:** Next.js Server Actions (Node.js runtime).
- **Database:** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (Server-side cookies implementation via `@supabase/ssr`).
- **Storage:** Supabase Storage (for user avatars or custom workspace backgrounds).
- **Validation:** Zod (for validating client inputs and AI responses).
- **Hosting:** Vercel (Edge-optimized deployments).
- **External APIs:** OpenAI (Finance NLP), Google Calendar API.

---

## Phase 8: Folder Structure (Scalable Foundation)

Before writing backend code, the project directory must reflect this strict modular pattern to separate concerns:

```text
prod-os/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes if any)
│   ├── (auth)/           # Login/Signup route groups
│   ├── dashboard/        # Main authenticated shell
│   └── layout.tsx
├── components/           # Reusable UI Components
│   ├── layout/           # Shell, Sidebar, RightPanel
│   ├── workspaces/       # FinanceWidget, TasksWidget, etc.
│   └── ui/               # Core atomic components (Buttons, Inputs)
├── actions/              # React Server Actions (Database Mutations)
├── hooks/                # Custom React Hooks (e.g., useOptimisticTasks)
├── lib/                  # Third-party instantiations (Supabase client, OpenAI client)
├── services/             # Complex business logic wrappers (e.g., AI parsing logic)
├── schemas/              # Zod Validation Schemas
├── types/                # TypeScript Interfaces (Database generated types)
├── utils/                # Helper functions (date formatting, currency formatting)
└── database/             # Supabase migrations, raw SQL scripts, ER diagrams
```

This folder structure guarantees that UI components remain "dumb" and strictly rely on the `actions/` and `services/` layers for heavy lifting.
