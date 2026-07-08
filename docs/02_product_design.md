# Phase 2: Product Design

## 1. User Flow

The core user journey focuses on speed and minimal friction, treating the app as a daily command center.

1. **Open App**
2. **Login / Authenticate** (Supabase Auth)
3. **Dashboard Initialization**
   - Loads the user's preferred or last active **Workspace** (e.g., Personal Life).
4. **Context Switching**
   - User clicks a different workspace from the left **Sidebar** (e.g., Financial Dashboard).
   - The two center widgets swap instantly; the shell (sidebar, header, goals rail) remains fixed.
5. **Daily Execution Flow**
   - Select a Goal from the **Goals Rail** to filter tasks.
   - Add a "Today's Task" in the **Tasks Widget**.
   - Complete the task → It moves to the **Completed Tasks Drawer**.
   - The **Progress Bar** in the header updates automatically based on tasks completed vs. remaining.

---

## 2. Wireframes Architecture (The "Two-Level Shell")

### Level 1: The Fixed Shell (Always Visible)
- **Left Sidebar:** Compressible workspace switcher (Personal, Skill Check, Finance, InTheBox).
- **Header:** Workspace title, daily dynamic progress bar.
- **Goals Rail:** Vertical icon-based filter menu attached to the left of the content area.
- **Completed Drawer:** Hidden slide-out drawer triggered from the left edge.
- **Floating Action Controls:** Bottom-right context-aware tools (Pomodoro, Calculator, Quick Add).

### Level 2: The Context Widgets (Swappable)
- **Standard Layout (Personal/Skill/Work):**
  - **Left Widget:** Tasks Widget (Today's Execution).
  - **Right Widget:** Context-specific (e.g., Health Rings, GitHub Monitor, Habit Tracker).
  - **Right Panel:** Global clock, date, and calendar agenda (Optional/Collapsible).
- **Custom Layout (Finance):**
  - Full-width grid for Net Worth, Asset Distribution, Savings/Emergency bars, and AI Chat Logging.

---

## 3. Design System Definition

Before we scale our UI components, we adhere strictly to the following tokens:

### Colors (Dark Mode First)
- **Background:** Very dark slate/blue `#0d0d14` (Hex) for deep contrast.
- **Surface Panels:** Translucent white `bg-white/5` with `border-white/10` for glassmorphism.
- **Primary Accent:** Vivid Blue `#3b82f6` (Tailwind `blue-500`) for active states and primary actions.
- **Secondary Accents:**
  - Success/Growth: `#4ade80` (Tailwind `green-400`)
  - Warning/Focus: `#facc15` (Tailwind `yellow-400`)
  - Habit/Health: `#a855f7` (Tailwind `purple-500`)
- **Text:** 
  - Primary: `text-white` (100% opacity)
  - Secondary: `text-white/60`
  - Disabled/Muted: `text-white/40`

### Typography
- **Primary Font:** Inter or Roboto (sans-serif) for high legibility.
- **Monospace Font:** JetBrains Mono or standard `font-mono` for numbers, finance, and code.
- **Hierarchy:**
  - Headings: Tight tracking (`tracking-tight`), Bold.
  - Subheadings/Labels: Uppercase, wide tracking (`tracking-widest`), tiny text (`text-xs`).

### Spacing & Layout
- **Containers:** Rounded corners (`rounded-xl` for widgets, `rounded-full` for buttons).
- **Padding:** Consistent `p-6` or `p-8` inside widgets to ensure breathing room.
- **Borders:** Thin, subtle borders (`border border-white/10`) to separate sections without visual clutter.

### Animations & Micro-interactions
- **Hover States:** Subtle background brightening (`hover:bg-white/10`) and slight border color shifts.
- **Transitions:** Global `transition-all duration-300` on sidebars, drawers, and buttons for smooth, liquid-like resizing.
- **Feedback:** Task completion strike-through and opacity fade.

### Icons
- Minimalist, stroke-based icons (Lucide React or Heroicons). No filled icons unless marking an active state.
