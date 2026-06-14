# ProdOS Mark 2 — Low Level Architecture (LLA)

Welcome to the **ProdOS Mark 2 Low Level Architecture Design Suite**. This documentation defines the structures, database schemas, APIs, and business rules for the next generation of ProdOS.

---

## Architectural Principles

1. **Isolation:** Mark 2 logic, components, and views run completely isolated from the current Mark 1 systems to prevent breaking changes.
2. **Single Source of Truth:** Goal progress and execution stats are dynamically computed on-the-fly via PostgreSQL Views rather than duplicating state as hardcoded database columns.
3. **Dynamic KPI Tracking:** KPIs are dynamic database definitions and log records, allowing users to define and log custom metrics (Revenue, Hours, Outreach, Weight) at runtime without schema migrations.
4. **Performance Caching:** Read-heavy dashboard queries are served by a Redis Cache-Aside layer, invalidating instantly on any task mutation or log update.

---

## Index of Design Documents

Click on the files below to view specific sections of the architecture design:

* **[01. Overview & ER Diagram](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/01_overview_and_erd.md)**
  * Conceptual hierarchies, entity descriptions, and the complete database relationships represented as a Mermaid ER Diagram.
* **[02. SQL DDL Schema](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/02_sql_ddl.md)**
  * Database table schemas (domains, goals, tasks, KPI templates, and logs), triggers, RLS policies, and PostgreSQL views for dynamic nested progress rollups.
* **[03. Database Index Strategy](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/03_index_strategy.md)**
  * Performance indexes (partial indexes, compound indexes, descending logs) to support sub-millisecond execution and scale to millions of metrics.
* **[04. Migration Plan](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/04_migration_plan.md)**
  * The parallel-run schema deployment, data transformation script to migrate Mark 1 entities to Mark 2, verification checks, and rollback commands.
* **[05. TypeScript Types](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/05_typescript_types.md)**
  * Types, interfaces, and aggregates that map database tables and analytics states to TypeScript.
* **[06. API Contracts](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/06_api_contracts.md)**
  * Request/response contracts for Next.js Route Handlers and Server Actions, complete with Zod input validation schemas.
* **[07. Business Logic & Pseudocode](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/07_business_logic.md)**
  * Pseudocode algorithms for hierarchical goal evaluations, task state transitions, and caching/eviction.
* **[08. Analytics & Cache Architecture](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/08_analytics_architecture.md)**
  * Dashboard cache structure, Redis keyspace design, dynamic Insights Engine guidelines, and scoreboard formulas.
