# 07. Analytics & KPI Mapping

ProdOS V2 metrics are categorized to connect daily actions to long-term outcomes. This document outlines the calculations and data mapping rules for the Growth Engine, Daily Score, and Insights Engine.

---

## 1. Growth Engine Metric Split

Metrics are mapped into three logical layers in database tables to display the relationship between effort and results:

```
    INPUTS (Effort)           OUTPUTS (Deliverables)         OUTCOMES (Impact)
  ┌───────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────┐
  │ * Hours worked        │  │ * Tasks completed         │  │ * Revenue ($ generated)
  │ * Study hours logged  │  │ * Github contributions    │  │ * Net Worth tracking  │
  │ * Outreach calls made │  │ * Sales orders closed     │  │ * Weight loss progress│
  └───────────────────────┘  └───────────────────────────┘  └───────────────────────┘
            │                              │                            │
            └───(leads to)─────────────────┴───(resulting in)───────────▼
```

---

## 2. Score & Velocity Equations

### Daily Score Completion Rate
$$\text{Score}_{\text{Today}} = \text{Completed Tasks today} \ / \ \text{Planned Tasks today}$$
$$\text{Change} = \left( \frac{\text{Score}_{\text{Today}} - \text{Score}_{\text{Yesterday}}}{\text{Score}_{\text{Yesterday}}} \right) \times 100$$
* *Example:* 
  * Today: 8/10 = 0.80 (80%)
  * Yesterday: 6/10 = 0.60 (60%)
  * Change = $((0.80 - 0.60) / 0.60) * 100 = \mathbf{+33.3\%}$

### Weekly Velocity
An integer tracking absolute completion count:
$$\text{Velocity} = \sum_{d=\text{Mon}}^{\text{Sun}} \text{Completed Tasks}_d \ / \ \sum_{d=\text{Mon}}^{\text{Sun}} \text{Planned Tasks}_d$$
* *Example:* **56/70** tasks completed over the 7-day calendar cycle.

---

## 3. Deterministic Insights Engine Rules

The Insights Engine uses deterministic calculations comparing current performance deltas against historical ranges.

### Heuristic 1: Trend Velocity (Inputs & Outputs)
* **Goal:** Compare dynamic logs for the current week against the previous week.
* **SQL Heuristic:**
  ```sql
  SELECT 
    name, 
    ((SUM(current_week.value) - SUM(prev_week.value)) / SUM(prev_week.value) * 100) AS pct_change
  FROM kpi_logs
  -- filter by date boundaries...
  ```
* **Output template:** `"Your [KPI Name] increased [pct_change]% this week."`

### Heuristic 2: Contribution Attribution (Outcomes)
* **Goal:** Measure how much a specific domain contributed to overall progress on a shared outcome metric.
* **SQL Heuristic:**
  $$\text{Attribution}_{\text{Domain}} = \frac{\Delta\text{KPI}_{\text{Domain}}}{\Delta\text{KPI}_{\text{Total}}} \times 100$$
* **Output template:** `"[Domain Name] generated [Attribution]% of total [KPI Name] growth."`

### Heuristic 3: Goal Pace Delta (Strategy)
* **Goal:** Calculate linear expectation versus actual progress.
* **Calculation:**
  * Expected progress is computed as:
    $$\text{Expected} = \text{Target} \times \left( \frac{\text{Days elapsed in period}}{\text{Total days in period}} \right)$$
  * Delta is:
    $$\text{Delta} = \text{Expected} - \text{Current}$$
* **Output template:** `"You are [Delta]% behind your yearly [Goal Title] target."`
