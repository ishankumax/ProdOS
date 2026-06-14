# 08. Analytics & Cache Architecture

To provide instantaneous load times for the dashboard, ProdOS Mark 2 utilizes a **hybrid database/caching architecture**:
* **Supabase PostgreSQL** remains the transactional source-of-truth.
* **Redis** acts as a cache-aside layer to store aggregated analytics data.

---

## 1. Analytics Calculations & Formulas

### Daily Score
Evaluates daily execution density.
$$\text{Daily Score} = \left( \frac{\text{Count of Completed Tasks today}}{\text{Count of Planned Tasks due today}} \right) \times 100$$
* *Example:* Monday has 10 tasks due, 5 completed $\rightarrow$ Score = **50%**.

### Weekly Velocity
Aggregated execution velocity for the active week (Monday to Sunday).
$$\text{Weekly Velocity} = \text{Sum of Completed Tasks in the week}$$
$$\text{Weekly Completion Rate} = \left( \frac{\text{Weekly Completed Tasks}}{\text{Weekly Planned Tasks}} \right) \times 100$$
* *Example:* 56 completed / 70 planned $\rightarrow$ Velocity = **56**, Completion Rate = **80%**.

### Growth Trends & KPI Tracking
Calculated by grouping `kpi_logs` dynamically over week-over-week (WoW) intervals, divided by:
1. **Input Metrics (Hours, Sessions):** Action volume.
2. **Output Metrics (Tasks, Code Contributions):** Direct items completed.
3. **Outcome Metrics (Revenue, Net Worth):** Impact results.

---

## 2. Dynamic Insights Rules Engine

The dashboard features **"Good Going"** (positives) and **"Needs Attention"** (warnings) notifications. These are evaluated by a serverless rule function.

### "Good Going" Rules
* **Velocity Strike:** User completes $\ge 90\%$ of daily planned tasks for 3 consecutive days.
* **Domain Focus:** A single domain gets $\ge 5$ completed tasks in a single week.
* **Outcome Target Met:** An outcome metric (e.g. Revenue) reaches $\ge 100\%$ of its target.

### "Needs Attention" Rules
* **Lagging Progress:** Daily score falls below $50\%$ for 2 consecutive days.
* **Outcome Void:** High Input metrics recorded (e.g., 40 hours of "Learning") but zero Output metrics recorded (zero books, courses logged) in the same domain.
* **Stale Domain:** A domain focus area has zero logged tasks or KPI values for 7 consecutive days.

---

## 3. Caching Architecture & Cache-Aside Pattern

We avoid running heavy SQL aggregation queries on every dashboard load. Instead, the backend uses a **Cache-Aside** strategy.

### Cache Flow
```
[Client Request] ──> [Next.js Route / Server Action]
                            │
                            ├──> [Check Redis Cache key: user:{id}:analytics]
                            │          ├──> (Hit) Return cached JSON ──> [Done]
                            │          └──> (Miss) ──┐
                            │                        ▼
                            └──> [Query Supabase Views & Tables]
                                         │
                                         ├──> [Write to Redis Cache]
                                         │
                                         └──> Return JSON to Client
```

### Key Namespace & TTL
* **Cache Key Format:** `user:{userId}:analytics:v2`
* **TTL (Time To Live):** 24 hours (86,400 seconds).
* **Write Invalidation:** Any mutation on `tasks` (completions, creations) or `kpi_logs` triggers an immediate Redis key eviction (`DEL user:{userId}:analytics:v2`).
