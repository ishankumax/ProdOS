# 03. Mobile Wireframe Adaptations

On mobile viewports, the fixed-viewport 3-column desktop layout collapses into a single-column **Tabbed Viewport Stack**, ensuring maximum density and readable monospace metrics on small touch devices.

---

## 1. Mobile Tab Switcher Layout

Instead of a scrolling page, the layout divides desktop columns into three high-priority sliding viewports accessed via a top horizontal navigation tab.

```
┌──────────────────────────────────────────────┐
│ [Logo] P      ● ACTIVE       [V1] | [V2]     │
├──────────────────────────────────────────────┤
│  [ EXECUTION ]   [ STRATEGY ]   [ TELEMETRY ] │
├──────────────────────────────────────────────┤
│                                              │
│  VIEWPORT: EXECUTION (Active Tab)            │
│                                              │
│  [ Daily Score: 8/10 ]   [ Streak: 12 days ] │
│  ==========================================  │
│  [!] OVERDUE                                 │
│  - Review ITB Leads (ITB)                    │
│                                              │
│  [*] GOAL CRITICAL                           │
│  - Gym Session (Fitness)                     │
│                                              │
│  [ ] PLANNED                                 │
│  - Write LLA Spec (RNS)                      │
│  - Build API Route (Invest)                  │
│                                              │
│  [ ] OPTIONAL                                │
│  - Clean inbox                               │
│                                              │
├──────────────────────────────────────────────┤
│ [Dock Bar]  ⊞ Dash   ◎ Goals   ⟳ KPIs   ↗ Info│
└──────────────────────────────────────────────┘
```

---

## 2. Tab Navigation Mapping

* **Tab 1: EXECUTION (Default)**
  * Displays: Daily Score (Section 2), Today's Execution List (Section 1), Weekly Velocity.
  * Purpose: Daily focus and immediate checkoffs.
* **Tab 2: STRATEGY**
  * Displays: Goal Command Center (Section 3), Goal Contribution Breakdown (Section 5).
  * Purpose: Big-picture alignment check.
* **Tab 3: TELEMETRY**
  * Displays: Domain Performance Cards (Section 4), Growth Engine (Section 8), Insights Engine feed (Section 9), and Notifications (Section 6 & 7).
  * Purpose: Momentum assessment and intervention.

---

## 3. Mobile-Specific Interaction Rules

* **Swipe Gestures:** Users can swipe horizontally (left/right) to navigate between tabs (`Execution` $\leftrightarrow$ `Strategy` $\leftrightarrow$ `Telemetry`).
* **Overlay Sheets for Edit Mode:** When Edit Mode is toggled `ON`, mobile exposes bottom sheets for configurations instead of inline forms, preventing keyboard overlay and layout shifts.
* **Compact Monospace Metrics:** Text sizes shrink to `11px/12px` monospace to keep information density high without wrapping words.
* **Tap-Hold Context Actions:** Tapping a task completes it; tapping-and-holding a task opens domain detail sheets or goal mappings.
