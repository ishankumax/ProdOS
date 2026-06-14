# 02. Desktop Command Center Wireframe

This document defines the physical layout of the ProdOS V2 Desktop Dashboard (optimized for 1920x1080 viewports). The interface is structured to remain **entirely above the fold**, fitting all elements in a single fixed viewport split.

---

## 1. ASCII Wireframe Grid (Fixed Viewport)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] ProdOS     [Status] ACTIVE ●    [Toggle] MARK 1 | [MARK 2]                                   [User] demo_session  │
├──────────────────────────┬────────────────────────────────────────────────────┬──────────────────────────┬───────────────┤
│                          │                                                    │                          │               │
│  LEFT COLUMN (25%)       │  CENTER COLUMN (50%)                               │  RIGHT COLUMN (25%)      │               │
│  [Strategy & Alignment]  │  [Execution Engine]                                │  [Performance & Intel]   │               │
│                          │                                                    │                          │               │
│ ┌──────────────────────┐ │ ┌────────────────────────────────────────────────┐ │ ┌──────────────────────┐ │               │
│ │ Goal Command Center  │ │ │ Today's Execution (List Panel)                 │ │ │ Domain Performance   │ │               │
│ │ * Goal 1 (Yearly)    │ │ │ [!] Overdue: Review ITB Leads (Domain: ITB)    │ │ │ [ RNS ] [ ITB ]      │ │               │
│ │   [===       ] 40%   │ │ │ [*] Goal-Crit: Gym Session (Domain: Fitness)   │ │ │ [ Learn ] [ Invest ] │ │               │
│ │ * Goal 2 (Yearly)    │ │ │ [-] Weekly Miss: Invoicing (Domain: RNS)       │ │ └──────────────────────┘ │               │
│ │   [=======   ] 70%   │ │ │ [ ] Planned: Write Spec (Domain: RNS)          │ │ ┌──────────────────────┐ │               │
│ └──────────────────────┘ │ │ [ ] Optional: Clear Inbox (Global)               │ │ │ Growth Engine        │ │               │
│ ┌──────────────────────┐ │ └────────────────────────────────────────────────┘ │ │ * Inputs  [==========] │ │               │
│ │ Goal Contribution    │ │ ┌────────────────────────────────────────────────┐ │ │ * Outputs [=====     ] │ │               │
│ │ Breakdown            │ │ │ Execution Stats HUD                            │ │ │ * Outcomes [===      ] │ │               │
│ │ * Revenue Goal 63%   │ │ │ Today:    8/10 Tasks Completed                 │ │ └──────────────────────┘ │               │
│ │   [RNS][ITB][Ibtida] │ │ │ Yesterday:6/10 Tasks Completed                 │ │ ┌──────────────────────┐ │               │
│ └──────────────────────┘ │ │ Change:   +33% (Upward Trend)                  │ │ │ Intelligence Feed    │ │               │
│                          │ │ Weekly:   56/70 Velocity                       │ │ │ ✓ Good Going         │ │               │
│                          │ └────────────────────────────────────────────────┘ │ │ ⚠ Needs Attention    │ │               │
│                          │                                                    │ │ » Insights Engine    │ │               │
│                          │                                                    │ └──────────────────────┘ │               │
├──────────────────────────┴────────────────────────────────────────────────────┴──────────────────────────┴───────────────┤
│ [Dock Bar] P  |  Dashboard  Goals  Habits  Insights  |  Finance OS  Investment OS     [Control Hub] Edit: [OFF/ON] Theme ☼ │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Specifications

### Header Panel
* **Height:** `48px`
* **Elements:** Left-aligned logo, system pulse, and version toggle; right-aligned user session indicator.

### Core Column Split
* **Height:** `calc(100vh - 128px)` (locks the grid to prevent vertical page scroll)
* **Left Column:** `w-1/4` (25%). Background card overlays with `backdrop-blur` filters.
* **Center Column:** `w-1/2` (50%). Largest visual footprint. Utilizes raw monospace list structures for list components.
* **Right Column:** `w-1/4` (25%). Dedicated widgets displaying metric distributions and text alerts.

### Bottom Dock & Control Hub
* **Height:** `80px` (fixed at bottom of viewport)
* **Control Hub (Bottom Right):** Floating above the dock. Contains:
  1. Execution vs. Configuration Mode Switcher.
  2. Floating Theme Selector.
  3. Calendar Sidebar Toggle.
