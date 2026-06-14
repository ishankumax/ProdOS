# 04. React Component Hierarchy

To support clean maintenance and avoid large monolithic files, the ProdOS V2 dashboard is structured into granular, modular React components. 

---

## 1. Component Nesting Structure

```
DashboardShell
├── Header
│   ├── Logo
│   ├── SystemPulse
│   └── VersionToggle
├── DesktopLayout (Visible on screen width >= 1024px)
│   ├── LeftColumn (Strategy & Alignment)
│   │   ├── GoalCommandCenter
│   │   │   └── GoalRow (Yearly / Monthly / Weekly targets)
│   │   └── GoalContributionBreakdown
│   │       └── ContributionStackBar
│   ├── CenterColumn (Execution Engine)
│   │   ├── ExecutionStatsHUD (Daily Score, Weekly Velocity, Streaks)
│   │   └── TodayExecutionList
│   │       ├── TaskCategoryGroup (Overdue, Goal Critical, Planned, etc.)
│   │       └── TaskRowItem
│   └── RightColumn (Performance & Intelligence)
│       ├── DomainPerformanceGrid
│       │   └── DomainPerformanceCard (Mini OS card per domain)
│       ├── GrowthEngineWidget
│       │   └── MetricCategoryBar (Inputs, Outputs, Outcomes)
│       └── IntelligenceHub
│           ├── GoodGoingFeed
│           ├── NeedsAttentionFeed
│           └── InsightsEngineFeed
├── MobileLayout (Visible on screen width < 1024px)
│   ├── MobileTabNav
│   └── SwipeableTabContainer
│       ├── ExecutionTab (StatsHUD + TodayExecutionList)
│       ├── StrategyTab (GoalCommand + GoalContribution)
│       └── TelemetryTab (DomainPerformance + GrowthEngine + IntelHub)
└── ControlCenter (Bottom Right Fixed Floating)
    ├── EditModeToggle (Execution vs. Configuration Switch)
    ├── ThemeSelector
    └── CalendarToggle
```

---

## 2. Prop Mapping & Context Providers

### Context Providers
* **`VersionProvider`:** Manages the system active version state ("Mark 1" vs. "Mark 2") globally.
* **`EditModeProvider`:** Manages the dashboard workspace state (`isEditModeEnabled: boolean`). Children read this context to toggle between configuration forms and execution layouts.

### Key Props Mapped per Component

| Component | Props Input | Internal Actions |
| :--- | :--- | :--- |
| `GoalRow` | `{ goal: Goal, progress: number, children: Goal[] }` | Renders expected target line and forecast status. |
| `TaskRowItem` | `{ task: Task, isEditMode: boolean }` | Toggles checkbox (Execution) or displays Delete/Goal-Link fields (Edit Mode). |
| `DomainPerformanceCard` | `{ domain: Domain, metrics: KpiLog[], activeTasksCount: number }` | Aggregates daily logs to render trend arrows. |
| `MetricCategoryBar` | `{ category: 'input' \| 'output' \| 'outcome', value: number }` | Renders relative progress ratio against targets. |
