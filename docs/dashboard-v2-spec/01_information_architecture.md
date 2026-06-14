# 01. Information Architecture (IA)

This document establishes the Information Architecture of the ProdOS V2 Dashboard, framing the layout and flow around the **5 Primary Questions** of the user.

---

## 1. Primary Focus Areas (Addressing the Core Questions)

The dashboard does not display random indicators; every widget directly resolves one of the five primary execution queries:

| Question | Resolving Component | Column | Purpose |
| :--- | :--- | :--- | :--- |
| **1. What requires action today?** | `Today's Execution` (Section 1) | Center | Action list sorted strictly by priority. |
| **2. What is helping achieve yearly goals?** | `Goal Command Center` (Section 3) & `Goal Contribution` (Section 5) | Left | Tracks target pace and shows domain attribution. |
| **3. What is being neglected?** | `Needs Attention` (Section 7) | Right | Identifies silent declines or inactive domains. |
| **4. Which domain is growing?** | `Domain Performance` (Section 4) & `Growth Engine` (Section 8) | Right / Center | Highlights domain KPI trends and input/output velocity. |
| **5. How can today outperform yesterday?** | `Daily Score` (Section 2) & `Good Going` (Section 6) | Center / Right | Tracks historical execution metrics (Today vs. Yesterday). |

---

## 2. Dynamic Data Flow Architecture

The data flows from high-level strategic alignment (left) down to everyday daily task actions (center), outputting telemetry metrics (right).

```
[STRATEGY: Left Column] ──(defines targets)──> [EXECUTION: Center Column]
          │                                                  │
          │                                           (emits metrics)
          │                                                  ▼
          └───(evaluates outcomes)──────────────> [INTELLIGENCE: Right Column]
```

---

## 3. Screen Estate Allocations & Prioritization

The screen real estate is balanced to guide user eye-movement naturally from **Execution** (center) to **Strategy** (left) to **Telemetry** (right):

```
┌──────────────────────────┬────────────────────────────────────────────────────┬──────────────────────────┐
│                          │                                                    │                          │
│     STRATEGY (25%)       │                  EXECUTION (50%)                   │   INTELLIGENCE (25%)     │
│                          │                                                    │                          │
│  * Goal Command Center   │  * Today's Execution (Highest Visual Weight)      │  * Domain Performance    │
│  * Goal Contribution     │  * Daily Score Indicator                           │  * Growth Engine         │
│    Breakdown             │  * Weekly Velocity Metrics                         │  * Insights Feed         │
│                          │                                                    │  * Notifications Feed    │
│                          │                                                    │                          │
└──────────────────────────┴────────────────────────────────────────────────────┴──────────────────────────┘
```
