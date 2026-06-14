# 01. Core Architecture Overview & ER Diagram

ProdOS Mark 2 implements an execution-focused life operating system where users manage their time, goals, and metrics across focus areas called **Domains**. 

---

## Core Hierarchy

```
   USER (auth.users)
    │
    ├── DOMAINS (Focus areas, e.g., ReadNovaStory, Fitness)
    │     │
    │     └── TASKS (Belongs to 0 or 1 Domain)
    │           │
    │           └── GOALS (Optional link: Tasks drive Weekly Target progress)
    │
    ├── GOALS (Hierarchical cascading targets)
    │     │
    │     └── Yearly Goal ──> Monthly Target ──> Weekly Target
    │
    └── KPI SYSTEM (Custom metrics logged daily/weekly)
          │
          └── KPI Definitions (Input, Output, Outcome) ──> KPI Logs
```

---

## Entity Descriptions

### 1. User
A tenant in the system, mapped to Supabase Authentication (`auth.users`). Every record in the database is scoped to a specific user to ensure multi-tenancy isolation.

### 2. Domain
A logical categorization representing a core focus area (e.g., Investments, Fitness). Domains are completely customizable. Tasks and KPIs can be associated with a specific domain.

### 3. Task
The base unit of execution. A task:
* Belongs to exactly **one** domain (or **zero** if it is a "Global Task").
* Can optionally link to a **Goal** (specifically, a Weekly Target) to contribute progress.
* Can be completed or uncompleted.

### 4. Goal
A cascading hierarchical target structure:
* **Yearly Goals** cascade down to **Monthly Targets**.
* **Monthly Targets** cascade down to **Weekly Targets**.
* **Weekly Targets** are driven directly by **Tasks** (Daily Actions).
* Progress cascades upwards: completing a task drives the Weekly Target progress, which drives the Monthly Target progress, which drives the Yearly Goal progress.

### 5. KPI Definition & Log
A highly flexible, dynamic metric tracking system:
* **KPI Definition:** Defines a custom metric (e.g., "Revenue", "Books Read", "Weight Loss") categorized by type:
  1. **Input Metrics:** Action-oriented metrics (e.g., Hours spent studying, cold outreach counts).
  2. **Output Metrics:** Immediate results (e.g., Tasks completed, lines written, features shipped).
  3. **Outcome Metrics:** Delayed long-term results (e.g., Revenue generated, weight lost, net worth).
* **KPI Log:** Records daily or weekly values against a KPI Definition.

---

## Mermaid ER Diagram

```mermaid
erDiagram
    users ||--o{ domains : "defines"
    users ||--o{ goals : "creates"
    users ||--o{ tasks : "assigns"
    users ||--o{ kpi_definitions : "specifies"

    domains ||--o{ tasks : "categorizes"
    domains ||--o{ kpi_definitions : "contains"

    goals ||--o{ goals : "cascades_to (parent_id)"
    goals ||--o{ tasks : "evaluated_by"

    kpi_definitions ||--o{ kpi_logs : "records_values_in"

    users {
        uuid id PK "auth.users references"
        string email
    }

    domains {
        uuid id PK
        uuid user_id FK "users.id"
        string name "e.g., ReadNovaStory, Fitness"
        string color_hex
        timestamp created_at
    }

    goals {
        uuid id PK
        uuid user_id FK "users.id"
        uuid parent_id FK "goals.id (Self-reference)"
        string title "e.g., 6000 Github Contributions"
        string goal_level "ENUM: yearly, monthly, weekly"
        numeric target_value "e.g., 6000, 500, 125"
        string unit "e.g., Contributions, Hours"
        date start_date
        date end_date
        timestamp created_at
    }

    tasks {
        uuid id PK
        uuid user_id FK "users.id"
        uuid domain_id FK "domains.id (Nullable)"
        uuid goal_id FK "goals.id (Nullable, usually weekly)"
        string title
        boolean completed
        timestamp completed_at
        date due_date
        numeric weight "default 1.0"
        timestamp created_at
    }

    kpi_definitions {
        uuid id PK
        uuid user_id FK "users.id"
        uuid domain_id FK "domains.id (Nullable)"
        string name "e.g., Revenue, Books"
        string metric_type "ENUM: input, output, outcome"
        string unit "e.g., USD, count, hours"
        numeric target_value "Nullable"
        timestamp created_at
    }

    kpi_logs {
        uuid id PK
        uuid kpi_definition_id FK "kpi_definitions.id"
        numeric value
        date log_date
        string notes "Nullable"
        timestamp created_at
    }
```
